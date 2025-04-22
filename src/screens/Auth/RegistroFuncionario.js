import React, { useState } from "react";
import RegistroForm from "../../components/RegistroForm";
import WaveBackground from "../../components/WaveBackground";
import { Alert, Text } from "react-native";
import { camposGenerales } from "../../components/forms/camposGenerales";
import axios from "axios";
import SplashScreen from "../SplashScreen";
import { useNavigation } from '@react-navigation/native';
import Constants from 'expo-constants';

export default function RegistroFuncionario() {
  const navigation = useNavigation();

  const camposFuncionario = [
    { name: "cargo", placeholder: "Cargo asignado" },
    { name: "area", placeholder: "Área de trabajo" },
    {
      name: "tipo_funcionario",
      type: "picker",
      placeholder: "Tipo de funcionario",
      options: ["Contratista", "Planta"],
    },
  ];

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleRegistro = async (data) => {
    setLoading(true);

    const backendUrl = Constants.expoConfig.extra.REACT_APP_BACKEND_URL;

    // Payload ajustado para enviar los datos de acuerdo con la API y el controller
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
      cargo: data.cargo,  // Cargo asignado
      area_trabajo: data.area,  // Área de trabajo
      tipo_funcionario: data.tipo_funcionario,  // Tipo de funcionario (Contratista / Planta)
    };

    try {
      const response = await axios.post(`${backendUrl}/api/funcionarios`, payload);
      console.log("Respuesta del backend: ", response.data);
      setLoading(false);
      Alert.alert(
              "✅ Usuario creado exitosamente", 
              "Ya puedes ingresar a la aplicación",
              [{ text: "OK", onPress: () => navigation.navigate("Login") }]
      );
    } catch (error) {
      setErrorMessage("Error al registrar funcionario: " + error.message);
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
            campos={[...camposGenerales, ...camposFuncionario]}
            onSubmit={handleRegistro}
            botonText="Registrar Funcionario"
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
