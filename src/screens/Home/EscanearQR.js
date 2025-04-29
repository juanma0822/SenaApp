import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Dimensions, ActivityIndicator } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Location from 'expo-location';
import { getDistance } from 'geolib';
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

const validQRCode = 'QR-ACCESS-EDU-123456-VALID';
const validExitQRCode = 'QR-ACCESS-EDU-123456-EXIT';
const validCoords = { latitude: 4.086601, longitude: -76.197253 };
const radius = 100;

const { width } = Dimensions.get('window');
const FRAME_SIZE = width * 0.7;

export default function EscanearQR({ route, navigation }) {
  const { tipo } = route.params; // 'ingreso' o 'salida'

  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false); // Controlar si el lector de QR está activo
  const [isProcessing, setIsProcessing] = useState(false); // Controlar el proceso de POST

  useEffect(() => {
    requestPermission();
  }, []);

  const handleBarcodeScanned = async ({ data }) => {
    if (!scanned && !isProcessing) {
      setScanned(true); // Deshabilitar el lector de QR
      setIsProcessing(true); // Marcar que estamos procesando

      const isValidQR = tipo === 'ingreso'
        ? data.trim() === validQRCode.trim()
        : data.trim() === validExitQRCode.trim();

      if (isValidQR) {
        const userLocation = await getUserLocation();
        if (userLocation && isValidLocation(userLocation.coords)) {
          try {
            const token = await AsyncStorage.getItem('token'); // Obtener el token del AsyncStorage
            const headers = {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            };

            const baseUrl = Constants.expoConfig.extra.REACT_APP_BACKEND_URL; // Asegúrate de que esta constante esté configurada
            const tipoIngreso = tipo === 'ingreso' ? 'entrada' : 'salida';

            // Realizar la solicitud POST
            const response = await axios.post(
              `${baseUrl}/api/ingresos`,
              { tipo_ingreso: tipoIngreso },
              { headers }
            );

            if (response.status === 201) {
              Alert.alert(
                tipo === 'ingreso' ? 'Ingreso exitoso' : 'Salida exitosa',
                `Registro realizado correctamente`,
                [
                  {
                    text: 'OK',
                    onPress: () => navigation.goBack(), // Regresar a la pantalla anterior
                  },
                ]
              );
            }
          } catch (error) {
            console.error('Error al registrar el ingreso/salida:', error);
            Alert.alert('Error', 'No se pudo registrar el ingreso/salida. Inténtalo de nuevo.');
          }
        } else {
          Alert.alert('Error', 'Ubicación no válida');
        }
      } else {
        Alert.alert('Error', 'Código QR incorrecto');
      }

      // Habilitar el botón "Reintentar escaneo" después del proceso
      setIsProcessing(false); // Desbloquear proceso
    }
  };

  const resetScanner = () => {
    setScanned(false); // Reactivar el lector de QR
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

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>Necesitamos tu permiso para usar la cámara</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Conceder Permiso</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {tipo === 'ingreso' ? 'Escanea tu Ingreso' : 'Escanea tu Salida'}
      </Text>

      <View style={styles.cameraContainer}>
        <CameraView
          style={styles.camera}
          barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
          onBarcodeScanned={scanned || isProcessing ? undefined : handleBarcodeScanned} // Deshabilitar escaneo si ya se escaneó o está procesando
        >
          <View style={styles.overlay}>
            <View style={styles.scanFrame} />
            {isProcessing && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#25D366" />
                <Text style={styles.loadingText}>Procesando...</Text>
              </View>
            )}
          </View>
        </CameraView>
      </View>

      <Text style={styles.instructionText}>
        Alinea el código QR dentro del marco
      </Text>

      {scanned && (
        <TouchableOpacity
          style={styles.rescanButton}
          onPress={resetScanner} // Permitir reintentar el escaneo
        >
          <Text style={styles.rescanText}> Reintentar escaneo</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00AF00',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 20,
  },
  cameraContainer: {
    width: FRAME_SIZE,
    height: FRAME_SIZE,
    overflow: 'hidden',
    borderRadius: 12,
    marginBottom: 20,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: FRAME_SIZE - 40,
    height: FRAME_SIZE - 40,
    borderWidth: 2,
    borderColor: '#ffffff',
    borderRadius: 12,
  },
  loadingContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#ffffff',
    marginTop: 10,
    fontSize: 16,
  },
  instructionText: {
    color: '#ffffff',
    opacity: 0.8,
    marginTop: 20,
    fontSize: 16,
  },
  rescanButton: {
    backgroundColor: '#25D366',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 24,
    marginTop: 20,
  },
  rescanText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  permissionText: {
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#25D366',
    padding: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#ffffff',
    textAlign: 'center',
  },
});
