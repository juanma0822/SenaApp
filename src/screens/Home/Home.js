import React, { useEffect } from "react";
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import { CommonActions } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwtDecode from "jwt-decode";
import { FontAwesome } from "@expo/vector-icons"; // Importar íconos

export default function Home(props) {
  const { usuario } = props.route.params;

  const handleSignOut = async () => {
    Alert.alert("Cerrando sesión", "Has salido correctamente!");
    await AsyncStorage.removeItem("token"); // Borrar el token
    props.navigation.dispatch(
      CommonActions.reset({ index: 0, routes: [{ name: "Login" }] })
    );
  };

  // Verificar token expirado al cargar la pantalla
  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        try {
          const decoded = jwtDecode(token);
          const currentTime = Date.now() / 1000; // Tiempo actual en segundos
          if (decoded.exp < currentTime) {
            Alert.alert(
              "Sesión expirada",
              "Tu sesión ha expirado, por favor inicia sesión nuevamente."
            );
            await AsyncStorage.removeItem("token");
            props.navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: "Login" }],
              })
            );
          }
        } catch (error) {
          console.log("Error al decodificar el token:", error);
        }
      }
    };

    checkToken();
  }, []);

  return (
    <View style={styles.container}>
      {/* Logo del SENA */}
      <View style={styles.logoContainer}>
        <Image
          source={require("../../../assets/LogoSenaWhite.png")}
          style={styles.logoImage}
        />
        <Text style={styles.logoText}>Registro SENA</Text>
      </View>

      {/* Contenedor principal */}
      <View style={styles.contentContainer}>
        <Text style={styles.welcomeText}>Bienvenido, {usuario.nombres}!</Text>
        <Text style={styles.instructionsText}>
          Escanea los QR usando los botones de abajo.
        </Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.optionButton}
            onPress={() =>
              props.navigation.navigate("EscanearQR", { tipo: "ingreso" })
            }
          >
            <FontAwesome
              name="sign-in"
              size={18}
              color="#FFFFFF"
              style={styles.buttonIcon}
            />
            <Text style={styles.optionText}>Registrar Ingreso</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionButton}
            onPress={() =>
              props.navigation.navigate("EscanearQR", { tipo: "salida" })
            }
          >
            <FontAwesome
              name="sign-out"
              size={18}
              color="#FFFFFF"
              style={styles.buttonIcon}
            />
            <Text style={styles.optionText}>Registrar Salida</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <FontAwesome
            name="power-off"
            size={18}
            color="#FFFFFF"
            style={styles.buttonIcon}
          />
          <Text style={styles.signOutButtonText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#00AF00", // Fondo verde institucional
    alignItems: "center",
    justifyContent: "flex-start", // Alinear el contenido hacia la parte superior
    padding: 20,
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 50, // Espaciado desde la parte superior
    marginBottom: 80, // Espaciado entre el logo y el contenido principal
  },
  logoImage: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  logoText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  contentContainer: {
    width: "100%",
    maxWidth: 350,
    backgroundColor: "#FFFFFF", // Fondo blanco para el contenido
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
  welcomeText: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#00AF00", // Verde institucional
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  icon: {
    marginRight: 5,
  },
  infoText: {
    fontSize: 16,
    color: "#666",
  },
  instructionsText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 30,
    textAlign: "center",
  },
  buttonContainer: {
    width: "65%",
    marginBottom: 30,
  },
  optionButton: {
    flexDirection: "row", // Ícono y texto en línea
    backgroundColor: "#008000", // Fondo verde para los botones
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  buttonIcon: {
    marginRight: 10, // Espaciado entre el ícono y el texto
  },
  optionText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  signOutButton: {
    flexDirection: "row", // Ícono y texto en línea
    backgroundColor: "#FF5C5C", // Rojo para el botón de cerrar sesión
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  signOutButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10, // Espaciado entre el ícono y el texto
  },
});
