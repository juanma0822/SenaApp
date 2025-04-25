import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Location from 'expo-location';
import { getDistance } from 'geolib';

const validQRCode = 'QR-ACCESS-EDU-123456-VALID';
const validExitQRCode = 'QR-ACCESS-EDU-123456-EXIT';
const validCoords = { latitude: 4.086601, longitude: -76.197253 };
const radius = 100;

export default function EscanearQR({ route, navigation }) {
  const { tipo } = route.params; // 'ingreso' o 'salida'

  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [cameraActive, setCameraActive] = useState(true); // Controlar si la cámara está activa
  const [cameraUnmounted, setCameraUnmounted] = useState(false); // Desmontar la cámara después de un escaneo exitoso

  useEffect(() => {
    requestPermission();
  }, []);

  const handleBarcodeScanned = async ({ data }) => {
    if (!scanned) {
      setScanned(true); // Deshabilitar el escaneo
      setCameraActive(false); // Pausar la cámara

      const isValidQR = tipo === 'ingreso'
        ? data.trim() === validQRCode.trim()
        : data.trim() === validExitQRCode.trim();

      if (isValidQR) {
        const userLocation = await getUserLocation();
        console.log(userLocation);
        if (userLocation && isValidLocation(userLocation.coords)) {
          setCameraUnmounted(true); // Desmontar la cámara
          resetScanner();
          Alert.alert(
            tipo === 'ingreso' ? 'Ingreso exitoso' : 'Salida exitosa',
            `Código escaneado correctamente`,
            [
              {
                text: 'OK',
                onPress: () => navigation.goBack(), // Regresar a la pantalla anterior
              },
            ]
          );
        } else {
          Alert.alert('Error', 'Ubicación no válida');
          setCameraUnmounted(true); // Desmontar la cámara
        }
      } else {
        Alert.alert('Error', 'Código QR incorrecto');
        resetScanner();
      }
    }
  };

  const resetScanner = () => {
    setScanned(false); // Permitir escaneo nuevamente
    setCameraActive(true); // Reactivar la cámara
  };

  const getUserLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === 'granted') {
      return await Location.getCurrentPositionAsync({});
    } else {
      Alert.alert('Error', 'Permiso para acceder a la ubicación denegado');
      return null;
    }
  };

  const isValidLocation = (userCoords) => {
    const distance = getDistance(userCoords, validCoords);
    return distance <= radius;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {tipo === 'ingreso' ? 'Escanea tu Ingreso' : 'Escanea tu Salida'}
      </Text>

      <View style={styles.cameraContainer}>
        {!cameraUnmounted && cameraActive && (
          <CameraView
            style={styles.camera}
            barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
            onBarcodeScanned={scanned ? undefined : handleBarcodeScanned} // Deshabilitar escaneo si ya se escaneó
          />
        )}
      </View>

      {scanned && !cameraUnmounted && (
        <TouchableOpacity
          style={styles.rescanButton}
          onPress={resetScanner} // Permitir reintentar el escaneo
        >
          <Text style={styles.rescanText}>🔄 Reintentar escaneo</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00AF00', // Fondo verde institucional
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  cameraContainer: {
    width: 280,
    height: 280,
    borderWidth: 4,
    borderColor: '#007F00', // Verde más oscuro
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,
  },
  camera: {
    flex: 1,
  },
  rescanButton: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
  },
  rescanText: {
    color: '#00AF00',
    fontWeight: 'bold',
  },
});