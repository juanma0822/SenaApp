import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import Icon from "react-native-vector-icons/Ionicons";
import SplashScreen from "../screens/SplashScreen";
import { useNavigation } from "@react-navigation/native";

export default function RegistroForm({ titulo, campos, onSubmit, botonText }) {
  const navigation = useNavigation();
  const [formData, setFormData] = useState({});
  const [departamentos, setDepartamentos] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const [loadingDepartamentos, setLoadingDepartamentos] = useState(true);
  const [loadingMunicipios, setLoadingMunicipios] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isRepeatPasswordVisible, setIsRepeatPasswordVisible] = useState(false);
  const [guardando, setGuardando] = useState(false);

  //Obtener la lista de los departamentos al momento de cargarse el componente
  useEffect(() => {
    // Obtener la lista de departamentos al cargar el componente
    fetch(
      "https://www.datos.gov.co/resource/xdk5-pm3f.json?$select=departamento&$group=departamento"
    )
      .then((response) => response.json())
      .then((data) => {
        const departamentosList = data.map((item) => item.departamento).sort();
        setDepartamentos(departamentosList);
        setLoadingDepartamentos(false);
      })
      .catch((error) => {
        //Manejo de errores al cargar los departamentos
        Alert.alert(
          "Error",
          "No se pudieron cargar los municipios. ¿Deseas reintentar?",
          [
            {
              text: "Reintentar",
              onPress: () => {
                setLoadingMunicipios(true);
                fetch(
                  `https://www.datos.gov.co/resource/xdk5-pm3f.json?departamento=${departamento}`
                )
                  .then((response) => response.json())
                  .then((data) => {
                    const municipiosList = data
                      .map((item) => item.municipio)
                      .sort();
                    setMunicipios(municipiosList);
                    setLoadingMunicipios(false);
                  })
                  .catch(() => {
                    setLoadingMunicipios(false);
                    Alert.alert(
                      "Error",
                      "No se pudo obtener los municipios. Inténtalo más tarde."
                    );
                  });
              },
            },
            { text: "Cancelar", style: "cancel" },
          ]
        );
      });
  }, []);

  // Obtener la lista de municipios al seleccionar un departamento
  const handleDepartamentoChange = (departamento) => {
    handleChange("departamento", departamento);
    setLoadingMunicipios(true);
    // Obtener la lista de municipios del departamento seleccionado
    fetch(
      `https://www.datos.gov.co/resource/xdk5-pm3f.json?departamento=${departamento}`
    )
      .then((response) => response.json())
      .then((data) => {
        const municipiosList = data.map((item) => item.municipio).sort();
        setMunicipios(municipiosList);
        setLoadingMunicipios(false);
      })
      .catch((error) => {
        //Manejo de errores al no cargar los municipios
        Alert.alert(
          "Error",
          "No se pudieron cargar los municipios. ¿Deseas reintentar?",
          [
            {
              text: "Reintentar",
              onPress: () => {
                setLoadingMunicipios(true);
                fetch(
                  `https://www.datos.gov.co/resource/xdk5-pm3f.json?departamento=${departamento}`
                )
                  .then((response) => response.json())
                  .then((data) => {
                    const municipiosList = data
                      .map((item) => item.municipio)
                      .sort();
                    setMunicipios(municipiosList);
                    setLoadingMunicipios(false);
                  })
                  .catch(() => {
                    setLoadingMunicipios(false);
                    Alert.alert(
                      "Error",
                      "No se pudo obtener los municipios. Inténtalo más tarde."
                    );
                  });
              },
            },
            { text: "Cancelar", style: "cancel" },
          ]
        );
      });
  };

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  // Manejo del evento de envío del formulario - VALIDAR QUE TODOS LOS DATOS SE ENVIEN EXCEPTO EL FIJO QUE ES OPCIONAL
  const handleSubmit = () => {
    const camposRequeridos = campos.filter((c) => c.name !== "telefonoFijo");

    const camposVacios = camposRequeridos.filter(
      (c) => !formData[c.name] || formData[c.name].trim() === ""
    );

    if (camposVacios.length > 0) {
      const nombresCampos = camposVacios
        .map((c) => c.placeholder || c.name)
        .join(", ");
      Alert.alert(
        "Campos incompletos",
        `Por favor completa los siguientes campos: ${nombresCampos}`
      );
      return;
    }

    const correo = formData["correoInstitucional"];
    if (!correo.endsWith("@soy.sena.edu.co")) {
      Alert.alert(
        "Correo institucional inválido",
        "El correo institucional debe tener la estructura: nombre@soy.sena.edu.co"
      );
      return;
    }

    const contrasena = formData["contrasena"];
    const repetirContrasena = formData["repetirContrasena"];

    if (contrasena !== repetirContrasena) {
      Alert.alert(
        "Contraseñas no coinciden",
        "Las contraseñas ingresadas no son iguales."
      );
      return;
    }

    // Aquí se simula el envío de datos
    setGuardando(true);
    setTimeout(() => {
      setGuardando(false);
      Alert.alert("✅ Datos guardados exitosamente");
      onSubmit(formData);
      navigation.replace("Login"); //Redirigir a la pantalla de login
    }, 3000);
  };

  const renderSeccion = (tituloSeccion, icono, camposSeccion) => (
    <View style={styles.seccionContainer} key={tituloSeccion}>
      <View style={styles.tituloSeccion}>
        <Text style={styles.seccionIcono}>{icono}</Text>
        <Text style={styles.seccionTexto}>{tituloSeccion}</Text>
      </View>
      <View style={styles.card}>
        {camposSeccion.map((campo) => {
          if (
            campo.name === "contrasena" ||
            campo.name === "repetirContrasena"
          ) {
            const isPassword = campo.name === "contrasena";
            const isVisible = isPassword
              ? isPasswordVisible
              : isRepeatPasswordVisible;
            const toggleVisibility = () =>
              isPassword
                ? setIsPasswordVisible(!isPasswordVisible)
                : setIsRepeatPasswordVisible(!isRepeatPasswordVisible);

            return (
              <View key={campo.name} style={styles.inputPasswordContainer}>
                <TextInput
                  style={styles.inputPassword}
                  placeholder={campo.placeholder}
                  onChangeText={(text) => handleChange(campo.name, text)}
                  secureTextEntry={!isVisible}
                />
                <TouchableOpacity onPress={toggleVisibility}>
                  <Icon
                    name={isVisible ? "eye-off-outline" : "eye-outline"}
                    size={24}
                    color="#333"
                  />
                </TouchableOpacity>
              </View>
            );
          }

          if (campo.name === "departamento") {
            return (
              <View key={campo.name} style={styles.pickerContainer}>
                <Text style={styles.label}>
                  Selecciona tu departamento de residencia:
                </Text>
                {loadingDepartamentos ? (
                  <ActivityIndicator size="large" color="#00AF00" />
                ) : (
                  <Picker
                    selectedValue={formData[campo.name] || ""}
                    onValueChange={(value) => handleDepartamentoChange(value)}
                  >
                    <Picker.Item label="Selecciona un departamento" value="" />
                    {departamentos.map((dept, index) => (
                      <Picker.Item key={index} label={dept} value={dept} />
                    ))}
                  </Picker>
                )}
              </View>
            );
          }

          if (campo.name === "municipio") {
            return (
              <View key={campo.name} style={styles.pickerContainer}>
                <Text style={styles.label}>
                  Selecciona tu municipio de residencia:
                </Text>
                {loadingMunicipios ? (
                  <ActivityIndicator size="large" color="#00AF00" />
                ) : (
                  <Picker
                    selectedValue={formData[campo.name] || ""}
                    onValueChange={(value) => handleChange(campo.name, value)}
                    enabled={municipios.length > 0}
                  >
                    <Picker.Item label="Selecciona un municipio" value="" />
                    {municipios.map((mun, index) => (
                      <Picker.Item key={index} label={mun} value={mun} />
                    ))}
                  </Picker>
                )}
              </View>
            );
          }

          if (campo.type === "picker") {
            return (
              <View key={campo.name} style={styles.pickerContainer}>
                <Text style={styles.label}>
                  {(() => {
                    switch (campo.name) {
                      case "tipoDocumento":
                        return "Selecciona tu tipo de documento de identidad:";
                      case "genero":
                        return "Selecciona tu género:";
                      case "nivelSisben":
                        return "Selecciona tu nivel de SISBEN:";
                      case "grupoSisben":
                        return "Selecciona tu grupo de SISBEN:";
                      default:
                        return `Selecciona ${campo.placeholder.toLowerCase()}:`;
                    }
                  })()}
                </Text>
                <Picker
                  selectedValue={formData[campo.name] || ""}
                  onValueChange={(value) => handleChange(campo.name, value)}
                >
                  <Picker.Item
                    label={`Selecciona ${campo.placeholder.toLowerCase()}`}
                    value=""
                  />
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
      </View>
    </View>
  );

  // Agrupación lógica
  const camposUsuario = campos.filter((c) =>
    [
      "nombres",
      "apellidos",
      "correoPersonal",
      "correoInstitucional",
      "contrasena",
      "repetirContrasena",
    ].includes(c.name)
  );

  const camposPersonales = campos.filter((c) =>
    [
      "tipoDocumento",
      "numeroDocumento",
      "lugarExpedicion",
      "genero",
      "edad",
      "nivelSisben",
      "grupoSisben",
      "departamento",
      "municipio",
      "direccion",
      "celular",
      "telefonoFijo",
    ].includes(c.name)
  );

  const otrosCampos = campos.filter(
    (c) => !camposUsuario.includes(c) && !camposPersonales.includes(c)
  );

  if (guardando) {
    return (
      <SplashScreen message="Guardando información..." autoNavigate={false} />
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>

          {renderSeccion("Información del Usuario", "👤", camposUsuario)}
          {renderSeccion("Información Personal", "📄", camposPersonales)}

          {otrosCampos.length > 0 &&
            renderSeccion("Información Adicional", "📝", otrosCampos)}

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
    paddingBottom: 30,
    backgroundColor: "#f9f9f9",
  },
  container: {
    padding: 20,
    paddingTop: 40,
  },
  titulo: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#00AF00",
    textAlign: "center",
  },
  seccionContainer: {
    marginBottom: 30,
  },
  tituloSeccion: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8F5E9",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderLeftWidth: 5,
    borderLeftColor: "#00AF00",
    marginBottom: 10,
    borderRadius: 5,
  },
  seccionIcono: {
    fontSize: 18,
    marginRight: 8,
  },
  seccionTexto: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2E7D32",
  },
  card: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
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
  label: {
    fontSize: 14,
    color: "#2E7D32",
    marginBottom: 5,
    marginLeft: 8,
    fontWeight: "500",
  },
  inputPasswordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#00AF00",
    borderWidth: 1,
    marginBottom: 15,
    borderRadius: 8,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
  },
  inputPassword: {
    flex: 1,
    height: 50,
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
