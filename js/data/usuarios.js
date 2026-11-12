// Usuarios iniciales. Se cargan en localStorage la primera vez.
// Credenciales de prueba:
//   administrador -> usuario: admin   contraseña: admin123
//   usuario común -> usuario: ash     contraseña: pikachu123

export const USUARIOS_INICIALES = [
  {
    id: 1,
    nombre: "Administrador",
    email: "admin@pokeapp.com",
    username: "admin",
    password: "admin123",
    avatar: "./assets/avatar/1.svg",
    admin: true,
  },
  {
    id: 2,
    nombre: "Ash",
    email: "ash@pokeapp.com",
    username: "ash",
    password: "pikachu123",
    avatar: "./assets/avatar/2.svg",
    admin: false,
  },
];

export const AVATARES = [
  "./assets/avatar/1.svg",
  "./assets/avatar/2.svg",
  "./assets/avatar/3.svg",
  "./assets/avatar/4.svg",
];
