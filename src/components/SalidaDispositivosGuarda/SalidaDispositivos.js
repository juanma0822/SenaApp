import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { Picker } from "@react-native-picker/picker"; // Importar Picker desde el paquete correcto
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import WaveBackground from "../WaveBackground";

export default function SalidaDispositivo({ navigation }) {
  const [usuarios, setUsuarios] = useState([]);
  const [tipoElemento, setTipoElemento] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [numeroDocumento, setNumeroDocumento] = useState("");
  const [numero_serie, setNumeroSerie] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      const baseUrl = Constants.expoConfig.extra.REACT_APP_BACKEND_URL;
      const response = await axios.get(`${baseUrl}/api/usuarios/`, { headers });
      setUsuarios(response.data);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
    }
  };

  const handleRegistrarSalida = async () => {
    if (!tipoElemento || !descripcion || !numeroDocumento || !numero_serie) {
      Alert.alert("Campos incompletos", "Por favor completa todos los campos.");
      return;
    }

    setLoading(true);

    try {
      const token = await AsyncStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const baseUrl = Constants.expoConfig.extra.REACT_APP_BACKEND_URL;
      const payload = {
        tipo_elemento: tipoElemento,
        descripcion: descripcion,
        numero_documento: numeroDocumento,
        numero_serie: numero_serie,
      };

      const response = await axios.post(
        `${baseUrl}/api/dispositivos/salida`,
        payload,
        { headers }
      );

      console.log("Respuesta del backend: ", response.data);
      setLoading(false);
      Alert.alert(
        "✅ Salida registrada exitosamente",
        "La salida del dispositivo ha sido registrada correctamente.",
        [{ text: "OK", onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      console.error("Error al registrar salida:", error);
      Alert.alert(
        "Error",
        "Error al registrar la salida: " + error.message,
        [{ text: "OK" }]
      );
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.card}>
            <Text style={styles.title}>Registrar Salida de Dispositivo</Text>

            {/* Campo para seleccionar el usuario */}
            <Text style={styles.inputLabel}>Seleccionar Usuario</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={numeroDocumento}
                onValueChange={(itemValue) => setNumeroDocumento(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Seleccione un usuario" value="" />
                {usuarios.map((usuario) => (
                  <Picker.Item
                    key={usuario.numero_documento}
                    label={`${usuario.nombres} ${usuario.apellidos}`}
                    value={usuario.numero_documento}
                  />
                ))}
              </Picker>
            </View>

            {/* Campo para el tipo de elemento */}
            <Text style={styles.inputLabel}>Tipo de Elemento</Text>
            <TextInput
              style={styles.input}
              placeholder="Escribe el tipo de elemento"
              value={tipoElemento}
              onChangeText={setTipoElemento}
            />

            {/* Campo para el numero de serie del dispositivo */}
            <Text style={styles.inputLabel}>Numero de serie</Text>
            <TextInput
              style={styles.input}
              placeholder="Escribe el numero de serie del dispositivo"
              value={numero_serie}
              onChangeText={setNumeroSerie}
            />

            {/* Campo para la descripción */}
            <Text style={styles.inputLabel}>Descripción</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Escribe una descripción del dispositivo"
              value={descripcion}
              onChangeText={setDescripcion}
              multiline
              numberOfLines={4}
            />

            {/* Botón para registrar la salida */}
            {loading ? (
              <ActivityIndicator size="large" color="#00AF00" />
            ) : (
              <TouchableOpacity
                style={styles.button}
                onPress={handleRegistrarSalida}
              >
                <Text style={styles.buttonText}>Registrar Salida</Text>
              </TouchableOpacity>
            )}
          </View>
          <WaveBackground />
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 3,
    borderColor: "#008000",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#00AF00",
    marginBottom: 20,
    textAlign: "center",
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333333",
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
    height: 100,
    textAlignVertical: "top",
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
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#00AF00",
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: "#FFFFFF",
  },
  picker: {
    height: 50,
    width: "100%",
  },
});