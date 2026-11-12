// Persistencia: todo el estado de la app se guarda como JSON en localStorage.

import { POKEMON_INICIALES } from "./data/pokemon.js";
import { USUARIOS_INICIALES } from "./data/usuarios.js";

const CLAVES = {
  pokemon: "pokeapp_pokemon",
  usuarios: "pokeapp_usuarios",
  sesion: "pokeapp_sesion",
};

function copiar(valor) {
  return JSON.parse(JSON.stringify(valor));
}

function leer(clave) {
  try {
    const texto = localStorage.getItem(clave);
    return texto === null ? null : JSON.parse(texto);
  } catch (error) {
    console.warn(`No se pudo leer "${clave}" de localStorage`, error);
    return null;
  }
}

function guardar(clave, valor) {
  localStorage.setItem(clave, JSON.stringify(valor));
}

// ---------- Pokémon ----------

export function cargarPokemon() {
  let lista = leer(CLAVES.pokemon);
  if (!Array.isArray(lista)) {
    lista = copiar(POKEMON_INICIALES);
    guardar(CLAVES.pokemon, lista);
  }
  return lista;
}

export function guardarPokemon(lista) {
  guardar(CLAVES.pokemon, lista);
}

export function agregarPokemon(pokemon) {
  const lista = cargarPokemon();
  lista.push(pokemon);
  guardarPokemon(lista);
  return lista;
}

export function buscarPokemonPorId(id) {
  return cargarPokemon().find((p) => p.id === Number(id)) || null;
}

export function buscarPokemonPorNombre(nombre) {
  const buscado = String(nombre).trim().toLowerCase();
  return cargarPokemon().find((p) => p.nombre.toLowerCase() === buscado) || null;
}

export function siguienteIdPokemon() {
  const ids = cargarPokemon().map((p) => p.id);
  return ids.length ? Math.max(...ids) + 1 : 1;
}

// ---------- Usuarios ----------

export function cargarUsuarios() {
  let lista = leer(CLAVES.usuarios);
  if (!Array.isArray(lista)) {
    lista = copiar(USUARIOS_INICIALES);
    guardar(CLAVES.usuarios, lista);
  }
  return lista;
}

export function guardarUsuarios(lista) {
  guardar(CLAVES.usuarios, lista);
}

export function siguienteIdUsuario() {
  const ids = cargarUsuarios().map((u) => u.id);
  return ids.length ? Math.max(...ids) + 1 : 1;
}

// ---------- Sesión ----------

export function obtenerIdSesion() {
  return leer(CLAVES.sesion);
}

export function guardarIdSesion(id) {
  guardar(CLAVES.sesion, id);
}

export function borrarSesion() {
  localStorage.removeItem(CLAVES.sesion);
}

// ---------- Utilidad para administración ----------

export function restablecerDatosIniciales() {
  localStorage.removeItem(CLAVES.pokemon);
  localStorage.removeItem(CLAVES.usuarios);
  localStorage.removeItem(CLAVES.sesion);
}
