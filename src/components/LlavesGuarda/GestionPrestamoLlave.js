import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Constants from "expo-constants";
import WaveBackground from "../WaveBackground";
import { FontAwesome5 } from "@expo/vector-icons";

export default function GestionPrestamoLlaves() {
  const [llavesDisponibles, setLlavesDisponibles] = useState([]);
  const [llavesPrestadas, setLlavesPrestadas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [seleccionLlave, setSeleccionLlave] = useState(null);
  const [seleccionFuncionario, setSeleccionFuncionario] = useState(null);
  const [devolucionLlave, setDevolucionLlave] = useState(null);
  const [loading, setLoading] = useState(false);

  // Estados para los buscadores
  const [busquedaLlave, setBusquedaLlave] = useState("");
  const [busquedaFuncionario, setBusquedaFuncionario] = useState("");

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

  // Filtrar llaves y funcionarios según búsqueda
  const llavesFiltradas = llavesDisponibles
    .filter((llave) =>
      llave.nombre_llave.toLowerCase().includes(busquedaLlave.toLowerCase())
    )
    .slice(0, 5);

  const funcionariosFiltrados = usuarios
    .filter((usuario) => {
      const nombreCompleto =
        `${usuario.nombres} ${usuario.apellidos}`.toLowerCase();
      return (
        nombreCompleto.includes(busquedaFuncionario.toLowerCase()) ||
        usuario.numero_documento.includes(busquedaFuncionario)
      );
    })
    .slice(0, 5);

  const realizarPrestamo = async () => {
    if (!seleccionLlave || !seleccionFuncionario) {
      Alert.alert(
        "Campos requeridos",
        "Selecciona una llave y un funcionario."
      );
      return;
    }

    setLoading(true);
    const token = await AsyncStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

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
      setBusquedaLlave("");
      setBusquedaFuncionario("");
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
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    try {
      await axios.put(
        `${baseUrl}/api/llaves/prestamos-llaves/devolver/${devolucionLlave.id_prestamo}`,
        {},
        { headers }
      );
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
    <>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>
            <FontAwesome5 name="key" size={22} color="#00AF00" /> Gestión de
            Préstamo de Llaves
          </Text>

          <Text style={styles.subtitle}>
            1. Selecciona
            una llave disponible:
          </Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar llave..."
            placeholderTextColor="#00AF00"
            value={busquedaLlave}
            onChangeText={setBusquedaLlave}
          />
          {llavesFiltradas.length === 0 && (
            <Text style={styles.noResultsText}>No se encontraron llaves.</Text>
          )}
          {llavesFiltradas.map((llave) => (
            <TouchableOpacity
              key={llave.id_llave}
              style={[
                styles.item,
                seleccionLlave?.id_llave === llave.id_llave &&
                  styles.selectedItem,
              ]}
              onPress={() => setSeleccionLlave(llave)}
            >
              <FontAwesome5
                name="key"
                size={16}
                color="#008000"
                style={styles.itemIcon}
              />
              <Text style={styles.itemText}>{llave.nombre_llave}</Text>
            </TouchableOpacity>
          ))}

          <Text style={styles.subtitle}>
            2. Selecciona
            un funcionario:
          </Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar funcionario..."
            placeholderTextColor="#00AF00"
            value={busquedaFuncionario}
            onChangeText={setBusquedaFuncionario}
          />
          {funcionariosFiltrados.length === 0 && (
            <Text style={styles.noResultsText}>
              No se encontraron funcionarios.
            </Text>
          )}
          {funcionariosFiltrados.map((usuario) => (
            <TouchableOpacity
              key={usuario.numero_documento}
              style={[
                styles.item,
                seleccionFuncionario?.numero_documento ===
                  usuario.numero_documento && styles.selectedItem,
              ]}
              onPress={() => setSeleccionFuncionario(usuario)}
            >
              <FontAwesome5
                name="user"
                size={16}
                color="#008000"
                style={styles.itemIcon}
              />
              <Text style={styles.itemText}>
                {usuario.nombres} {usuario.apellidos}
              </Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={realizarPrestamo}
            disabled={loading}
          >
            <FontAwesome5
              name="plus-circle"
              size={18}
              color="#fff"
              style={styles.buttonIcon}
            />
            <Text style={styles.buttonText}>
              {loading ? "Procesando..." : "Registrar Préstamo"}
            </Text>
          </TouchableOpacity>

          <Text style={[styles.subtitle, { marginTop: 30 }]}>
             3. Devolución
            de Llaves:
          </Text>
          {llavesPrestadas.map((prestamo) => (
            <TouchableOpacity
              key={prestamo.id_prestamo}
              style={[
                styles.item,
                devolucionLlave?.id_prestamo === prestamo.id_prestamo &&
                  styles.selectedItem,
              ]}
              onPress={() => setDevolucionLlave(prestamo)}
            >
              <FontAwesome5
                name="undo"
                size={16}
                color="#008000"
                style={styles.itemIcon}
              />
              <Text style={styles.itemText}>{prestamo.nombre_llave}</Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={devolverLlave}
            disabled={loading}
          >
            <FontAwesome5
              name="check-circle"
              size={18}
              color="#fff"
              style={styles.buttonIcon}
            />
            <Text style={styles.buttonText}>
              {loading ? "Procesando..." : "Devolver Llave"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <WaveBackground />
    </>
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
    borderRadius: 16,
    padding: 20,
    elevation: 5,
    borderWidth: 3,
    borderColor: "#008000",
    shadowColor: "#00AF00",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
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
  searchInput: {
    borderWidth: 1.5,
    borderColor: "#00AF00",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 10,
    color: "#008000",
    backgroundColor: "#F8FFF8",
    fontSize: 15,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 8,
  },
  itemIcon: {
    marginRight: 10,
  },
  selectedItem: {
    borderColor: "#00AF00",
    borderWidth: 2,
    backgroundColor: "#E6F9E6",
  },
  itemText: {
    color: "#008000",
    fontWeight: "bold",
    fontSize: 15,
  },
  noResultsText: {
    color: "#888",
    fontStyle: "italic",
    marginBottom: 8,
    textAlign: "center",
  },
  button: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00AF00",
    padding: 15,
    borderRadius: 10,
    marginTop: 15,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});
