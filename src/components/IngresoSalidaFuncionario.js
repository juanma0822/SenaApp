import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

export default function IngresoSalidaFuncionario({ navigation, tipoIngreso }) {
  const [searchQuery, setSearchQuery] = useState(""); // Control del buscador
  const [funcionarios, setFuncionarios] = useState([]); // Listado de funcionarios
  const [selectedFuncionario, setSelectedFuncionario] = useState(null); // Funcionario seleccionado
  const [loading, setLoading] = useState(false); // Estado de carga
  const [error, setError] = useState(null); // Manejo de errores

  // Función para cargar los usuarios
  const cargarUsuarios = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      const baseUrl = Constants.expoConfig.extra.REACT_APP_BACKEND_URL;
      const response = await axios.get(`${baseUrl}/api/usuarios/`, { headers });
      setFuncionarios(response.data);
    } catch (error) {
      setError("Error al cargar los funcionarios");
      console.error("Error al cargar usuarios:", error);
    }
  };

  useEffect(() => {
    cargarUsuarios(); // Cargar los usuarios cuando se monte el componente
  }, []);

  // Función para manejar la búsqueda de funcionarios
  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  // Filtrar funcionarios basados en la búsqueda
  const filteredFuncionarios = funcionarios.filter((funcionario) =>
    funcionario.nombres.toLowerCase().includes(searchQuery.toLowerCase()) ||
    funcionario.numero_documento.includes(searchQuery)
  );

  // Función para manejar la acción de marcar entrada o salida
  const handleIngresoSalida = async () => {
    if (!selectedFuncionario) {
      Alert.alert("Error", "Por favor selecciona un funcionario.");
      return;
    }

    setLoading(true);

    try {
      const token = await AsyncStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
      const baseUrl = Constants.expoConfig.extra.REACT_APP_BACKEND_URL;
      console.log(`${baseUrl}/api/ingresos/por-guarda`); // Verificar la URL base

      // Construir el payload
      const payload = {
        numero_documento: String(selectedFuncionario.numero_documento), // Convertir a string
        tipo_ingreso: String(tipoIngreso), // Convertir a string
      };

      console.log("Payload enviado al backend:", payload); // Verificar el payload antes de enviarlo

      // Enviar datos al backend
      const response = await axios.post(`${baseUrl}/api/ingresos/porguarda`, payload, { headers });

      if (response.status === 201) {
        setLoading(false);
        Alert.alert("Éxito", `Funcionario marcado como ${tipoIngreso}.`);
        setSelectedFuncionario(null); // Limpiar selección
        setSearchQuery(""); // Limpiar búsqueda
      }
    } catch (error) {
      setLoading(false);
      console.error("Error al registrar ingreso/salida:", error);

      // Mostrar mensaje del backend si está disponible, o un mensaje genérico
      const errorMessage = error.response?.data?.error || "Error al registrar el ingreso o salida.";

      Alert.alert(
        "Error",
        errorMessage,
        [
          {
            text: "Reintentar",
            onPress: handleIngresoSalida, // Reintentar la acción
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
    <View style={styles.container}>
      <Text style={styles.title}>{`Registro de ${tipoIngreso === "entrada" ? "Ingreso" : "Salida"} Funcionario`}</Text>

      <TextInput
        style={styles.input}
        placeholder="Buscar funcionario por nombre o documento"
        value={searchQuery}
        onChangeText={handleSearch}
      />

      {error && <Text style={styles.errorText}>{error}</Text>}

      <ScrollView style={styles.scrollContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#00AF00" />
        ) : (
          filteredFuncionarios.map((funcionario) => (
            <TouchableOpacity
              key={funcionario.numero_documento}
              style={[
                styles.item,
                selectedFuncionario?.numero_documento === funcionario.numero_documento && styles.selectedItem,
              ]}
              onPress={() => setSelectedFuncionario(funcionario)}
            >
              <Text style={styles.itemText}>
                {funcionario.nombres} {funcionario.apellidos} - {funcionario.numero_documento}
              </Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      <TouchableOpacity
        style={styles.button}
        onPress={handleIngresoSalida}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {tipoIngreso === "entrada" ? "Marcar Entrada" : "Marcar Salida"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#00AF00",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#00AF00",
    borderRadius: 8,
    marginBottom: 20,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    width: "100%",
  },
  item: {
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  selectedItem: {
    borderColor: "#00AF00",
    borderWidth: 2,
  },
  itemText: {
    fontSize: 16,
    color: "#333",
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
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginBottom: 10,
  },
});