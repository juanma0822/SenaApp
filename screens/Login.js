import {
  Text,
  StyleSheet,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert
} from "react-native";
import React, { Component, useState } from "react";

import appFirebase from "../credenciales";
import {getAuth, signInWithEmailAndPassword} from "firebase/auth";
const auth = getAuth(appFirebase);

export default function Login(props) {


  //Creamos la variable de estado
  const[email, setEmail] = useState();
  const[password, setPassword] = useState();

  //Creamos la función para el login
  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert("Iniciando sesión", 'Accediendo...');
      props.navigation.navigate('Home');
    } catch (error) {
      Alert.alert("Error de login", "Usuario o contraseña incorrectos");
      console.log(error);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <View style={styles.padre}>
        <View>
          <Image
            source={require("../assets/logo.png")}
            style={styles.profile}
          />
        </View>

        <View style={styles.card}>
          <View style={styles.cajaTexto}>
            <Text>Correo:</Text>
            <TextInput
              placeholder="correo@gmail.com"
              keyboardType="email-address"
              style={{
                marginTop: 8,
                paddingHorizontal: 15,
                backgroundColor: "#cccccc40",
                borderRadius: 21,
                paddingVertical:15,
              }}
              onChangeText={(text) => setEmail(text)}
            />
          </View>
          <View style={styles.cajaTexto}>
            <Text>Contraseña:</Text>
            <TextInput
              placeholder="contraseña"
              secureTextEntry={true}
              style={{
                marginTop: 8,
                paddingHorizontal: 15,
                backgroundColor: "#cccccc40",
                borderRadius: 21,
                paddingVertical:15,
              }}
              onChangeText={(text) => setPassword(text)}
            />
          </View>

          <View style={styles.PadreBoton}>
            <TouchableOpacity style={styles.cajaBoton} onPress={login}>
              <Text style={styles.TextBoton}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
  },
  padre: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#a4caff",
    height: "100%",
  },
  profile: {
    width: 100,
    height: 100,
  },
  card: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 20,
    width: "90%",
    margin: 20,
    shadowColor: "#2600fb",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 9,
  },
  cajaTexto: {
    marginTop: 5,
    marginBottom: 20,
  },
  PadreBoton:{
    alignItems: "center",
  },
  cajaBoton: {
    backgroundColor: "#2600fb",
    paddingVertical: 20,
    borderRadius: 30,
    marginTop: 20,
    width: 150,
  },
  TextBoton: {
    textAlign: "center",
    color: "white",
    fontWeight: "bold",
  }
});
