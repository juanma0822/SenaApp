// Importaciones básicas de React y React Native
import React, { useState } from "react";
import { Alert, Text } from "react-native";

// Importaciones para navegación y manejo de estado
import { useNavigation } from '@react-navigation/native';

// Importaciones para comunicación con el backend
import axios from "axios";
import Constants from 'expo-constants';

// Importaciones de componentes locales
import RegistroForm from "../../components/RegistroForm"; // Formulario dinámico reutilizable
import WaveBackground from "../../components/WaveBackground"; // Fondo con ondas decorativas
import SplashScreen from "../SplashScreen"; // Pantalla de carga
import { camposGenerales } from "../../components/forms/camposGenerales"; // Campos comunes a todos los usuarios

/**
 * Componente RegistroFuncionario - Pantalla de registro específica para funcionarios del SENA
 * Extiende los campos generales con información específica del cargo y área de trabajo
 * 
 * Funcionalidades principales:
 * - Formulario de registro con validaciones
 * - Envío de datos al backend
 * - Manejo de estados de carga y errores
 * - Redirección automática después del registro exitoso
 * 
 * @returns {JSX.Element} Pantalla completa de registro para funcionarios
 */
export default function RegistroFuncionario() {
  // Hook de navegación para redirecciones
  const navigation = useNavigation();

  /**
   * Definición de campos específicos para funcionarios
   * Estos campos se combinan con los campos generales del usuario
   */
  const camposFuncionario = [
    {
      name: "cargo",
      placeholder: "Cargo asignado", // Ej: Coordinador, Instructor, Administrativo
    },
    {
      name: "area",
      placeholder: "Área de trabajo", // Ej: Académica, Administrativa, Bienestar
    },
    {
      name: "tipo_funcionario",
      type: "picker", // Campo de selección
      placeholder: "Tipo de funcionario",
      options: ["Contratista", "Planta"], // Dos tipos de vinculación laboral en el SENA
    },
  ];

  // Estados principales del componente
  const [loading, setLoading] = useState(false); // Control de estado de carga durante el registro
  const [errorMessage, setErrorMessage] = useState(""); // Almacena mensajes de error para mostrar al usuario

  /**
   * Función principal para manejar el registro de funcionarios
   * Procesa los datos del formulario y los envía al backend
   * 
   * @param {Object} data - Objeto con todos los datos del formulario
   * @param {string} data.numeroDocumento - Número de documento de identidad
   * @param {string} data.nombres - Nombres completos
   * @param {string} data.apellidos - Apellidos completos
   * @param {string} data.correoPersonal - Correo electrónico personal
   * @param {string} data.correoInstitucional - Correo institucional del SENA
   * @param {string} data.contrasena - Contraseña del usuario
   * @param {string} data.cargo - Cargo asignado en la institución
   * @param {string} data.area - Área de trabajo
   * @param {string} data.tipo_funcionario - Tipo de vinculación (Contratista/Planta)
   * @param {string} data.tipoDocumento - Tipo de documento (CC, CE, etc.)
   * @param {string} data.fechaNacimiento - Fecha de nacimiento
   * @param {string} data.departamento - Departamento de residencia
   * @param {string} data.municipio - Municipio de residencia
   * @param {string} data.direccion - Dirección de residencia
   * @param {string} data.celular - Número de teléfono celular
   * @param {string} data.telefonoFijo - Número de teléfono fijo (opcional)
   */
  const handleRegistro = async (data) => {
    // Iniciar estado de carga
    setLoading(true);

    // Obtener la URL del backend desde las variables de configuración
    const backendUrl = Constants.expoConfig.extra.REACT_APP_BACKEND_URL;

    /**
     * Construcción del payload para enviar al backend
     * Se mapean los nombres de campos del frontend a los esperados por la API
     * 
     * Nota: La API espera nombres en formato snake_case (ej: numero_documento)
     * mientras que el frontend usa camelCase (ej: numeroDocumento)
     */
    const payload = {
      // Información básica del usuario
      numero_documento: data.numeroDocumento,
      nombres: data.nombres,
      apellidos: data.apellidos,
      correo_personal: data.correoPersonal,
      correo_institucional: data.correoInstitucional,
      contrasena: data.contrasena,
      
      // Información personal y demográfica
      tipo_documento: data.tipoDocumento,
      lugar_expedicion: data.lugarExpedicion,
      genero: data.genero,
      edad: data.edad,
      fecha_nacimiento: data.fechaNacimiento,
      
      // Información de ubicación
      departamento: data.departamento,
      municipio: data.municipio,
      direccion: data.direccion,
      
      // Información de contacto
      celular: data.celular,
      telefono_fijo: data.telefonoFijo || null, // Campo opcional
      
      // Información específica del funcionario
      cargo: data.cargo, // Cargo asignado en la institución
      area_trabajo: data.area, // Área de trabajo (se mapea a area_trabajo en el backend)
      tipo_funcionario: data.tipo_funcionario, // Tipo de vinculación laboral
    };

    try {
      // Enviar datos al backend mediante petición POST
      const response = await axios.post(`${backendUrl}/api/funcionarios`, payload);
      
      // Log de la respuesta para debugging (se puede remover en producción)
      console.log("Respuesta del backend: ", response.data);
      
      // Finalizar estado de carga
      setLoading(false);
      
      // Mostrar mensaje de éxito y redirigir al login
      Alert.alert(
        "✅ Usuario creado exitosamente", 
        "Ya puedes ingresar a la aplicación",
        [{ 
          text: "OK", 
          onPress: () => navigation.navigate("Login") // Redirigir al login después del registro
        }]
      );
      
    } catch (error) {
      // Manejo de errores durante el registro
      console.error("Error en el registro:", error);
      
      // Determinar el mensaje de error apropiado
      let mensajeError = "Error desconocido";
      
      if (error.response) {
        // Error del servidor (código de estado 4xx o 5xx)
        const status = error.response.status;
        const data = error.response.data;
        
        if (status === 400) {
          mensajeError = data.message || "Datos inválidos. Verifica la información ingresada.";
        } else if (status === 409) {
          mensajeError = "El número de documento o correo ya están registrados.";
        } else if (status === 500) {
          mensajeError = "Error interno del servidor. Inténtalo más tarde.";
        } else {
          mensajeError = `Error del servidor: ${status}`;
        }
      } else if (error.request) {
        // Error de red (sin respuesta del servidor)
        mensajeError = "Error de conexión. Verifica tu conexión a internet.";
      } else {
        // Error en la configuración de la petición
        mensajeError = "Error al procesar la solicitud.";
      }
      
      // Establecer mensaje de error y finalizar carga
      setErrorMessage("Error al registrar funcionario: " + mensajeError);
      setLoading(false);
      
      // Mostrar alerta de error al usuario
      Alert.alert(
        "Error en el registro",
        mensajeError,
        [{ text: "OK" }]
      );
    }
  };

  // Renderizado del componente
  return (
    <>
      {/* Renderizado condicional: mostrar splash screen durante la carga */}
      {loading ? (
        <SplashScreen message="Registrando funcionario..." />
      ) : (
        <>
          {/* Formulario principal de registro */}
          <RegistroForm
            campos={[...camposGenerales, ...camposFuncionario]} // Combinar campos generales con específicos
            onSubmit={handleRegistro} // Función que se ejecuta al enviar el formulario
            botonText="Registrar Funcionario" // Texto del botón de envío
          />
          
          {/* Mostrar mensaje de error si existe */}
          {errorMessage && (
            <Text style={{ 
              color: "red", 
              textAlign: "center", 
              margin: 10,
              backgroundColor: "#ffebee",
              padding: 10,
              borderRadius: 5
            }}>
              {errorMessage}
            </Text>
          )}
        </>
      )}
      
      {/* Fondo decorativo con ondas */}
      <WaveBackground />
      
      {/* Pie de página con copyright */}
      <Text style={{ 
        textAlign: "center", 
        marginTop: 20, 
        color: "#00AF00",
        fontSize: 12,
        fontWeight: "500"
      }}>
        © 2025 SENA. Todos los derechos reservados.
      </Text>
    </>
  );
}
