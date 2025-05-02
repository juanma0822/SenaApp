import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Dimensions,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Timeline from "../../components/Timeline";
import Constants from "expo-constants";

const { height } = Dimensions.get("window"); // Obtener el alto de la pantalla
const TAB_BAR_HEIGHT = 90; // Altura de la barra de navegación

export default function Historial({ navigation }) {
  const [historicalData, setHistoricalData] = useState([]);
  const [dailySummary, setDailySummary] = useState([]);
  const [isDailyHistory, setIsDailyHistory] = useState(true);
  const [showSummary, setShowSummary] = useState(false);

  useEffect(() => {
    fetchHistoricalData();
  }, [isDailyHistory]);

  const fetchHistoricalData = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const baseUrl = Constants.expoConfig.extra.REACT_APP_BACKEND_URL;
      const url = isDailyHistory
        ? `${baseUrl}/api/ingresos/ingresos-dia`
        : `${baseUrl}/api/ingresos/historial-usuario`;

      const response = await axios.get(url, { headers });
      setHistoricalData(response.data || []); // Asegurarse de que siempre sea un array
    } catch (error) {
      console.error("Error fetching historical data:", error);
    }
  };

  const fetchDailySummary = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const baseUrl = Constants.expoConfig.extra.REACT_APP_BACKEND_URL;
      const response = await axios.get(`${baseUrl}/api/ingresos/resumen-dia`, { headers });
      setDailySummary(response.data || []); // Guardar el resumen diario
    } catch (error) {
      console.error("Error fetching daily summary:", error);
    }
  };

  const toggleSummary = () => {
    if (!showSummary) {
      fetchDailySummary(); // Cargar el resumen diario si no se ha mostrado antes
    }
    setShowSummary(!showSummary); // Alternar la visibilidad del resumen
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Fondo verde */}
      <View style={styles.background}>
        {/* Card principal con ScrollView */}
        <ScrollView style={styles.scrollContainer}>
          <View style={styles.card}>
            <Text style={styles.title}>Historial</Text>
            <Text style={styles.description}>
              Aquí podrás visualizar el historial de registros en la plataforma, tanto el histórico como el diario.
            </Text>
            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => setIsDailyHistory(true)}
              >
                <Text style={styles.buttonText}>Historial Diario</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={() => setIsDailyHistory(false)}
              >
                <Text style={styles.buttonText}>Historial Completo</Text>
              </TouchableOpacity>
            </View>

            {/* Contenido desplazable */}
            {historicalData.length > 0 ? (
              <Timeline data={historicalData} />
            ) : (
              <Text style={styles.noDataText}>No hay datos disponibles</Text>
            )}

            {/* Botón para mostrar/ocultar resumen diario */}
            <TouchableOpacity style={styles.summaryButton} onPress={toggleSummary}>
              <Text style={styles.summaryButtonText}>
                {showSummary ? "Ocultar Resumen Diario" : "Mostrar Resumen Diario"}
              </Text>
            </TouchableOpacity>

            {/* Resumen diario */}
            {showSummary && (
              <View style={styles.summaryContainer}>
                {dailySummary.length > 0 ? (
                  dailySummary.map((summary, index) => (
                    <View key={index} style={styles.summaryCard}>
                      <Text style={styles.summaryText}>
                        <Text style={styles.summaryLabel}>Fecha: </Text>
                        {summary.fecha}
                      </Text>
                      <Text style={styles.summaryText}>
                        <Text style={styles.summaryLabel}>Primer Ingreso: </Text>
                        {new Date(summary.primer_ingreso).toLocaleTimeString("es-CO", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </Text>
                      <Text style={styles.summaryText}>
                        <Text style={styles.summaryLabel}>Última Salida: </Text>
                        {new Date(summary.ultima_salida).toLocaleTimeString("es-CO", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </Text>
                      <Text style={styles.summaryText}>
                        <Text style={styles.summaryLabel}>Total Entradas: </Text>
                        {summary.total_entradas}
                      </Text>
                      <Text style={styles.summaryText}>
                        <Text style={styles.summaryLabel}>Total Salidas: </Text>
                        {summary.total_salidas}
                      </Text>
                    </View>
                  ))
                ) : (
                  <Text style={styles.noDataText}>No hay resumen diario disponible</Text>
                )}
              </View>
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
    backgroundColor: "#00AF00", // Fondo verde institucional
  },
  background: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start", // Centrar el card en el espacio disponible
    padding: 20,
    paddingTop: 50,
    paddingBottom: TAB_BAR_HEIGHT, // Ajustar el espacio para la barra de navegación
  },
  scrollContainer: {
    flex: 1, // Hacer que todo el contenido sea desplazable
    width: "100%",
  },
  card: {
    width: "100%",
    maxWidth: 500,
    backgroundColor: "#FFFFFF", // Fondo blanco para el card
    borderRadius: 20, // Bordes redondeados
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5, // Sombra para Android
    borderWidth: 4, // Grosor del borde
    borderColor: "#008000", // Color del borde
    
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#00AF00", // Verde institucional
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 20,
  },
  buttonsContainer: {
    flexDirection: "row",
    flexWrap: "wrap", // Permitir que los botones se ajusten si no hay espacio
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#00AF00",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 10, // Espaciado entre botones
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  noDataText: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginTop: 20,
  },
  summaryButton: {
    backgroundColor: "#008000",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 20,
  },
  summaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  summaryContainer: {
    paddingHorizontal: 10,
    marginTop: 20,
  },
  summaryCard: {
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  summaryText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 5,
  },
  summaryLabel: {
    fontWeight: "bold",
    color: "#555",
  },
});