// Registro, inicio de sesión e identificación del usuario actual.
// Nota: las contraseñas se guardan en texto plano porque es un ejercicio
// sin servidor. En una app real nunca se haría así.

import {
  cargarUsuarios,
  guardarUsuarios,
  siguienteIdUsuario,
  obtenerIdSesion,
  guardarIdSesion,
  borrarSesion,
} from "./storage.js";

export function registrarUsuario({ nombre, email, username, password, avatar }) {
  nombre = nombre.trim();
  email = email.trim().toLowerCase();
  username = username.trim();

  if (!nombre || !email || !username || !password) {
    return { ok: false, error: "Completá todos los campos." };
  }
  if (password.length < 6) {
    return { ok: false, error: "La contraseña debe tener al menos 6 caracteres." };
  }

  const usuarios = cargarUsuarios();

  if (usuarios.some((u) => u.username.toLowerCase() === username.toLowerCase())) {
    return { ok: false, error: "Ese nombre de usuario ya está en uso." };
  }
  if (usuarios.some((u) => u.email.toLowerCase() === email)) {
    return { ok: false, error: "Ese email ya está registrado." };
  }

  const usuario = {
    id: siguienteIdUsuario(),
    nombre,
    email,
    username,
    password,
    avatar,
    admin: false, // los nuevos usuarios nunca son administradores
  };

  usuarios.push(usuario);
  guardarUsuarios(usuarios);
  return { ok: true, usuario };
}

export function iniciarSesion(username, password) {
  const usuario = cargarUsuarios().find(
    (u) =>
      u.username.toLowerCase() === username.trim().toLowerCase() &&
      u.password === password
  );

  if (!usuario) {
    return { ok: false, error: "Usuario o contraseña incorrectos." };
  }

  guardarIdSesion(usuario.id);
  return { ok: true, usuario };
}

export function cerrarSesion() {
  borrarSesion();
}

export function usuarioActual() {
  const id = obtenerIdSesion();
  if (id === null) return null;
  return cargarUsuarios().find((u) => u.id === id) || null;
}

export function esAdmin() {
  const usuario = usuarioActual();
  return Boolean(usuario && usuario.admin);
}
