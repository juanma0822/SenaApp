import React, { useState } from 'react';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Button, StyleSheet, Text, View } from 'react-native';
import * as Location from 'expo-location';
import { getDistance } from 'geolib';

const validQRCode = 'QR-ACCESS-EDU-123456-VALID'; // Código QR de ingreso
const validExitQRCode = 'QR-ACCESS-EDU-123456-EXIT'; // Código QR de salida
const validCoords = { latitude: 4.086601, longitude: -76.197253}; // Coordenadas de la institución
const radius = 100; // Radio en metros para la ubicación válida



export default function HistorialScreen() {
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [scannedData, setScannedData] = useState('');
  const [scanned, setScanned] = useState(false);
  const [location, setLocation] = useState(null);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  const handleBarcodeScanned = async ({ data }) => {
    if (!scanned) {
      setScannedData(data);
      setScanned(true);
      console.log(data);
      console.log(validExitQRCode);

      if (data.trim() === validQRCode.trim() || data.trim() === validExitQRCode.trim()) {
        const userLocation = await getUserLocation();
        if (userLocation && isValidLocation(userLocation.coords)) {
          if (data.trim() === validQRCode.trim()) {
            alert(`Ingreso exitoso para el código: ${data}`);
          } else if (data.trim() === validExitQRCode.trim()) {
            alert(`Salida exitosa para el código: ${data}`);
          }
        } else {
          alert('Ubicación no válida');
        }
      } else {
        alert('Acceso denegado');
      }
    }
  };

  const getUserLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === 'granted') {
      const location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      return location;
    } else {
      alert('Permission to access location was denied');
      return null;
    }
  };

  const isValidLocation = (userCoords) => {
    const distance = getDistance(userCoords, validCoords);
    return distance <= radius;
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={facing}
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
        onBarcodeScanned={handleBarcodeScanned}
      />
      {scannedData && <Text style={styles.text}>Escaneado: {scannedData}</Text>}
      {scanned && <Button title="Reiniciar Escaneo" onPress={() => setScanned(false)} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  text: {
    fontSize: 20,
    color: 'black',
  },
});
