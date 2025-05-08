import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import axios from "axios";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Importar AsyncStorage
import WaveBackground from "../WaveBackground"; // Importar WaveBackground

export default function CrearLlave({ navigation }) {
  const [nombreLlave, setNombreLlave] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCrearLlave = async () => {
    if (!nombreLlave.trim() || !descripcion.trim()) {
      Alert.alert("Campos incompletos", "Por favor completa todos los campos.");
      return;
    }

    setLoading(true);

    try {
      const token = await AsyncStorage.getItem("token"); // Obtener el token
      const headers = {
        Authorization: `Bearer ${token}`, // Agregar el token a los encabezados
        "Content-Type": "application/json",
      };

      const backendUrl = Constants.expoConfig.extra.REACT_APP_BACKEND_URL;

      const payload = {
        nombre_llave: nombreLlave,
        descripcion: descripcion,
      };

      const response = await axios.post(`${backendUrl}/api/llaves/`, payload, { headers });
      console.log("Respuesta del backend: ", response.data);
      setLoading(false);
      Alert.alert(
        "✅ Llave creada exitosamente",
        "La llave ha sido registrada correctamente.",
        [{ text: "OK", onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      Alert.alert(
        "Error",
        "Error al crear la llave: " + error.message,
        [{ text: "OK" }]
      );
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Crear Llave</Text>

          {/* Título y campo para el nombre de la llave */}
          <Text style={styles.inputLabel}>Nombre de la Llave</Text>
          <TextInput
            style={styles.input}
            placeholder="Escribe el nombre de la llave"
            value={nombreLlave}
            onChangeText={setNombreLlave}
          />

          {/* Título y campo para la descripción */}
          <Text style={styles.inputLabel}>Descripción</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Escribe una descripción para la llave"
            value={descripcion}
            onChangeText={setDescripcion}
            multiline
            numberOfLines={4}
          />

          {/* Botón para registrar la llave */}
          {loading ? (
            <ActivityIndicator size="large" color="#00AF00" />
          ) : (
            <TouchableOpacity style={styles.button} onPress={handleCrearLlave}>
              <Text style={styles.buttonText}>Registrar Llave</Text>
            </TouchableOpacity>
          )}
        </View>
        <WaveBackground />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5", // Fondo claro
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    width: "100%",
    position: "relative",
  },
  card: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#FFFFFF", // Fondo blanco para el card
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5, // Sombra para Android
    borderWidth: 3, // Grosor del borde
    borderColor: "#008000", // Color del borde verde institucional
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#00AF00", // Verde institucional
    marginBottom: 20,
    textAlign: "center",
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333333", // Color gris oscuro
    marginBottom: 5,
    marginTop: 10,
  },
  input: {
    height: 50,
    borderColor: "#00AF00",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: "#FFFFFF",
  },
  textArea: {
    height: 100, // Altura para el campo de texto de descripción
    textAlignVertical: "top", // Alinear el texto al inicio
  },
  button: {
    backgroundColor: "#00AF00",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});