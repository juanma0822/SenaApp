// Importación del navegador de stack nativo para React Navigation
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Importaciones de pantallas de autenticación y splash
import SplashScreen from "../screens/SplashScreen"; // Pantalla de carga inicial
import LoginScreen from "../screens/Auth/Login"; // Pantalla de inicio de sesión
import RegistrationScreen from "../screens/Auth/Registration"; // Pantalla de selección de tipo de registro
import RegistroAprendiz from "../screens/Auth/RegistroAprendiz"; // Formulario de registro para aprendices
import RegistroFuncionario from "../screens/Auth/RegistroFuncionario"; // Formulario de registro para funcionarios

// Importaciones de navegadores de pestañas según el rol del usuario
import AprendizFuncionarioTabs from "./AprendizFuncionarioTabs"; // Tabs para aprendices y funcionarios
import GuardaTabs from "./GuardaTabs"; // Tabs específicos para guardas de seguridad
import AdminTabs from "./AdminTabs"; // Tabs administrativos para subdirectores

// Importaciones de pantallas principales
import EscanearQR from "../screens/Home/EscanearQR"; // Pantalla para escanear códigos QR
import Home from "../screens/Home/Home"; // Pantalla principal de inicio

// Importaciones de componentes específicos para guardas de seguridad
import CrearLlave from "../components/LlavesGuarda/CrearLlave"; // Componente para crear nuevas llaves
import SalidaDispositivo from "../components/SalidaDispositivosGuarda/SalidaDispositivos"; // Gestión de salida de dispositivos
import GestionPrestamoLlaves from "../components/LlavesGuarda/GestionPrestamoLlave"; // Gestión de préstamos de llaves

// Crear instancia del navegador de stack
const Stack = createNativeStackNavigator();

/**
 * Componente principal de navegación por stack
 * Maneja todas las rutas de la aplicación y la navegación entre pantallas
 * 
 * @param {string} initialRouteName - Nombre de la ruta inicial (por defecto "Splash")
 * @param {Object} usuario - Objeto con los datos del usuario autenticado
 * @returns {JSX.Element} Navegador de stack configurado
 */
export default function RootStack({ initialRouteName = "Splash", usuario }) {
  return (
    <Stack.Navigator initialRouteName={initialRouteName}>
      
      {/* ========== PANTALLAS DE AUTENTICACIÓN Y SPLASH ========== */}
      
      {/* Pantalla de carga inicial - se muestra al abrir la app */}
      <Stack.Screen
        name="Splash"
        component={SplashScreen}
        options={{ headerShown: false }} // Sin header para efecto de splash
      />
      
      {/* Pantalla de inicio de sesión */}
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }} // Sin header para diseño personalizado
      />
      
      {/* Pantalla principal de inicio (individual, no en tabs) */}
      <Stack.Screen
        name="Home"
        component={Home}
        options={{
          title: "Registro de Ingreso", // Título en la barra de navegación
          headerStyle: {
            backgroundColor: "#00AF00", // Fondo verde institucional del SENA
          },
          headerTintColor: "#FFFFFF", // Color blanco para el botón de retroceso
          headerTitleStyle: {
            fontWeight: "bold", // Texto del título en negrita
          },
        }}
      />

      {/* ========== NAVEGADORES DE PESTAÑAS SEGÚN ROL ========== */}
      
      {/* Tabs para usuarios con rol de aprendiz o funcionario */}
      <Stack.Screen
        name="AprendizFuncionarioTabs"
        component={AprendizFuncionarioTabs}
        initialParams={{ usuario }} // Pasar datos del usuario a las tabs
        options={{ headerShown: false }} // Sin header - las tabs manejan su propia navegación
      />

      {/* Tabs para usuarios con rol de administrador/subdirector */}
      <Stack.Screen
        name="AdminTabs"
        component={AdminTabs}
        initialParams={{ usuario }} // Pasar datos del usuario a las tabs
        options={{ headerShown: false }} // Sin header - las tabs manejan su propia navegación
      />

      {/* Tabs para usuarios con rol de guarda de seguridad */}
      <Stack.Screen
        name="GuardaTabs"
        component={GuardaTabs}
        initialParams={{ usuario }} // Pasar datos del usuario a las tabs
        options={{ headerShown: false }} // Sin header - las tabs manejan su propia navegación
      />

      {/* ========== PANTALLAS ESPECÍFICAS PARA GUARDAS ========== */}
      
      {/* Pantalla para crear nuevas llaves en el sistema */}
      <Stack.Screen
        name="CrearLlave"
        component={CrearLlave}
        options={{
          title: "Crear Llave", // Título en la barra de navegación
          headerStyle: {
            backgroundColor: "#00AF00", // Fondo verde institucional
          },
          headerTintColor: "#FFFFFF", // Texto y botones en blanco
          headerTitleStyle: {
            fontWeight: "bold", // Título en negrita
          },
          headerBackTitle: "Volver", // Texto personalizado para el botón de retroceso
        }}
      />

      {/* Pantalla para gestionar préstamos y devoluciones de llaves */}
      <Stack.Screen
        name="PrestamoLlave"
        component={GestionPrestamoLlaves}
        options={{
          title: "Gestion prestamos llaves", // Título en la barra de navegación
          headerStyle: {
            backgroundColor: "#00AF00", // Fondo verde institucional
          },
          headerTintColor: "#FFFFFF", // Texto y botones en blanco
          headerTitleStyle: {
            fontWeight: "bold", // Título en negrita
          },
          headerBackTitle: "Volver", // Texto personalizado para el botón de retroceso
        }}
      />

      {/* Pantalla para gestionar la salida de dispositivos institucionales */}
      <Stack.Screen
        name="SalidaDispositivo"
        component={SalidaDispositivo}
        options={{
          title: "Salida Dispositivo", // Título en la barra de navegación
          headerStyle: {
            backgroundColor: "#00AF00", // Fondo verde institucional
          },
          headerTintColor: "#FFFFFF", // Texto y botones en blanco
          headerTitleStyle: {
            fontWeight: "bold", // Título en negrita
          },
          headerBackTitle: "Volver", // Texto personalizado para el botón de retroceso
        }}
      />

      {/* ========== PANTALLAS FUNCIONALES ========== */}
      
      {/* Pantalla para escanear códigos QR de ingreso y salida */}
      <Stack.Screen
        name="EscanearQR"
        component={EscanearQR}
        options={{ headerShown: false }} // Sin header para mostrar la cámara en pantalla completa
      />

      {/* ========== PANTALLAS DE REGISTRO ========== */}
      
      {/* Pantalla de selección del tipo de registro (aprendiz o funcionario) */}
      <Stack.Screen
        name="Registration"
        component={RegistrationScreen}
        options={{ headerShown: false }} // Sin header para diseño personalizado
      />
      
      {/* Formulario de registro específico para aprendices */}
      <Stack.Screen
        name="RegistroAprendiz"
        component={RegistroAprendiz}
        options={{
          title: "Registro Aprendiz", // Título descriptivo del formulario
          headerStyle: {
            backgroundColor: "#00AF00", // Fondo verde institucional
          },
          headerTintColor: "#FFFFFF", // Botón de retroceso en blanco
          headerTitleStyle: {
            fontWeight: "bold", // Texto del título en negrita
          },
        }}
      />
      
      {/* Formulario de registro específico para funcionarios */}
      <Stack.Screen
        name="RegistroFuncionario"
        component={RegistroFuncionario}
        options={{
          title: "Registro Funcionario", // Título descriptivo del formulario
          headerStyle: {
            backgroundColor: "#00AF00", // Fondo verde institucional
          },
          headerTintColor: "#FFFFFF", // Botón de retroceso en blanco
          headerTitleStyle: {
            fontWeight: "bold", // Texto del título en negrita
          },
        }}
      />
    </Stack.Navigator>
  );
}
