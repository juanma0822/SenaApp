import React, { useState } from "react";
import RegistroForm from "../../components/RegistroForm";
import WaveBackground from "../../components/WaveBackground";
import { Text, Alert } from "react-native";
import { camposGenerales } from "../../components/forms/camposGenerales";
import axios from "axios";
import SplashScreen from "../SplashScreen";
import { useNavigation } from '@react-navigation/native';
import Constants from 'expo-constants';

export default function RegistroAprendiz() {
  const navigation = useNavigation();
  const camposAprendiz = [
    { name: "programa", placeholder: "Programa formación" },
    { name: "ficha", placeholder: "Número de ficha" },
    {
      name: "nivelSisben",
      type: "picker",
      placeholder: "Nivel SISBEN",
      options: ["A", "B", "C", "D"],
    },
    {
      name: "grupoSisben",
      type: "picker",
      placeholder: "Grupo SISBEN",
      options: Array.from({ length: 10 }, (_, i) => `${i + 1}`),
    },
  ];

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleRegistro = async (data) => {
    setLoading(true);

    const backendUrl = Constants.expoConfig.extra.REACT_APP_BACKEND_URL;
  
    // Asegúrate de que todos los campos estén en el formato correcto que el backend espera
    const payload = {
      numero_documento: data.numeroDocumento,
      nombres: data.nombres,
      apellidos: data.apellidos,
      correo_personal: data.correoPersonal,
      correo_institucional: data.correoInstitucional,
      contrasena: data.contrasena,
      tipo_documento: data.tipoDocumento,
      lugar_expedicion: data.lugarExpedicion,
      genero: data.genero,
      edad: data.edad,
      departamento: data.departamento,
      municipio: data.municipio,
      direccion: data.direccion,
      celular: data.celular,
      telefono_fijo: data.telefonoFijo,
      fecha_nacimiento: data.fechaNacimiento,
      programa_formacion: data.programa,
      numero_ficha: data.ficha,
      nivelSisben: data.nivelSisben,
      grupoSisben: data.grupoSisben,
    };
  
    try {
      const response = await axios.post(`${backendUrl}/api/aprendices`, payload);
      console.log("Respuesta del backend: ", response.data);
      setLoading(false);
      Alert.alert(
        "✅ Usuario creado exitosamente", 
        "Ya puedes ingresar a la aplicación",
        [{ text: "OK", onPress: () => navigation.navigate("Login") }]
      );
    } catch (error) {
      Alert.alert(
        "Error",
        "Error al registrar aprendiz: " + error.message,
        [{ text: "OK" }]
      )
      setErrorMessage("Error al registrar aprendiz: " + error.message);
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <SplashScreen message="Cargando..." />
      ) : (
        <>
          <RegistroForm
            titulo="Registro Aprendiz"
            campos={[...camposGenerales, ...camposAprendiz]}
            onSubmit={handleRegistro}
            botonText="Registrar Aprendiz"
          />
          {errorMessage && <Text style={{ color: "red" }}>{errorMessage}</Text>}
        </>
      )}
      <WaveBackground />
      <Text style={{ textAlign: "center", marginTop: 20, color: "#00AF00" }}>
        © 2025 Sena. Todos los derechos reservados.
      </Text>
    </>
  );
}
