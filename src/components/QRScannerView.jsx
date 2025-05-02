// src/components/QRScannerView.jsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { CameraView } from 'expo-camera';

export default function QRScannerView({ onScanned, isProcessing, scanned, title }) {
  const FRAME_SIZE = 280;

  return (
    <>
      <Text style={styles.title}>{title}</Text>

      <View style={styles.cameraContainer}>
        <CameraView
          style={styles.camera}
          barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
          onBarcodeScanned={scanned || isProcessing ? undefined : onScanned}
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
    </>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 20,
    textAlign: 'center',
  },
  cameraContainer: {
    width: 280,
    height: 280,
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
    width: 240,
    height: 240,
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
});
