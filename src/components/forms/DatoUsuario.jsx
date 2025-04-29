// src/components/forms/DatoUsuario.jsx
import React from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";

export default function DatoUsuario({ label, value, onChangeText, editable = true }) {
  return (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          !editable && styles.disabledInput, // Aplica estilos si está deshabilitado
        ]}
        value={value}
        editable={editable}
        onChangeText={onChangeText}
        placeholder={`Escribe tu ${label.toLowerCase()}`}
        placeholderTextColor="#999"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 20,
    width: "100%",
    alignItems: "center",
  },
  label: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2E7D32",
    marginBottom: 8,
    textAlign: "center",
  },
  input: {
    fontSize: 15,
    color: "#333",
    backgroundColor: "#fff",
    borderColor: "#00AF00",
    borderWidth: 1.5,
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 20,
    textAlign: "center",
    width: "90%",
  },
  disabledInput: {
    backgroundColor: "#f0f0f0",
    color: "#333",
  },
});
