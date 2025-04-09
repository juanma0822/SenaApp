import React from "react";
import RegistroForm from "../components/RegistroForm";
import WaveBackground from '../components/WaveBackground';
import {Text} from 'react-native';
import { camposGenerales } from "../components/forms/camposGenerales";

export default function RegistroAprendiz() {
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
