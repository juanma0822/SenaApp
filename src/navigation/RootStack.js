import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SplashScreen from "../screens/SplashScreen";
import LoginScreen from "../screens/Auth/Login";
import RegistrationScreen from "../screens/Auth/Registration";
import RegistroAprendiz from "../screens/Auth/RegistroAprendiz";
import RegistroFuncionario from "../screens/Auth/RegistroFuncionario";
import HomeTabs from "./HomeTabs";
import AprendizFuncionarioTabs from "./AprendizFuncionarioTabs";
import GuardaTabs from "./GuardaTabs";

const Stack = createNativeStackNavigator();

export default function RootStack() {
  return (
    <Stack.Navigator initialRouteName="Splash">
      <Stack.Screen
        name="Splash"
        component={SplashScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="AprendizFuncionarioTabs"
        component={AprendizFuncionarioTabs}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="GuardaTabs"
        component={GuardaTabs}
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
        options={{
          title: "Registro Aprendiz",
          headerStyle: {
            backgroundColor: "#00AF00", // Fondo verde institucional
          },
          headerTintColor: "#FFFFFF", // Botón de retroceso en blanco
          headerTitleStyle: {
            fontWeight: "bold", // Texto del título en negrita
          },
        }}
      />
      <Stack.Screen
        name="RegistroFuncionario"
        component={RegistroFuncionario}
        options={{
          title: "Registro Funcionario",
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
