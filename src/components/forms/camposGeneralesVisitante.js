import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { Picker } from "@react-native-picker/picker";

export default function CamposGeneralesVisitante({ onSubmit }) {
  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    tipo_documento: "C.C", // Valor inicial del Picker
    numero_documento: "",
    motivo: "",
    area_destino: "",
  });

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    const { nombres, apellidos, tipo_documento, numero_documento, motivo, area_destino } = formData;

    // Validar campos obligatorios
    if (!nombres || !apellidos || !tipo_documento || !numero_documento || !motivo || !area_destino) {
      Alert.alert("Error", "Todos los campos son obligatorios.");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const baseUrl = Constants.expoConfig.extra.REACT_APP_BACKEND_URL;
      const response = await axios.post(
        `${baseUrl}/api/visitantes`,
        {
          ...formData,
        },
        { headers }
      );

      if (response.status === 201) {
        Alert.alert("Éxito", response.data.message || "Visitante registrado correctamente.");
        onSubmit(formData); // Para pasar los datos al componente superior si es necesario
      }
    } catch (error) {
      console.error("Error al registrar visitante:", error);

      // Mostrar mensaje del backend si está disponible, o un mensaje genérico
      const errorMessage = error.response?.data?.error || "No se pudo registrar al visitante.";

      Alert.alert(
        "Error",
        errorMessage,
        [
          {
            text: "Reintentar",
            onPress: handleSubmit, // Reintentar el registro
          },
          {
            text: "Cancelar",
            style: "cancel",
          },
        ],
        { cancelable: false }
      );
    }
  };

  return (
    <View style={styles.formContainer}>
      <Text style={styles.title}>Datos del Visitante</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombres"
        value={formData.nombres}
        onChangeText={(text) => handleChange("nombres", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Apellidos"
        value={formData.apellidos}
        onChangeText={(text) => handleChange("apellidos", text)}
      />

      {/* Picker para Tipo de Documento */}
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={formData.tipo_documento}
          onValueChange={(itemValue) => handleChange("tipo_documento", itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Cédula de Ciudadanía" value="C.C" />
          <Picker.Item label="Tarjeta de Identidad" value="T.I" />
          <Picker.Item label="Cédula de Extranjería" value="C.E" />
        </Picker>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Número de Documento"
        value={formData.numero_documento}
        onChangeText={(text) => handleChange("numero_documento", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Motivo"
        value={formData.motivo}
        onChangeText={(text) => handleChange("motivo", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Área de Destino"
        value={formData.area_destino}
        onChangeText={(text) => handleChange("area_destino", text)}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Registrar Visitante</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    width: "100%",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#00AF00",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 50,
    borderColor: "#00AF00",
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    width: "100%", // Ocupa todo el ancho del card
  },
  pickerContainer: {
    height: 55,
    borderColor: "#00AF00",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    justifyContent: "center",
    backgroundColor: "transparent", // Para mantener el color transparente en Android
    overflow: "hidden", // Evita desbordes en iOS
    width: "100%", // Ocupa todo el ancho del card
  },
  picker: {
    width: "100%",
    height: "100%",
  },
  button: {
    backgroundColor: "#00AF00",
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 10,
    marginTop: 20,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});