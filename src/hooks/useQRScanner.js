// src/hooks/useQRScanner.js
import { useState } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import * as Haptics from 'expo-haptics';
import { Audio } from 'expo-audio';
import * as Location from 'expo-location';
import { getDistance } from 'geolib';
import axios from 'axios';

const validQRCode = 'QR-ACCESS-EDU-123456-VALID';
const validExitQRCode = 'QR-ACCESS-EDU-123456-EXIT';
const validCoords = { latitude: 4.086601, longitude: -76.197253 };
const radius = 100;

let alertVisible = false;

const showAlertOnce = (title, message, callback = () => {}) => {
  if (alertVisible) return;
  alertVisible = true;
  Alert.alert(title, message, [
    {
      text: 'OK',
      onPress: () => {
        alertVisible = false;
        callback();
      },
    },
  ]);
};

export const useQRScanner = ({ tipo, navigation }) => {
  const [scanned, setScanned] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [sound, setSound] = useState(null); // Estado para el sonido

  const getUserLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === 'granted') {
      return await Location.getCurrentPositionAsync({});
    } else {
      Alert.alert('Error', 'Permiso para acceder a la ubicación denegado');
      return null;
    }
  };

  const isValidLocation = (coords) => {
    const distance = getDistance(coords, validCoords);
    return distance <= radius;
  };

  const resetScanner = () => {
    setScanned(false);
    setIsProcessing(false);
  };

  const handleBarcodeScanned = async ({ data }) => {
    if (scanned || isProcessing) return;

    setScanned(true);
    setIsProcessing(true);

    const trimmed = data.trim().toLowerCase();
    const expectedQR = tipo === 'entrada' ? validQRCode : validExitQRCode;

    if (trimmed !== expectedQR.toLowerCase()) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      showAlertOnce('Error', 'Código QR incorrecto', resetScanner);
      return;
    }

    const location = await getUserLocation();
    if (!location || !isValidLocation(location.coords)) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      showAlertOnce('Error', 'Ubicación no válida', resetScanner);
      return;
    }

    try {
      const token = await AsyncStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const baseUrl = Constants.expoConfig.extra.REACT_APP_BACKEND_URL;
      const response = await axios.post(
        `${baseUrl}/api/ingresos`,
        { tipo_ingreso: tipo },
        { headers }
      );

      if (response.status === 201) {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        const { sound: newSound } = await Audio.Sound.createAsync(
          require('../../assets/success.mp3')
        );
        setSound(newSound);
        await newSound.playAsync();

        setTimeout(() => {
          showAlertOnce(
            tipo === 'entrada' ? 'Ingreso exitoso' : 'Salida exitosa',
            'Registro realizado correctamente',
            () => navigation.goBack()
          );
        }, 150);
      }
    } catch (error) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      showAlertOnce('Error', 'Fallo al registrar. Intenta de nuevo.', resetScanner);
    }
  };

  return {
    scanned,
    isProcessing,
    handleBarcodeScanned,
    resetScanner,
  };
};
