import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"; // Importar Bottom Tabs
import { StyleSheet } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Toaster } from "sonner-native";
import HomeScreen from "./screens/Home";
import LoginScreen from "./screens/Login";
import RegistrationScreen from "./screens/Registration";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import RegistroAprendiz from "./screens/RegistroAprendiz";
import RegistroFuncionario from "./screens/RegistroFuncionario";
import SplashScreen from "./screens/SplashScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator(); // Crear el navegador de pestañas
import { FontAwesome } from "@expo/vector-icons"; // Iconos de FontAwesome
// Navegador de pestañas (solo para Home)
function HomeTabs({ route }) {
  const { email, password } = route.params; // Recibir parámetros desde Login

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#00AF00", // Fondo verde institucional
          borderTopWidth: 0,
        },
        tabBarActiveTintColor: "#FFFFFF", // Color del texto activo
        tabBarInactiveTintColor: "#B7B021", // Color del texto inactivo
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home";
          } else if (route.name === "Registration") {
            iconName = focused ? "user-plus" : "user-plus";
          }

          return <FontAwesome name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        initialParams={{ email, password }} // Pasar parámetros a Home
      />
      <Tab.Screen name="Registration" component={RegistrationScreen} />
    </Tab.Navigator>
  );
}

function RootStack() {
  return (
    <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: true }}>
      <Stack.Screen
        name="Splash"
        component={SplashScreen}
        options={{ headerShown: false }}
        screenOptions={{
          headerShown: true,
          animation: 'fade',
        }}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="HomeTabs"
        component={HomeTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Registration"
        component={RegistrationScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="RegistroAprendiz"
        component={RegistroAprendiz}
        options={{ title: "Registro Aprendiz" }}
      />
      <Stack.Screen
        name="RegistroFuncionario"
        component={RegistroFuncionario}
        options={{ title: "Registro Funcionario" }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider style={styles.container}>
        <Toaster />
        <NavigationContainer>
          <RootStack />
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
