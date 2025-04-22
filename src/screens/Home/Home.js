import React, { useState, useEffect } from "react";
import { Text, StyleSheet, View, TouchableOpacity, Alert } from "react-native";

export default function Home(props) {
  const { usuario } = props.route.params;

  // Función para cerrar sesión
  const handleSignOut = () => {
    Alert.alert("Cerrando sesión", "Has salido correctamente!");
    props.navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "Login" }],
      })
    );
  };

  // Funciones de escaneo de QR, por ahora vacías
  const handleRegisterEntry = () => {
    console.log("Registrar Ingreso");
    // Lógica para manejar el escaneo de QR de ingreso
  };

  const handleRegisterExit = () => {
    console.log("Registrar Salida");
    // Lógica para manejar el escaneo de QR de salida
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>👋 Bienvenido, {usuario.nombres}!</Text>
      <Text style={styles.infoText}>📄 Cédula: {usuario.numero_documento}</Text>

      {/* Opciones de Ingreso y Salida */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.optionButton}
          onPress={handleRegisterEntry} // Función para registrar ingreso
        >
          <Text style={styles.optionText}>Registrar Ingreso</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.optionButton}
          onPress={handleRegisterExit} // Función para registrar salida
        >
          <Text style={styles.optionText}>Registrar Salida</Text>
        </TouchableOpacity>
      </View>

      {/* Botón de cerrar sesión */}
      <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
        <Text style={styles.signOutButtonText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#00AF00", // Verde institucional
    marginBottom: 20,
  },
  infoText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "column",
    justifyContent: "center", // Centrado horizontalmente
    alignItems: "center", // Centrado verticalmente
    width: "80%",
    marginBottom: 20,
    gap: 20, // Espacio entre los botones
  },
  optionButton: {
    backgroundColor: "#00AF00", // Estilo de fondo verde
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: "center",
  },
  optionText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  signOutButton: {
    backgroundColor: "#ff5c5c", // Rojo para cerrar sesión
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
  },
  signOutButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
