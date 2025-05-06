import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  SafeAreaView,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { BarChart, PieChart } from "react-native-chart-kit";

const { width, height } = Dimensions.get("window");
const TAB_BAR_HEIGHT = 90;

export default function EstadisticasScreen({ navigation }) {
  const [estadisticasData, setEstadisticasData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEstadisticas();
  }, []);

  // Función para obtener las estadísticas desde el backend
  const fetchEstadisticas = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };
      const baseUrl = Constants.expoConfig.extra.REACT_APP_BACKEND_URL;

      const response = await axios.get(`${baseUrl}/api/estadisticas/dia`, {
        headers,
      });
      setEstadisticasData(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error al obtener las estadísticas:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00AF00" />
        <Text style={styles.loadingText}>Cargando estadísticas...</Text>
      </View>
    );
  }

  // Datos para los gráficos
  const barChartData = {
    labels: ["Entrada", "Salida"],
    datasets: [
      {
        data: [
          estadisticasData?.usuariosIngresadosHoy,
          estadisticasData?.usuariosSalidosHoy,
        ],
      },
    ],
  };

  const pieChartData = [
    {
      name: "Entradas",
      population: estadisticasData?.usuariosIngresadosHoy,
      color: "#00AF00",
      legendFontColor: "#333",
      legendFontSize: 15,
    },
    {
      name: "Salidas",
      population: estadisticasData?.usuariosSalidosHoy,
      color: "#FF5C5C",
      legendFontColor: "#333",
      legendFontSize: 15,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.background}>
        <ScrollView style={styles.scrollContainer}>
          <View style={styles.card}>
            {/* Título principal */}
            <Text style={styles.dashboardTitle}>Dashboard</Text>

            {/* Contenedor general para las secciones */}
            <View style={styles.sectionsContainer}>
              {/* Sección: Estadísticas del Día */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionHeaderText}>
                    Estadísticas del Día
                  </Text>
                </View>
                <View style={styles.miniCard}>
                  <Text style={styles.statTitle}>Usuarios Ingresados Hoy:</Text>
                  <Text style={styles.statValue}>
                    {estadisticasData?.usuariosIngresadosHoy}
                  </Text>
                </View>
                <View style={styles.miniCard}>
                  <Text style={styles.statTitle}>Usuarios Salidos Hoy:</Text>
                  <Text style={styles.statValue}>
                    {estadisticasData?.usuariosSalidosHoy}
                  </Text>
                </View>
                <View style={styles.miniCard}>
                  <Text style={styles.statTitle}>
                    Promedio Entradas por Usuario:
                  </Text>
                  <Text style={styles.statValue}>
                    {estadisticasData?.promedioEntradas}
                  </Text>
                </View>
                <View style={styles.miniCard}>
                  <Text style={styles.statTitle}>
                    Promedio Salidas por Usuario:
                  </Text>
                  <Text style={styles.statValue}>
                    {estadisticasData?.promedioSalidas}
                  </Text>
                </View>
              </View>

              {/* Sección: Estadísticas de Entrada/Salida */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionHeaderText}>
                    Estadísticas de Entrada/Salida
                  </Text>
                </View>

                  <BarChart
                    style={styles.chart}
                    data={barChartData}
                    width={width * 0.78}
                    height={height * 0.3}
                    fromZero={true}
                    yAxisInterval={0.5}
                    chartConfig={{
                      backgroundColor: "#FFFFFF",
                      backgroundGradientFrom: "#E8F5E9",
                      backgroundGradientTo: "#C8E6C9",
                      decimalPlaces: 1,
                      color: (opacity = 1) => `rgba(0, 128, 0, ${opacity})`,
                      labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                      style: {
                        borderRadius: 16,
                      },
                    }}
                    verticalLabelRotation={30}
                  />
              </View>

              {/* Sección: Distribución de Entradas/Salidas */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionHeaderText}>
                    Distribución de Entradas/Salidas
                  </Text>
                </View>
                <View style={styles.chartCard}>
                  <PieChart
                    data={pieChartData}
                    width={width * 0.7}
                    height={height * 0.19}
                    chartConfig={{
                      backgroundColor: "#FFFFFF",
                      backgroundGradientFrom: "#E8F5E9",
                      backgroundGradientTo: "#C8E6C9",
                      decimalPlaces: 0,
                      color: (opacity = 1) => `rgba(0, 128, 0, ${opacity})`,
                      labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    }}
                    accessor="population"
                    backgroundColor="transparent"
                  />
                </View>
              </View>
            </View>

            {/* Botón para refrescar estadísticas */}
            <TouchableOpacity
              style={styles.refreshButton}
              onPress={fetchEstadisticas}
            >
              <Text style={styles.refreshText}>Refrescar Estadísticas</Text>
            </TouchableOpacity>
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
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    borderWidth: 4,
    borderColor: "#008000",
  },
  dashboardTitle: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#00AF00",
    textAlign: "center",
    marginBottom: 20,
  },
  sectionsContainer: {
    width: "100%",
  },
  section: {
    marginBottom: 40, // Separar cada sección
  },
  sectionHeader: {
    width: "100%",
    backgroundColor: "#E8F5E9",
    borderLeftWidth: 5,
    borderLeftColor: "#00AF00",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  sectionHeaderText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#00AF00",
  },
  miniCard: {
    width: "100%",
    backgroundColor: "#E8F5E9",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: "#00AF00",
  },
  statTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  statValue: {
    fontSize: 16,
    fontWeight: "400",
    color: "#00AF00",
    marginTop: 5,
  },
  chartCard: {
    width: "100%",
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    padding: 15,
    borderWidth: 1.5,
    borderColor: "#00AF00",
    alignItems: "center",
  },
  refreshButton: {
    backgroundColor: "#008000",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
    width: "100%",
  },
  refreshText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00AF00",
  },
  loadingText: {
    marginTop: 10,
    color: "#FFFFFF",
    fontSize: 16,
  },
});