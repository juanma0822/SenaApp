import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";

export default function Prestamos({ navigation }) {
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.card}>
        <Text style={styles.title}>Préstamos</Text>
        <Text style={styles.description}>
          Selecciona una opción para gestionar los préstamos y devoluciones.
        </Text>

        {/* Contenedor para los botones */}
        <View style={styles.buttonsContainer}>
          <View style={styles.row}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate("PrestamoLlave")}
            >
              <FontAwesome5 name="key" size={18} color="#fff" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Préstamo de Llave</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate("CrearLlave")}
            >
              <FontAwesome name="plus-square" size={18} color="#fff" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Creación de Llave</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.row}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate("SalidaDispositivo")}
            >
              <FontAwesome name="tablet" size={18} color="#fff" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Salida de Dispositivo</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#00AF00", // Fondo verde institucional
  },
  card: {
    width: "100%",
    maxWidth: 500,
    backgroundColor: "#FFFFFF", // Fondo blanco para el card
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5, // Sombra para Android
    borderWidth: 4,
    borderColor: "#008000", // Color del borde verde institucional
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#00AF00",
    marginBottom: 10,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: "#666666", // Color gris para el texto descriptivo
    marginBottom: 50,
    textAlign: "center",
  },
  buttonsContainer: {
    width: "100%",
    alignItems: "center", // Centrar los botones horizontalmente
    justifyContent: "center", // Centrar los botones verticalmente
  },
  row: {
    flexDirection: "row", // Mostrar los botones en fila
    justifyContent: "space-around", // Espaciado uniforme entre botones
    width: "100%",
    marginBottom: 15, // Espaciado entre filas
  },
  button: {
    flexDirection: "column", // Ícono y texto en línea
    backgroundColor: "#00AF00",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 20,
    width: "45%",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});