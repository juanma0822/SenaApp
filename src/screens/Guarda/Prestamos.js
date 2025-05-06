import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function Prestamos() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Pantalla de Préstamos</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E8F5E9", // Fondo verde claro
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#00AF00", // Verde institucional
  },
});