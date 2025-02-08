import { Text, StyleSheet, View, Image, TextInput, TouchableOpacity } from "react-native";
import React, { Component } from "react";

export default function Login() {
  return (
    <View style={styles.padre}>
        <View>
            <Image source={require('../assets/logo.png')}  style={styles.profile} />
        </View>

        <View style={styles.card}>
            <View style={styles.cajaTexto}>
                <Text>Correo:</Text>
                <TextInput placeholder="correo@gmail.com" style={{marginTop:8 ,paddingHorizontal:15, backgroundColor:'#f1f1f1', borderRadius:21}} />
            </View>
            <View style={styles.cajaTexto}>
                <Text>Contraseña:</Text>
                <TextInput placeholder="contraseña" style={{marginTop:8, paddingHorizontal:15, backgroundColor:'#f1f1f1', borderRadius:21}} />
            </View>

            <View>
                <TouchableOpacity>
                    <Text>Sign In</Text>
                </TouchableOpacity>
            </View>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
    padre:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#a4caff'
    },
    profile: {
        width: 100,
        height: 100,
    },
    card:{
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 20,
        width: '90%',
        margin: 20,
        shadowColor: '#2600fb',
        shadowOffset: { width: 0, height: 2},
        shadowOpacity: 0.5,
        shadowRadius: 4,
        elevation: 9,
    },
    cajaTexto: {
        marginTop:5,
        marginBottom: 20
    }
});
