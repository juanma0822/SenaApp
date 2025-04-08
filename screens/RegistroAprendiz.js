import React from "react";
import RegistroForm from "../components/RegistroForm";
import WaveBackground from '../components/WaveBackground';
import {Text} from 'react-native';
import { camposGenerales } from "../components/forms/camposGenerales";

export default function RegistroAprendiz() {
  const camposAprendiz = [
    { name: "programa", placeholder: "Programa formacion" },
    { name: "ficha", placeholder: "Número de ficha" },
  ];

  const handleRegistro = (data) => {
    console.log("Datos aprendiz:", data);
    // Aquí llamás a la API o hacés lo que necesites
  };

  return (
    <>
        <RegistroForm
        titulo="Registro Aprendiz"
        campos={[...camposGenerales, ...camposAprendiz]}
        onSubmit={handleRegistro}
        botonText="Registrar Aprendiz"
        />
        <WaveBackground />
        <Text style={{ textAlign: 'center', marginTop: 20, color: '#00AF00' }}>
          © 2025 Sena. Todos los derechos reservados.
        </Text>
    </>
  );
}
