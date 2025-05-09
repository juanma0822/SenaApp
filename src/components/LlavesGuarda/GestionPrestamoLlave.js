// src/components/GestionPrestamoLlaves.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Constants from "expo-constants";
import WaveBackground from "../WaveBackground";

export default function GestionPrestamoLlaves() {
  const [llavesDisponibles, setLlavesDisponibles] = useState([]);
  const [llavesPrestadas, setLlavesPrestadas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [seleccionLlave, setSeleccionLlave] = useState(null);
  const [seleccionFuncionario, setSeleccionFuncionario] = useState(null);
  const [devolucionLlave, setDevolucionLlave] = useState(null);
  const [loading, setLoading] = useState(false);

  const baseUrl = Constants.expoConfig.extra.REACT_APP_BACKEND_URL;

  const cargarDatos = async () => {
    const token = await AsyncStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const [resLlaves, resUsuarios, resPrestadas] = await Promise.all([
        axios.get(`${baseUrl}/api/llaves/disponibles`, { headers }),
        axios.get(`${baseUrl}/api/usuarios?rol=funcionario`, { headers }),
        axios.get(`${baseUrl}/api/llaves/prestamos-llaves/en-uso`, { headers }),
      ]);

      setLlavesDisponibles(resLlaves.data);
      setUsuarios(resUsuarios.data);
      setLlavesPrestadas(resPrestadas.data);
    } catch (error) {
      console.error("Error al cargar datos", error);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const realizarPrestamo = async () => {
    if (!seleccionLlave || !seleccionFuncionario) {
      Alert.alert("Campos requeridos", "Selecciona una llave y un funcionario.");
      return;
    }

    setLoading(true);
    const token = await AsyncStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

    try {
      await axios.post(
        `${baseUrl}/api/llaves/prestamos-llaves`,
        {
          id_llave: seleccionLlave.id_llave,
          numero_documento: seleccionFuncionario.numero_documento,
        },
        { headers }
      );
      Alert.alert("Éxito", "Préstamo registrado correctamente.");
      setSeleccionLlave(null);
      setSeleccionFuncionario(null);
      cargarDatos();
    } catch (error) {
      Alert.alert("Error", "No se pudo registrar el préstamo.");
    } finally {
      setLoading(false);
    }
  };

  const devolverLlave = async () => {
    if (!devolucionLlave) {
      Alert.alert("Selecciona una llave para devolver.");
      return;
    }

    setLoading(true);
    const token = await AsyncStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

    try {
      await axios.put(`${baseUrl}/api/llaves/prestamos-llaves/devolver/${devolucionLlave.id_prestamo}`, {}, { headers });
      Alert.alert("Éxito", "Llave devuelta correctamente.");
      setDevolucionLlave(null);
      cargarDatos();
    } catch (error) {
      Alert.alert("Error", "No se pudo devolver la llave.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Gestión de Préstamo de Llaves</Text>

        <Text style={styles.subtitle}>1. Selecciona una llave disponible:</Text>
        {llavesDisponibles.map((llave) => (
          <TouchableOpacity
            key={llave.id_llave}
            style={[
              styles.item,
              seleccionLlave?.id_llave === llave.id_llave && styles.selectedItem,
            ]}
            onPress={() => setSeleccionLlave(llave)}
          >
            <Text>{llave.nombre_llave}</Text>
          </TouchableOpacity>
        ))}

        <Text style={styles.subtitle}>2. Selecciona un funcionario:</Text>
        {usuarios.map((usuario) => (
          <TouchableOpacity
            key={usuario.numero_documento}
            style={[
              styles.item,
              seleccionFuncionario?.numero_documento === usuario.numero_documento && styles.selectedItem,
            ]}
            onPress={() => setSeleccionFuncionario(usuario)}
          >
            <Text>{usuario.nombres} {usuario.apellidos}</Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.button} onPress={realizarPrestamo} disabled={loading}>
          <Text style={styles.buttonText}>Registrar Préstamo</Text>
        </TouchableOpacity>

        <Text style={[styles.subtitle, { marginTop: 30 }]}>3. Devolución de Llaves:</Text>
        {llavesPrestadas.map((prestamo) => (
          <TouchableOpacity
            key={prestamo.id_prestamo}
            style={[
              styles.item,
              devolucionLlave?.id_prestamo === prestamo.id_prestamo && styles.selectedItem,
            ]}
            onPress={() => setDevolucionLlave(prestamo)}
          >
            <Text>{prestamo.nombre_llave} - {prestamo.nombres}</Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.button} onPress={devolverLlave} disabled={loading}>
          <Text style={styles.buttonText}>Devolver Llave</Text>
        </TouchableOpacity>
      </View>
      <WaveBackground />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    paddingBottom: 80,
  },
  card: {
    width: "100%",
    maxWidth: 450,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 20,
    elevation: 5,
    borderWidth: 3,
    borderColor: "#008000",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#00AF00",
    marginBottom: 20,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginVertical: 10,
  },
  item: {
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 8,
  },
  selectedItem: {
    borderColor: "#00AF00",
    borderWidth: 2,
  },
  button: {
    backgroundColor: "#00AF00",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 15,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
});
