import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import Timeline from "../../components/Timeline";
import { Picker } from "@react-native-picker/picker";

const { height } = Dimensions.get("window");
const TAB_BAR_HEIGHT = 90;

export default function IngresosUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [historialUsuario, setHistorialUsuario] = useState([]);
  const [tipoFiltro, setTipoFiltro] = useState(""); // "entrada", "salida"
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  const limpiarFiltros = () => {
    setFiltroFecha("");
    setRangoHora({ inicio: "", fin: "" });
    setTipoFiltro("");
  };

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

  const buscarUsuarios = () => {
    return usuarios.filter((u) =>
      `${u.nombres} ${u.apellidos}`
        .toLowerCase()
        .includes(busqueda.toLowerCase())
    );
  };

  const seleccionarUsuario = async (usuario) => {
    setUsuarioSeleccionado(usuario);
    try {
      const token = await AsyncStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      const baseUrl = Constants.expoConfig.extra.REACT_APP_BACKEND_URL;
      const response = await axios.get(
        `${baseUrl}/api/ingresos/historial-usuario/${usuario.numero_documento}`,
        {
          headers,
        }
      );
      setHistorialUsuario(response.data || []);
    } catch (error) {
      console.error("Error al cargar historial del usuario:", error);
    }
  };

  const [filtroFecha, setFiltroFecha] = useState("");
  const [rangoHora, setRangoHora] = useState({ inicio: "", fin: "" });

  const aplicarFiltros = (data) => {
    return data.filter((item) => {
      const fechaHora = new Date(item.fecha_hora);

      // Filtro por tipo
      if (tipoFiltro && item.tipo_ingreso !== tipoFiltro) return false;

      // Filtro por fecha exacta
      if (filtroFecha) {
        const fechaString = fechaHora.toISOString().split("T")[0];
        if (fechaString !== filtroFecha) return false;
      }

      // Filtro por rango de hora
      if (rangoHora.inicio && rangoHora.fin) {
        const horaActual = fechaHora.getHours() + fechaHora.getMinutes() / 60;
        const [hIni, mIni] = rangoHora.inicio.split(":").map(Number);
        const [hFin, mFin] = rangoHora.fin.split(":").map(Number);
        const horaInicio = hIni + mIni / 60;
        const horaFin = hFin + mFin / 60;

        if (horaActual < horaInicio || horaActual > horaFin) return false;
      }

      return true;
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.background}>
        <ScrollView style={styles.scrollContainer}>
          <View style={styles.card}>
            <Text style={styles.title}>Ingresos por Usuario</Text>
            <TextInput
              placeholder="Buscar por nombre..."
              style={styles.input}
              value={busqueda}
              onChangeText={setBusqueda}
            />
            <TouchableOpacity
              style={styles.filtroToggle}
              onPress={() => setMostrarFiltros(!mostrarFiltros)}
            >
              <Text style={styles.filtroToggleText}>Aplicar filtros</Text>
              <Text style={styles.flecha}>{mostrarFiltros ? "▲" : "▼"}</Text>
            </TouchableOpacity>

            {mostrarFiltros && (
              <View style={styles.filtrosContainer}>
                {/* Fecha */}
                <Text style={styles.filtroLabel}>Filtrar por fecha:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="AAAA-MM-DD"
                  value={filtroFecha}
                  onChangeText={(text) => setFiltroFecha(text)}
                />

                {/* Hora */}
                <Text style={styles.filtroLabel}>Filtrar por hora:</Text>
                <View style={{ flexDirection: "row", gap: 10 }}>
                  <TextInput
                    style={[styles.input, { flex: 1 }]}
                    placeholder="Inicio (HH:MM)"
                    value={rangoHora.inicio}
                    onChangeText={(text) =>
                      setRangoHora((prev) => ({ ...prev, inicio: text }))
                    }
                  />
                  <TextInput
                    style={[styles.input, { flex: 1 }]}
                    placeholder="Fin (HH:MM)"
                    value={rangoHora.fin}
                    onChangeText={(text) =>
                      setRangoHora((prev) => ({ ...prev, fin: text }))
                    }
                  />
                </View>

                {/* Tipo */}
                <Text style={styles.filtroLabel}>Filtrar por tipo:</Text>
                <Picker
                  selectedValue={tipoFiltro}
                  style={styles.input}
                  onValueChange={(itemValue) => setTipoFiltro(itemValue)}
                >
                  <Picker.Item label="Todos" value="" />
                  <Picker.Item label="Entrada" value="entrada" />
                  <Picker.Item label="Salida" value="salida" />
                </Picker>

                {/* Botón de limpiar */}
                <TouchableOpacity
                  style={styles.limpiarButton}
                  onPress={limpiarFiltros}
                >
                  <Text style={styles.limpiarButtonText}>Limpiar Filtros</Text>
                </TouchableOpacity>
              </View>
            )}

            {buscarUsuarios().map((usuario) => (
              <TouchableOpacity
                key={usuario.numero_documento}
                style={styles.usuarioItem}
                onPress={() => seleccionarUsuario(usuario)}
              >
                <Text style={styles.usuarioTexto}>
                  {usuario.nombres} {usuario.apellidos}
                </Text>
              </TouchableOpacity>
            ))}

            {usuarioSeleccionado && (
              <>
                <Text style={styles.subtitulo}>
                  Historial de {usuarioSeleccionado.nombres}
                </Text>
                {historialUsuario.length > 0 ? (
                  <Timeline data={aplicarFiltros(historialUsuario)} />
                ) : (
                  <Text style={styles.noDataText}>
                    Este usuario no tiene historial.
                  </Text>
                )}
              </>
            )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#00AF00",
  },
  background: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 20,
    paddingTop: 50,
    paddingBottom: TAB_BAR_HEIGHT,
  },
  scrollContainer: {
    flex: 1,
    width: "100%",
  },
  card: {
    width: "100%",
    maxWidth: 500,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    borderWidth: 4,
    borderColor: "#008000",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#00AF00",
    marginBottom: 15,
  },
  filtroToggle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#E8F5E9",
    borderRadius: 8,
    marginBottom: 10,
  },
  filtroToggleText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2E7D32",
  },
  flecha: {
    fontSize: 18,
    color: "#2E7D32",
  },
  filtrosContainer: {
    width: "100%",
    backgroundColor: "#F0F0F0",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  filtroLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 5,
    color: "#333",
  },
  input: {
    height: 48,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    marginBottom: 10,
    width: "100%",
  },
  limpiarButton: {
    marginTop: 10,
    backgroundColor: "#FF5C5C",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  limpiarButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },  
  usuarioItem: {
    width: "100%",
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    marginBottom: 8,
  },
  usuarioTexto: {
    fontSize: 16,
    color: "#333",
  },
  subtitulo: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    color: "#008000",
    textAlign: "center",
  },
  noDataText: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginTop: 15,
  },
  filtroLabel: {
    alignSelf: "flex-start",
    fontWeight: "bold",
    color: "#333",
    marginTop: 10,
    marginBottom: 4,
  },
});
