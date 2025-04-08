import React, { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  KeyboardAvoidingView
} from "react-native";
import { Picker } from "@react-native-picker/picker";

export default function RegistroForm({ titulo, campos, onSubmit, botonText }) {
  const [formData, setFormData] = useState({});

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Text style={styles.titulo}>{titulo}</Text>

          {campos.map((campo) => {
            if (campo.type === "picker") {
              return (
                <View key={campo.name} style={styles.pickerContainer}>
                  <Picker
                    selectedValue={formData[campo.name] || ""}
                    onValueChange={(value) => handleChange(campo.name, value)}
                  >
                    <Picker.Item label={`Selecciona ${campo.placeholder.toLowerCase()}`} value="" />
                    {campo.options.map((opcion, index) => (
                      <Picker.Item key={index} label={opcion} value={opcion} />
                    ))}
                  </Picker>
                </View>
              );
            }

            return (
              <TextInput
                key={campo.name}
                style={styles.input}
                placeholder={campo.placeholder}
                onChangeText={(text) => handleChange(campo.name, text)}
                secureTextEntry={campo.secureTextEntry || false}
                keyboardType={campo.keyboardType || "default"}
              />
            );
          })}

          <TouchableOpacity style={styles.boton} onPress={handleSubmit}>
            <Text style={styles.botonTexto}>{botonText}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingBottom: 30,
    backgroundColor: "#f9f9f9",
  },
  container: {
    padding: 20,
    marginTop: 30,
  },
  titulo: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#00AF00",
    textAlign: "center",
  },
  input: {
    height: 50,
    borderColor: "#00AF00",
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#00AF00",
    borderRadius: 8,
    marginBottom: 15,
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  boton: {
    backgroundColor: "#00AF00",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  botonTexto: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
