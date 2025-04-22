import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/Home/Home";
import HistorialScreen from "../screens/Home/Historial";
import ConfiguracionScreen from "../screens/Home/Configuracion";
import RegistroVisitantes from "../screens/Guarda/RegistroVisitantes";
import Prestamos from "../screens/Guarda/Prestamos";
import { FontAwesome5 } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

export default function GuardaTabs({ route }) {
  const { email } = route.params;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#FFFFFF",
        tabBarInactiveTintColor: "#B7B021",
        tabBarStyle: { backgroundColor: "#00AF00" },
        tabBarIcon: ({ color, size }) => {
          let iconName;

          switch (route.name) {
            case "Home": iconName = "home"; break;
            case "Visitantes": iconName = "user-friends"; break;
            case "Prestamos": iconName = "toolbox"; break;
            case "Historial": iconName = "history"; break;
            case "Configuración": iconName = "cogs"; break;
            default: iconName = "question";
          }

          return <FontAwesome5 name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} initialParams={{ email }} />
      <Tab.Screen name="Visitantes" component={RegistroVisitantes} />
      <Tab.Screen name="Prestamos" component={Prestamos} />
      <Tab.Screen name="Historial" component={HistorialScreen} />
      <Tab.Screen name="Configuración" component={ConfiguracionScreen} />
    </Tab.Navigator>
  );
}
