import React, { useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/Home/Home";
import HistorialScreen from "../screens/Home/Historial";
import ConfiguracionScreen from "../screens/Home/Configuracion";
import { View, TouchableOpacity, Animated, StyleSheet } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

function CustomTabBarButton({ children, onPress }) {
  const [scale, setScale] = useState(new Animated.Value(1)); // Controla el tamaño del botón

  const handlePressIn = () => {
    // Escala el botón cuando es presionado
    Animated.spring(scale, {
      toValue: 1.2, // Agranda el botón
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    // Vuelve al tamaño original cuando se suelta
    Animated.spring(scale, {
      toValue: 1, // Tamaño normal
      useNativeDriver: true,
    }).start();
  };

  return (
    <TouchableOpacity
      style={styles.customButtonContainer}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Animated.View style={[styles.customButton, { transform: [{ scale }] }]}>
        {children}
      </Animated.View>
    </TouchableOpacity>
  );
}

export default function AprendizFuncionarioTabs({ route }) {
  const { usuario } = route.params;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
      }}
      initialRouteName="Home"
    >
      <Tab.Screen
        name="Historial"
        component={HistorialScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <FontAwesome5
              name="history"
              size={focused ? 26 : 24} // Ajuste del tamaño del ícono
              color={focused ? "#00AF00" : "#cfcfcf"} // Verde cuando está seleccionado
              style={styles.iconStyle}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Home"
        component={HomeScreen}
        initialParams={{ usuario }}
        options={{
          tabBarIcon: ({ focused }) => (
            <FontAwesome5
              name="plus"
              size={focused ? 30 : 30} // El ícono central más grande cuando está enfocado
              color="#ffffff"
              style={styles.iconStyle}
            />
          ),
          tabBarButton: (props) => <CustomTabBarButton {...props} />,
        }}
      />

      <Tab.Screen
        name="Configuración"
        component={ConfiguracionScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <FontAwesome5
              name="user-cog"
              size={focused ? 26 : 24} // Ajuste del tamaño del ícono
              color={focused ? "#00AF00" : "#cfcfcf"} // Verde cuando está seleccionado
              style={styles.iconStyle}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    backgroundColor: "#ffffff",
    height: 70,
    borderTopWidth: 0,
    elevation: 0,
    paddingBottom: 5,
    paddingTop: 8,
  },
  customButtonContainer: {
    top: -25,
    justifyContent: "center",
    alignItems: "center",
  },
  customButton: {
    width: 65,
    height: 65,
    borderRadius: 32.5, // Circular
    backgroundColor: "#0e7e0e",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },

});
