import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as Location from "expo-location";
import { getDistance } from "geolib";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import * as Haptics from "expo-haptics";
import { Audio } from "expo-av";
import QRScannerView from "../../components/QRScannerView";
import { useQRScanner } from "../../hooks/useQRScanner";


const { width } = Dimensions.get("window");
const FRAME_SIZE = width * 0.7;


export default function EscanearQR({ route, navigation }) {
  const { tipo } = route.params; // 'entrada' o 'salida'

  const {
    scanned,
    isProcessing,
    handleBarcodeScanned,
    resetScanner
  } = useQRScanner({ tipo, navigation });

  const [permission, requestPermission] = useCameraPermissions();

  useEffect(() => {
    requestPermission();
  }, []);

  const getUserLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === "granted") {
      return await Location.getCurrentPositionAsync({});
    } else {
      Alert.alert("Error", "Permiso para acceder a la ubicación denegado");
      return null;
    }
  };


  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>
          Necesitamos tu permiso para usar la cámara
        </Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Conceder Permiso</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <QRScannerView
        title={tipo === "entrada" ? "Escanea tu Ingreso" : "Escanea tu Salida"}
        scanned={scanned}
        isProcessing={isProcessing}
        onScanned={handleBarcodeScanned}
      />

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
    backgroundColor: "#00AF00",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 20,
  },
  cameraContainer: {
    width: FRAME_SIZE,
    height: FRAME_SIZE,
    overflow: "hidden",
    borderRadius: 12,
    marginBottom: 20,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  scanFrame: {
    width: FRAME_SIZE - 40,
    height: FRAME_SIZE - 40,
    borderWidth: 2,
    borderColor: "#ffffff",
    borderRadius: 12,
  },
  loadingContainer: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#ffffff",
    marginTop: 10,
    fontSize: 16,
  },
  instructionText: {
    color: "#ffffff",
    opacity: 0.8,
    marginTop: 20,
    fontSize: 16,
  },
  rescanButton: {
    backgroundColor: "#25D366",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 24,
    marginTop: 20,
  },
  rescanText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  permissionText: {
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#25D366",
    padding: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: "#ffffff",
    textAlign: "center",
  },
});
