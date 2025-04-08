import React from "react";
import RegistroForm from "../components/RegistroForm";
import WaveBackground from "../components/WaveBackground";
import { Text } from "react-native";
import { camposGenerales } from "../components/forms/camposGenerales";

export default function RegistroFuncionario() {
  const camposFuncionario = [
    { name: "cargo", placeholder: "Cargo" },
    { name: "area", placeholder: "Area" },
  ];

  const handleRegistro = (data) => {
    console.log("Datos funcionario:", data);
    // Aquí llamás a la API o guardás en la DB
  };

  return (
    <>
      <RegistroForm
        titulo="Registro Funcionario"
        campos={[...camposGenerales, ...camposFuncionario]}
        onSubmit={handleRegistro}
        botonText="Registrar Funcionario"
      />
      <WaveBackground />
      <Text style={{ textAlign: "center", marginTop: 20, color: "#00AF00" }}>
        © 2025 Sena. Todos los derechos reservados.
      </Text>
    </>
  );
}
