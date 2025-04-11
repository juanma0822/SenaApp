import React from "react";
import RegistroForm from "../../components/RegistroForm";
import WaveBackground from "../../components/WaveBackground";
import { Text } from "react-native";
import { camposGenerales } from "../../components/forms/camposGenerales";

export default function RegistroFuncionario() {
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

  const handleRegistro = (data) => {
    console.log("Datos funcionario:", data);
    // Aquí llamás a la API o guardás en la DB
  };

  return (
    <>
      <RegistroForm
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
