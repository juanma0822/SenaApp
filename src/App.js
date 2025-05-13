import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StyleSheet, ActivityIndicator, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {jwtDecode} from "jwt-decode"; 
import RootStack from "./navigation/RootStack"; // Ya tienes esta ruta configurada
import { Toaster } from "sonner-native";

export default function App() {
  const [initialRoute, setInitialRoute] = useState("Splash"); // Primero muestra SplashScreen
  const [loading, setLoading] = useState(true); // Controla el estado de carga
  const [usuario, setUsuario] = useState(null); // Almacena los datos del usuario

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (token) {
          console.log(token);
          try {
            const decoded = jwtDecode(token); // Decodifica el token
            const currentTime = Date.now() / 1000; // Tiempo actual en segundos


            if (decoded.exp > currentTime) {
              // Token válido, redirigir según el rol
              const usuarioData = {
                numero_documento: decoded.numero_documento,
                rol: decoded.rol,
                nombres: decoded.nombres,
                apellidos: decoded.apellidos,
              };
              setUsuario(usuarioData); // Almacena los datos del usuario
              if (decoded.rol === "aprendiz" || decoded.rol === "funcionario") {
                setInitialRoute("AprendizFuncionarioTabs");
              } else if (decoded.rol === "guarda") {
                setInitialRoute("GuardaTabs");
              } else if (decoded.rol === "admin") {
                setInitialRoute("AdminTabs");
              } else {
                setInitialRoute("Login"); // Rol no reconocido
              }
            } else {
              // Token expirado, eliminarlo
              await AsyncStorage.removeItem("token");
              setInitialRoute("Login");
            }
          } catch (decodeError) {
            console.error("Error al decodificar el token:", decodeError);
            setInitialRoute("Login");
          }
        } else {
          // No hay token, redirigir al Login
          setInitialRoute("Login");
        }
      } catch (error) {
        console.error("Error al verificar el token:", error);
        setInitialRoute("Login");
      } finally {
        setLoading(false); // Finalizar la carga
      }
    };

    checkToken();
  }, []);

  if (loading) {
    // Mostrar un indicador de carga mientras se verifica el token
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00AF00" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider style={styles.container}>
        <Toaster />
        <NavigationContainer>
          <RootStack initialRouteName={initialRoute} usuario={usuario} />
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
});
