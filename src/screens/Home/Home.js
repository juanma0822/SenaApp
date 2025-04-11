import { Text, StyleSheet, View, TouchableOpacity, Alert } from "react-native";
import React from "react";
import { getAuth, signOut } from "firebase/auth";
import { CommonActions } from "@react-navigation/native";

export default function Home(props) {
  const { email, password } = props.route.params;

  const handleSignOut = () => {
        Alert.alert('Cerrando sesion',"Has salido correctamente!");
        props.navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: "Login" }],
          })
        );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Bienvenido, {email}!</Text>
      <Text style={styles.infoText}>Tu contraseña es: {password}</Text>
      <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
        <Text style={styles.signOutButtonText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  infoText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  signOutButton: {
    backgroundColor: "#ff5c5c",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  signOutButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});