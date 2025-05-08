import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView, Dimensions } from "react-native";
import CamposGeneralesVisitante from "../../components/forms/camposGeneralesVisitante";
import IngresoSalidaFuncionario from "../../components/IngresoSalidaFuncionario";

const { height } = Dimensions.get("window"); // Obtener el alto de la pantalla
const TAB_BAR_HEIGHT = 90; // Altura de la barra de navegación

export default function RegistroVisitantes({ navigation }) {
  const [mostrarCampos, setMostrarCampos] = useState(false); // Estado para mostrar el formulario de visitantes
  const [tipoIngreso, setTipoIngreso] = useState(null); // Estado para controlar el tipo de ingreso/salida de funcionarios

  const handleIngresoVisitante = () => {
    setMostrarCampos(true); // Muestra el formulario de visitantes
  };

  const handleCancelar = () => {
    setMostrarCampos(false); // Oculta el formulario de visitantes
    setTipoIngreso(null); // Oculta el formulario de ingreso/salida de funcionarios
  };

  const handleSubmit = (formData) => {
    console.log("Datos del visitante:", formData);
    setMostrarCampos(false); // Oculta el formulario después de enviar
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.background}>
        <View
          style={[
            styles.card,
            !mostrarCampos && !tipoIngreso ? styles.smallCard : styles.largeCard, // Ajusta el tamaño dinámicamente
          ]}
        >
          <Text style={styles.title}>Registro de Visitantes</Text>
          <Text style={styles.description}>
            Selecciona una opción para registrar el ingreso o salida.
          </Text>
          <ScrollView style={styles.scrollContainer}>
            {!mostrarCampos && !tipoIngreso ? (
              <View style={styles.buttonsContainer}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={handleIngresoVisitante}
                >
                  <Text style={styles.buttonText}>Ingreso Visitante</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.button}
                  onPress={() => setTipoIngreso("entrada")} // Muestra el formulario de ingreso de funcionarios
                >
                  <Text style={styles.buttonText}>Ingreso Funcionario</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.button}
                  onPress={() => setTipoIngreso("salida")} // Muestra el formulario de salida de funcionarios
                >
                  <Text style={styles.buttonText}>Salida Funcionario</Text>
                </TouchableOpacity>
              </View>
            ) : mostrarCampos ? (
              <>
                <CamposGeneralesVisitante onSubmit={handleSubmit} />
                <TouchableOpacity style={styles.cancelButton} onPress={handleCancelar}>
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <IngresoSalidaFuncionario
                  navigation={navigation}
                  tipoIngreso={tipoIngreso} // Pasa 'entrada' o 'salida' como prop
                  onCancel={handleCancelar}
                />
                <TouchableOpacity style={styles.cancelButton} onPress={handleCancelar}>
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
              </>
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
  smallCard: {
    height: 400, // Altura pequeña para los 3 botones
  },
  largeCard: {
    height: height - TAB_BAR_HEIGHT - 85, // Altura dinámica para contenido más largo
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#00AF00", // Verde institucional
    marginBottom: 10,
    textAlign: "center", // Centrar el texto del título
  },
  description: {
    fontSize: 16,
    color: "#666666", // Color gris para el texto descriptivo
    marginBottom: 20,
    textAlign: "center",
  },
  scrollContainer: {
    flex: 1,
    width: "100%",
  },
  buttonsContainer: {
    width: "100%",
    alignItems: "center", // Centrar los botones horizontalmente
    justifyContent: "center", // Centrar los botones verticalmente
    flex: 1, // Ocupa todo el espacio disponible
  },
  button: {
    backgroundColor: "#00AF00",
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 10,
    marginBottom: 15,
    width: "85%",
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center", // Centrar el texto del botón
  },
  cancelButton: {
    backgroundColor: "#FF5C5C",
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 10,
    marginTop: 20,
    width: "100%",
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});