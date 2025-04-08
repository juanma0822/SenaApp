// components/forms/camposGenerales.js

export const camposGenerales = [
  { name: "nombres", placeholder: "Nombres" },
  { name: "apellidos", placeholder: "Apellidos" },
  {
    name: "correoPersonal",
    placeholder: "Correo personal",
    keyboardType: "email-address",
  },
  {
    name: "correoInstitucional",
    placeholder: "Correo institucional",
    keyboardType: "email-address",
  },
  { name: "contrasena", placeholder: "Contraseña", secureTextEntry: true },
  {
    name: "repetirContrasena",
    placeholder: "Repetir contraseña",
    secureTextEntry: true,
  },
  {
    name: "tipoDocumento",
    type: "picker",
    placeholder: "Tipo de documento",
    options: ["T.I.", "C.C.", "C.E."],
  },
  {
    name: "numeroDocumento",
    placeholder: "Número de documento",
    keyboardType: "numeric",
  },
  { name: "lugarExpedicion", placeholder: "Lugar de expedición" },
  {
    name: "genero",
    type: "picker",
    placeholder: "Género",
    options: ["Femenino", "Masculino", "Otro"],
  },
  { name: "edad", placeholder: "Edad", keyboardType: "numeric" },
  {
    name: "departamento",
    type: "picker",
    placeholder: "Departamento",
    options: [],
  }, // API después
  { name: "municipio", type: "picker", placeholder: "Municipio", options: [] }, // API después
  { name: "direccion", placeholder: "Dirección" },
  { name: "celular", placeholder: "Celular", keyboardType: "numeric" },
  {
    name: "telefonoFijo",
    placeholder: "Teléfono fijo (opcional)",
    keyboardType: "numeric",
  },
];
