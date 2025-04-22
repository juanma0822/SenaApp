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
import { useNavigation } from "@react-navigation/native";
import RNPickerSelect from 'react-native-picker-select';



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
  //Manejador de errores
  const [erroresCampos, setErroresCampos] = useState({});
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

const showDatePicker = () => {
  setDatePickerVisibility(true);
};

const hideDatePicker = () => {
  setDatePickerVisibility(false);
};

const handleConfirm = (date) => {
  const dia = date.getDate().toString().padStart(2, '0');
  const mes = date.toLocaleString('es-ES', { month: 'long' });
  const anio = date.getFullYear().toString();

  handleChange('diaNacimiento', dia);
  handleChange('mesNacimiento', mes);
  handleChange('anioNacimiento', anio);

  hideDatePicker();
};


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
    const updatedFormData = { ...formData, [name]: value };
  
    // Construir la fecha de nacimiento si los campos están completos
    if (
      updatedFormData.diaNacimiento &&
      updatedFormData.mesNacimiento &&
      updatedFormData.anioNacimiento
    ) {
      updatedFormData.fechaNacimiento = `${updatedFormData.diaNacimiento}/${updatedFormData.mesNacimiento}/${updatedFormData.anioNacimiento}`;
    }
  
    setFormData(updatedFormData);
  };

  // Manejo del evento de envío del formulario - VALIDAR QUE TODOS LOS DATOS SE ENVIEN EXCEPTO EL FIJO QUE ES OPCIONAL
  const handleSubmit = () => {
    const camposRequeridos = campos.filter((c) => c.name !== "telefonoFijo");
    const nuevosErrores = {};
    const camposVacios = camposRequeridos.filter(
      (c) => !formData[c.name] || formData[c.name].trim() === ""
    );
  
    if (camposVacios.length > 0) {
      camposVacios.forEach((campo) => {
        nuevosErrores[campo.name] = true;
      });
  
      setErroresCampos(nuevosErrores);
  
      const nombresCampos = camposVacios
        .map((c) => c.placeholder || c.name)
        .join(", ");
      Alert.alert(
        "Campos incompletos",
        `Por favor completa los siguientes campos: ${nombresCampos}`
      );
      return;
    }
  
    if (!formData["correoInstitucional"]?.endsWith("@soy.sena.edu.co")) {
      setErroresCampos({ correoInstitucional: true });
      Alert.alert(
        "Correo institucional inválido",
        "El correo institucional debe tener la estructura: nombre@soy.sena.edu.co"
      );
      return;
    }
  
    if (formData["contrasena"] !== formData["repetirContrasena"]) {
      setErroresCampos({
        contrasena: true,
        repetirContrasena: true,
      });
      Alert.alert(
        "Contraseñas no coinciden",
        "Las contraseñas ingresadas no son iguales."
      );
      return;
    }
  
    // VALIDACIÓN DE FECHA NACIMIENTO (ahora ya está unida)
    if (!formData.diaNacimiento || !formData.mesNacimiento || !formData.anioNacimiento) {
      Alert.alert(
        "Fecha incompleta",
        "Por favor completa tu fecha de nacimiento: día, mes y año."
      );
      return;
    }

    setErroresCampos({}); // Si todo está bien, limpiamos errores
    setGuardando(true);
  
    const datosFinales = {
      ...formData
    };
  
    console.log("Datos a enviar:", datosFinales); // Solo para pruebas
    onSubmit(datosFinales);
  };
  

  const renderSeccion = (tituloSeccion, icono, camposSeccion) => (
    <View style={styles.seccionContainer} key={tituloSeccion}>
      <View style={styles.tituloSeccion}>
        <Text style={styles.seccionIcono}>{icono}</Text>
        <Text style={styles.seccionTexto}>{tituloSeccion}</Text>
      </View>
      <View style={styles.card}>
        {camposSeccion.map((campo) => {

        //Para los campos de fecha de nacimiento
        if (campo.type === "fechaCustom") {
          return (
            <View key={campo.name} style={{ marginBottom: 15 }}>
              <Text style={styles.label}>Fecha de Nacimiento:</Text>

              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                {/* Día */}
                <TextInput
                  style={[styles.input, { width: '30%' }]}
                  placeholder="Día"
                  keyboardType="numeric"
                  maxLength={2}
                  onChangeText={(text) => handleChange('diaNacimiento', text)}
                  value={formData.diaNacimiento || ""}
                />

                {/* Mes */}
                <View style={{ width: '30%', position: 'relative' }}>
                  <RNPickerSelect
                    onValueChange={(value) => handleChange('mesNacimiento', value)}
                    placeholder={{ label: 'Mes', value: '' }}
                    items={[
                      { label: 'Enero', value: 'Enero' },
                      { label: 'Febrero', value: 'Febrero' },
                      { label: 'Marzo', value: 'Marzo' },
                      { label: 'Abril', value: 'Abril' },
                      { label: 'Mayo', value: 'Mayo' },
                      { label: 'Junio', value: 'Junio' },
                      { label: 'Julio', value: 'Julio' },
                      { label: 'Agosto', value: 'Agosto' },
                      { label: 'Septiembre', value: 'Septiembre' },
                      { label: 'Octubre', value: 'Octubre' },
                      { label: 'Noviembre', value: 'Noviembre' },
                      { label: 'Diciembre', value: 'Diciembre' },
                    ]}
                    value={formData.mesNacimiento || ""}
                    style={{
                      inputIOS: {
                        height: 50,
                        borderColor: '#00AF00',
                        borderWidth: 1,
                        borderRadius: 8,
                        paddingHorizontal: 10,
                        width: '100%',
                        justifyContent: 'center',
                        textAlign: 'center',
                        paddingRight: 25, // espacio para la flecha
                      },
                      inputAndroid: {
                        height: 50,
                        borderColor: '#00AF00',
                        borderWidth: 1,
                        borderRadius: 8,
                        paddingHorizontal: 10,
                        width: '100%',
                        justifyContent: 'center',
                        textAlign: 'center',
                        paddingRight: 25, // espacio para la flecha
                      },
                      iconContainer: {
                        top: 18,
                        right: 10,
                        position: 'absolute',
                      },
                    }}
                    useNativeAndroidPickerStyle={false}
                    Icon={() => <Icon name="chevron-down-outline" size={20} color="#00AF00" />}
                  />
                </View>



                {/* Año */}
                <TextInput
                  style={[styles.input, { width: '30%' }]}
                  placeholder="Año"
                  keyboardType="numeric"
                  maxLength={4}
                  onChangeText={(text) => handleChange('anioNacimiento', text)}
                  value={formData.anioNacimiento || ""}
                />
              </View>
            </View>
          );
        }

        //Para mostrar los campos de contraseña, repetir contraseña
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
              <View
                key={campo.name}
                style={[
                  styles.inputPasswordContainer,
                  erroresCampos[campo.name] && {
                    borderColor: "red",
                    borderWidth: 1,
                    borderRadius: 10,
                  },
                ]}
              >
                <TextInput
                  style={styles.inputPassword}
                  placeholder={campo.placeholder}
                  onChangeText={(text) => {
                    handleChange(campo.name, text);
                    setErroresCampos((prev) => ({
                      ...prev,
                      [campo.name]: false,
                    }));
                  }}
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
          //Para la personalización de los departamentos - consumo de API
          if (campo.name === "departamento") {
            return (
              <View
                key={campo.name}
                style={[
                  styles.pickerContainer,
                  erroresCampos[campo.name] && {
                    borderColor: "red",
                    borderWidth: 1,
                    borderRadius: 10,
                  },
                ]}
              >
                <Text style={styles.label}>
                  Selecciona tu departamento de residencia:
                </Text>
                {loadingDepartamentos ? (
                  <ActivityIndicator size="large" color="#00AF00" />
                ) : (
                  <Picker
                    selectedValue={formData[campo.name] || ""}
                    onValueChange={(value) => {
                      handleDepartamentoChange(value);
                      setErroresCampos((prev) => ({
                        ...prev,
                        [campo.name]: false,
                      }));
                    }}
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
          //Para personalización de municipios - consumo de API
          if (campo.name === "municipio") {
            return (
              <View
                key={campo.name}
                style={[
                  styles.pickerContainer,
                  erroresCampos[campo.name] && {
                    borderColor: "red",
                    borderWidth: 1,
                    borderRadius: 10,
                  },
                ]}
              >
                <Text style={styles.label}>
                  Selecciona tu municipio de residencia:
                </Text>
                {loadingMunicipios ? (
                  <ActivityIndicator size="large" color="#00AF00" />
                ) : (
                  <Picker
                    selectedValue={formData[campo.name] || ""}
                    onValueChange={(value) => {
                      handleChange(campo.name, value);
                      setErroresCampos((prev) => ({
                        ...prev,
                        [campo.name]: false,
                      }));
                    }}
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
          //Para los campos que son PICKER-SELECT
          if (campo.type === "picker") {
            return (
              <View
                key={campo.name}
                style={[
                  styles.pickerContainer,
                  erroresCampos[campo.name] && {
                    borderColor: "red",
                    borderWidth: 1,
                    borderRadius: 10,
                  },
                ]}
              >
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
                  onValueChange={(value) => {
                    handleChange(campo.name, value);
                    setErroresCampos((prev) => ({
                      ...prev,
                      [campo.name]: false,
                    }));
                  }}
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
              style={[
                styles.input,
                erroresCampos[campo.name] && { borderColor: "red" },
              ]}
              placeholder={campo.placeholder}
              onChangeText={(text) => {
                handleChange(campo.name, text);
                setErroresCampos((prev) => ({ ...prev, [campo.name]: false }));
              }}
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
      "fechaNacimiento",
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
