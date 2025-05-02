import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons"; // Importar íconos de MaterialIcons

export default function DatoUsuario({
  label,
  value,
  onChangeText,
  editable = true,
  secureTextEntry = false,
}) {
  const [isPasswordVisible, setPasswordVisible] = useState(!secureTextEntry); // Controlar visibilidad de la contraseña

  return (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputWrapper}>
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
          secureTextEntry={!isPasswordVisible && secureTextEntry} // Alternar visibilidad
        />
        {secureTextEntry && (
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={() => setPasswordVisible(!isPasswordVisible)} // Alternar visibilidad
          >
            <MaterialIcons
              name={isPasswordVisible ? "visibility" : "visibility-off"} // Cambiar ícono
              size={24}
              color="#2E7D32"
            />
          </TouchableOpacity>
        )}
      </View>
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
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    width: "90%",
    position: "relative",
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
    flex: 1, // Ocupa el espacio restante
  },
  disabledInput: {
    backgroundColor: "#f0f0f0",
    color: "#333",
  },
  iconContainer: {
    position: "absolute",
    right: 10, // Alinear el ícono a la derecha
  },
});