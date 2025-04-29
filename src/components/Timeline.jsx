import React from "react";
import { View, Text, StyleSheet } from "react-native";

const Timeline = ({ data }) => {
  return (
    <View style={styles.timelineContainer}>
      {data.map((entry, index) => (
        <View
          key={index}
          style={[
            styles.entryContainer,
            entry.tipo_ingreso === "entrada"
              ? styles.ingresoContainer
              : styles.salidaContainer,
          ]}
        >
          <View
            style={[
              styles.titleContainer,
              entry.tipo_ingreso === "entrada"
                ? styles.ingresoTitle
                : styles.salidaTitle,
            ]}
          >
            <Text style={styles.titleText}>
              {entry.tipo_ingreso === "entrada" ? "Ingreso" : "Salida"}
            </Text>
          </View>
          <Text style={styles.entryText}>
            Fecha y hora: {new Date(entry.fecha_hora).toLocaleString()}
          </Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  timelineContainer: {
    marginTop: 20,
  },
  entryContainer: {
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  ingresoContainer: {
    backgroundColor: "#E8F5E9", // Verde claro para ingresos
    borderLeftWidth: 5,
    borderLeftColor: "#00AF00", // Verde pronunciado
  },
  salidaContainer: {
    backgroundColor: "#FDECEA", // Rojo claro para salidas
    borderLeftWidth: 5,
    borderLeftColor: "#FF5C5C", // Rojo pronunciado
  },
  titleContainer: {
    marginBottom: 8,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  ingresoTitle: {
    backgroundColor: "#C8E6C9", // Verde más claro para el título de ingreso
  },
  salidaTitle: {
    backgroundColor: "#FFCDD2", // Rojo más claro para el título de salida
  },
  titleText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  entryText: {
    fontSize: 14,
    color: "#555",
  },
});

export default Timeline;