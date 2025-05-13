import React, { useEffect } from "react";
import { View, Text, StyleSheet, Image, StatusBar } from "react-native";
import Svg, { Path } from "react-native-svg";
import * as Animatable from "react-native-animatable";
import { useNavigation } from "@react-navigation/native";

export default function SplashScreen({
  message = "Cargando módulos...",
  autoNavigate = true,
  duration = 3000,
  nextScreen = "Login",
  navigation: parentNavigation, // Recibir navegación como prop
}) {
  const navigation = parentNavigation || useNavigation(); // Usar la navegación pasada como prop o el hook

  useEffect(() => {
    if (autoNavigate) {
      const timeout = setTimeout(() => {
        navigation.replace(nextScreen);
      }, duration);
      return () => clearTimeout(timeout);
    }
  }, [autoNavigate, duration, navigation, nextScreen]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#00AF00" />

      <Animatable.Image
        animation="fadeIn"
        easing="ease-in-out"
        duration={1500}
        source={require("../../assets/LogoSenaWhite.png")}
        style={[styles.logo, { transform: [{ scale: 0.95 }] }]}
        resizeMode="contain"
      />

      <Animatable.Text animation="fadeInUp" delay={500} style={styles.title}>
        Plataforma SENA
      </Animatable.Text>

      <Animatable.Text animation="fadeIn" delay={1500} style={styles.subtitle}>
        {message}
      </Animatable.Text>

      <View style={styles.waveContainer}>
        <Svg
          height="100%"
          width="100%"
          viewBox="0 0 1415 301"
          style={styles.wave}
        >
          <Path
            fill="#00AF00"
            d="M0,96L48,106.7C96,117,192,139,288,154.7C384,171,480,181,576,186.7C672,192,768,192,864,186.7C960,181,1056,171,1152,160C1248,149,1344,139,1392,133.3L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </Svg>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#00AF00",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    color: "#fff",
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 16,
    color: "#e0e0e0",
    marginTop: 10,
  },
  waveContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: "12%",
    zIndex: -1,
  },
  wave: {
    width: "100%",
  },
});