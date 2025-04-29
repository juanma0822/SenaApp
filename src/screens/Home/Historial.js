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
  const [isDailyHistory, setIsDailyHistory] = useState(true);

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

  return (
    <SafeAreaView style={styles.container}>
      {/* Fondo verde */}
      <View style={styles.background}>
        {/* Card principal */}
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
          <ScrollView style={styles.scrollContainer}>
            {historicalData.length > 0 ? (
              <Timeline data={historicalData} />
            ) : (
              <Text style={styles.noDataText}>No hay datos disponibles</Text>
            )}
          </ScrollView>
        </View>
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
    justifyContent: "center", // Centrar el card en el espacio disponible
    padding: 20,
    paddingBottom: TAB_BAR_HEIGHT, // Ajustar el espacio para la barra de navegación
  },
  card: {
    width: "100%",
    maxWidth: 500,
    height: height - TAB_BAR_HEIGHT - 85, // Altura dinámica restando la barra de navegación y un margen adicional
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
  scrollContainer: {
    flex: 1, // Hacer que el contenido sea desplazable
    width: "100%",
    marginTop: 10,
  },
  noDataText: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginTop: 20,
  },
});