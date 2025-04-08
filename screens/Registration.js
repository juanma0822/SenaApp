import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import * as Animatable from "react-native-animatable";

const { width } = Dimensions.get("window");

export default function RegistrationScreen() {
  const navigation = useNavigation();

  const handleFuncionarioPress = () => {
    navigation.navigate("RegistroFuncionario");
  };

  const handleAprendizPress = () => {
    navigation.navigate("RegistroAprendiz");
  };

  return (
    <View style={styles.background}>
      <View style={styles.content}>
        <Animatable.View animation="fadeInUp" delay={300} style={styles.card}>
          <Text style={styles.logoText}>Registro SENA</Text>
          <Text style={styles.subtitle}>Selecciona tu tipo de registro</Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={handleFuncionarioPress} style={styles.optionButton}>
              <LinearGradient
                colors={['#4AB000', '#00B03C', '#00AF00', '#93B000', '#B7B021']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradient}
              >
                <Text style={styles.optionButtonText}>Funcionario</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleAprendizPress} style={styles.optionButton}>
              <LinearGradient
                colors={['#4AB000', '#00B03C', '#00AF00', '#93B000', '#B7B021']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradient}
              >
                <Text style={styles.optionButtonText}>Aprendiz</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </Animatable.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#00AF00",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  card: {
    width: "100%",
    paddingVertical: 40,
    paddingHorizontal: 25,
    borderRadius: 24,
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.93)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.62)",

    // iOS shadow
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,

    // Android elevation
    elevation: 12,
  },
  logoText: {
    color: "#00AF00",
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#00AF00",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 30,
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
  },
  optionButton: {
    width: "90%",
    marginVertical: 10,
    borderRadius: 16,
    overflow: "hidden",
    elevation: 4,
  },
  gradient: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  optionButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
