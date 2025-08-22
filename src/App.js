// Importaciones necesarias para React y React Native
import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StyleSheet, ActivityIndicator, View } from "react-native";

// Importaciones para manejo de almacenamiento local y autenticación
import AsyncStorage from "@react-native-async-storage/async-storage";
import {jwtDecode} from "jwt-decode"; 

// Importaciones de componentes locales
import RootStack from "./navigation/RootStack"; // Stack principal de navegación
import { Toaster } from "sonner-native"; // Componente para mostrar notificaciones

/**
 * Componente principal de la aplicación SENA
 * Maneja la autenticación inicial y determina la ruta de inicio según el rol del usuario
 */
export default function App() {
  // Estados para controlar la navegación y autenticación
  const [initialRoute, setInitialRoute] = useState("Splash"); // Ruta inicial - comienza con SplashScreen
  const [loading, setLoading] = useState(true); // Controla el estado de carga mientras verifica el token
  const [usuario, setUsuario] = useState(null); // Almacena los datos del usuario autenticado

  /**
   * useEffect que se ejecuta al montar el componente
   * Verifica si existe un token válido y determina la ruta inicial
   */
  useEffect(() => {
    /**
     * Función asíncrona que verifica la validez del token JWT
     * y redirige al usuario según su rol
     */
    const checkToken = async () => {
      try {
        // Obtener el token JWT del almacenamiento local
        const token = await AsyncStorage.getItem("token");
        
        if (token) {
          console.log(token); // Log del token para debugging
          
          try {
            // Decodificar el token JWT para obtener la información del usuario
            const decoded = jwtDecode(token);
            const currentTime = Date.now() / 1000; // Tiempo actual en segundos (formato Unix)

            // Verificar si el token no ha expirado
            if (decoded.exp > currentTime) {
              // Token válido - extraer datos del usuario del payload del JWT
              const usuarioData = {
                numero_documento: decoded.numero_documento,
                rol: decoded.rol,
                nombres: decoded.nombres,
                apellidos: decoded.apellidos,
              };
              
              setUsuario(usuarioData); // Guardar datos del usuario en el estado
              
              // Determinar la ruta inicial según el rol del usuario
              if (decoded.rol === "aprendiz" || decoded.rol === "funcionario") {
                setInitialRoute("AprendizFuncionarioTabs"); // Tabs para aprendices y funcionarios
              } else if (decoded.rol === "guarda") {
                setInitialRoute("GuardaTabs"); // Tabs específicos para guardas de seguridad
              } else if (decoded.rol === "admin") {
                setInitialRoute("AdminTabs"); // Tabs administrativos para subdirectores
              } else {
                setInitialRoute("Login"); // Rol no reconocido - redirigir al login
              }
            } else {
              // Token expirado - eliminar del almacenamiento y redirigir al login
              await AsyncStorage.removeItem("token");
              setInitialRoute("Login");
            }
          } catch (decodeError) {
            // Error al decodificar el token - probablemente token corrupto
            console.error("Error al decodificar el token:", decodeError);
            setInitialRoute("Login");
          }
        } else {
          // No hay token guardado - usuario no autenticado
          setInitialRoute("Login");
        }
      } catch (error) {
        // Error general al verificar el token
        console.error("Error al verificar el token:", error);
        setInitialRoute("Login");
      } finally {
        // Finalizar el estado de carga sin importar el resultado
        setLoading(false);
      }
    };

    // Ejecutar la verificación del token
    checkToken();
  }, []); // Array vacío significa que solo se ejecuta una vez al montar

  // Mostrar indicador de carga mientras se verifica el token
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00AF00" />
      </View>
    );
  }

  // Renderizar la aplicación principal una vez completada la verificación
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* Proveedor de área segura para manejar notches y barras de estado */}
      <SafeAreaProvider style={styles.container}>
        {/* Componente para mostrar notificaciones toast */}
        <Toaster />
        
        {/* Contenedor principal de navegación */}
        <NavigationContainer>
          {/* Stack de navegación principal con ruta inicial y datos del usuario */}
          <RootStack initialRouteName={initialRoute} usuario={usuario} />
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

/**
 * Estilos del componente App
 */
const styles = StyleSheet.create({
  // Contenedor principal - ocupa toda la pantalla
  container: {
    flex: 1,
  },
  // Contenedor para el indicador de carga
  loadingContainer: {
    flex: 1,
    justifyContent: "center", // Centrar verticalmente
    alignItems: "center",     // Centrar horizontalmente
    backgroundColor: "#FFFFFF", // Fondo blanco
  },
});
