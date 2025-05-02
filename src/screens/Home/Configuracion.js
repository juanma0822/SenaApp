import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Constants from "expo-constants";
import DatoUsuario from "../../components/forms/DatoUsuario"; // Asegúrate de que la ruta sea correcta

const { height } = Dimensions.get("window"); // Obtener el alto de la pantalla
const TAB_BAR_HEIGHT = 90; // Altura de la barra de navegación

export default function ConfiguracionScreen({ navigation }) {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false); // Controlar si los campos son editables
  const [password, setPassword] = useState(""); // Campo para la nueva contraseña
  const [isSaving, setIsSaving] = useState(false); // Controlar el estado de guardado

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const baseUrl = Constants.expoConfig.extra.REACT_APP_BACKEND_URL;
      const response = await axios.get(`${baseUrl}/api/usuarios/info`, {
        headers,
      });

      setUserInfo(response.data); // Guardar la información del usuario
    } catch (error) {
      console.error("Error al obtener la información del usuario:", error);
    } finally {
      setLoading(false); // Ocultar el indicador de carga
    }
  };

  //Editar PERFIL
  const toggleEdit = () => {
    setIsEditing(!isEditing); // Alternar entre modo edición y vista
  };

  const saveChanges = async () => {
    setIsSaving(true); // Mostrar indicador de guardado
    try {
      const token = await AsyncStorage.getItem("token");
      console.log(token);
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };
  
      const baseUrl = Constants.expoConfig.extra.REACT_APP_BACKEND_URL;
  
      // Construir el cuerpo de la solicitud con los datos editados
      const payload = {
        nombres: userInfo.nombres,
        apellidos: userInfo.apellidos,
        correo_personal: userInfo.correo_personal,
        correo_institucional: userInfo.correo_institucional, // Agregado
        contrasena: password || "", // Solo enviar si se cambió
        fecha_nacimiento: userInfo.fecha_nacimiento, // Agregado
        tipo_documento: userInfo.tipo_documento,
        lugar_expedicion: userInfo.lugar_expedicion,
        genero: userInfo.genero,
        edad: userInfo.edad,
        departamento: userInfo.departamento,
        municipio: userInfo.municipio,
        direccion: userInfo.direccion,
        celular: userInfo.celular,
        telefono_fijo: userInfo.telefono_fijo,
        ...(userInfo.rol === "aprendiz" && {
          programa_formacion: userInfo.programa_formacion,
          numero_ficha: userInfo.numero_ficha,
          nivelSisben: userInfo.nivelsisben, // Corregido a camelCase
          grupoSisben: userInfo.gruposisben, // Corregido a camelCase
        }),
        ...(userInfo.rol === "funcionario" && {
          cargo: userInfo.cargo,
          area_trabajo: userInfo.area_trabajo,
          tipo_funcionario: userInfo.tipo_funcionario,
        }),
      };
  
      console.log("Payload para guardar cambios:", payload); // Verificar el payload antes de enviar
  
      const response = await axios.put(`${baseUrl}/api/usuarios/info`, payload, {
        headers,
      });
  
      // Mostrar mensaje del backend
      Alert.alert("Éxito", response.data.message);
  
      // Actualizar la información del usuario con los datos devueltos
      setUserInfo(response.data.usuario);
      setIsEditing(false); // Salir del modo edición
    } catch (error) {
      console.error("Error al guardar los cambios:", error);
      Alert.alert(
        "Error",
        "No se pudieron guardar los cambios. ¿Qué deseas hacer?",
        [
          {
            text: "Reintentar",
            onPress: saveChanges, // Reintentar guardar los cambios
          },
          {
            text: "Salir de editar",
            onPress: () => setIsEditing(false), // Salir del modo edición
            style: "cancel",
          },
        ]
      );
    } finally {
      setIsSaving(false); // Ocultar indicador de guardado
    }
  };

  const handleDeactivateAccount = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const baseUrl = Constants.expoConfig.extra.REACT_APP_BACKEND_URL;
      await axios.delete(`${baseUrl}/api/usuarios`, { headers });

      // Eliminar el token del AsyncStorage
      await AsyncStorage.removeItem("token");

      // Redirigir al login
      navigation.replace("Login");
    } catch (error) {
      console.error("Error al desactivar la cuenta:", error);
      Alert.alert("Error", "No se pudo desactivar la cuenta. Inténtalo de nuevo.");
    }
  };

  const confirmDeactivateAccount = () => {
    Alert.alert(
      "Confirmación",
      "¿Estás seguro de que deseas desactivar tu cuenta?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Sí, desactivar",
          onPress: handleDeactivateAccount,
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00AF00" />
        <Text style={styles.loadingText}>Cargando información...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.background}>
        <View style={styles.card}>
          <Text style={styles.title}>Información del Usuario</Text>
          <ScrollView style={styles.scrollContainer}>
            {userInfo ? (
              <>
                {/* Información general */}
                <Text style={styles.sectionTitle}>Información General</Text>
                <DatoUsuario
                  label="Nombre"
                  value={userInfo.nombres}
                  editable={isEditing}
                  onChangeText={(text) =>
                    setUserInfo({ ...userInfo, nombres: text })
                  }
                />
                <DatoUsuario
                  label="Apellidos"
                  value={userInfo.apellidos}
                  editable={isEditing}
                  onChangeText={(text) =>
                    setUserInfo({ ...userInfo, apellidos: text })
                  }
                />
                <DatoUsuario
                  label="Tipo de Documento"
                  value={userInfo.tipo_documento}
                  editable={false}
                />
                <DatoUsuario
                  label="Número de Documento"
                  value={userInfo.numero_documento}
                  editable={false}
                />
                <DatoUsuario
                  label="Correo Personal"
                  value={userInfo.correo_personal}
                  editable={isEditing}
                  onChangeText={(text) =>
                    setUserInfo({ ...userInfo, correo_personal: text })
                  }
                />
                <DatoUsuario
                  label="Correo Institucional"
                  value={userInfo.correo_institucional}
                  editable={false}
                />
                <DatoUsuario
                  label="Nueva Contraseña"
                  value={password}
                  editable={isEditing}
                  onChangeText={setPassword}
                  secureTextEntry={true} // Campo de tipo contraseña
                />
                <DatoUsuario label="Género" value={userInfo.genero} editable={false} />
                <DatoUsuario label="Edad" value={`${userInfo.edad} años`} editable={false} />
                <DatoUsuario
                  label="Fecha de Nacimiento"
                  value={new Date(userInfo.fecha_nacimiento).toLocaleDateString()}
                  editable={false}
                />
                <DatoUsuario label="Dirección:" value={userInfo.direccion} editable={false} />
                <DatoUsuario label="Municipio" value={userInfo.municipio} editable={false} />
                <DatoUsuario
                  label="Departamento"
                  value={userInfo.departamento}
                  editable={false}
                />
                <DatoUsuario label="Celular" value={userInfo.celular} editable={false} />
                <DatoUsuario
                  label="Teléfono Fijo"
                  value={userInfo.telefono_fijo || "N/A"}
                  editable={false}
                />

                {/* Información específica del aprendiz */}
                {userInfo.rol === "aprendiz" && (
                  <>
                    <Text style={styles.sectionTitle}>
                      Información del Aprendiz
                    </Text>
                    <DatoUsuario
                      label="Programa de Formación"
                      value={userInfo.programa_formacion}
                      editable={isEditing}
                      onChangeText={(text) =>
                        setUserInfo({
                          ...userInfo,
                          programa_formacion: text,
                        })
                      }
                    />
                    <DatoUsuario
                      label="Número de Ficha"
                      value={userInfo.numero_ficha}
                      editable={isEditing}
                      onChangeText={(text) =>
                        setUserInfo({ ...userInfo, numero_ficha: text })
                      }
                    />
                    <DatoUsuario
                      label="Nivel SISBEN"
                      value={userInfo.nivelsisben}
                      editable={false}
                    />
                    <DatoUsuario
                      label="Grupo SISBEN"
                      value={userInfo.gruposisben?.toString() || ""}
                      editable={false}
                    />
                  </>
                )}

                {/* Información específica del funcionario */}
                {userInfo.rol === "funcionario" && (
                  <>
                    <Text style={styles.sectionTitle}>
                      Información del Funcionario
                    </Text>
                    <DatoUsuario
                      label="Cargo"
                      value={userInfo.cargo}
                      editable={isEditing}
                      onChangeText={(text) =>
                        setUserInfo({ ...userInfo, cargo: text })
                      }
                    />
                    <DatoUsuario
                      label="Área de Trabajo"
                      value={userInfo.area_trabajo}
                      editable={isEditing}
                      onChangeText={(text) =>
                        setUserInfo({ ...userInfo, area_trabajo: text })
                      }
                    />
                    <DatoUsuario
                      label="Tipo de Funcionario"
                      value={userInfo.tipo_funcionario}
                      editable={false}
                    />
                  </>
                )}

                {/* Botones */}
                <View style={styles.buttonsContainer}>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={isEditing ? saveChanges : toggleEdit}
                  >
                    {isSaving ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <Text style={styles.buttonText}>
                        {isEditing ? "Guardar Cambios" : "Editar Perfil Usuario"}
                      </Text>
                    )}
                  </TouchableOpacity>
                  {!isEditing && (
                    <TouchableOpacity
                      style={styles.deactivateButton}
                      onPress={confirmDeactivateAccount}
                    >
                      <Text style={styles.buttonText}>Desactivar Cuenta</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </>
            ) : (
              <Text style={styles.noDataText}>
                No se pudo cargar la información del usuario.
              </Text>
            )}
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#00AF00", // Fondo verde institucional
  },
  background: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center", // Centrar el card en el espacio disponible
    padding: 20,
    paddingBottom: TAB_BAR_HEIGHT, // Ajustar el espacio para la barra de navegación
  },
  card: {
    width: "100%",
    maxWidth: 500,
    height: height - TAB_BAR_HEIGHT - 85, // Altura dinámica restando la barra de navegación y un margen adicional
    backgroundColor: "#FFFFFF", // Fondo blanco para el card
    borderRadius: 20, // Bordes redondeados
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5, // Sombra para Android
    borderWidth: 4, // Grosor del borde
    borderColor: "#008000", // Color del borde
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#00AF00", // Verde institucional
    marginBottom: 20,
    textAlign: "center", // Centrar el texto del título
  },
  scrollContainer: {
    flex: 1,
    width: "100%",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#00AF00",
    marginTop: 20,
    marginBottom: 15,
    textAlign: "center", // Centrar el texto del título de la sección
  },
  buttonsContainer: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  editButton: {
    flex: 1,
    backgroundColor: "#00AF00",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    alignContent: "center",
    marginRight: 10,
  },
  deactivateButton: {
    flex: 1,
    backgroundColor: "#FF5C5C",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginLeft: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center", // Centrar el texto dentro del botón
  },
  noDataText: {
    fontSize: 16,
    color: "#555",
    textAlign: "center", // Centrar el texto del mensaje de error
    marginTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00AF00",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#FFFFFF",
    textAlign: "center", // Centrar el texto del indicador de carga
  },
});
