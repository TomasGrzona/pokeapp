// Funciones auxiliares compartidas por las vistas.

export const TIPOS = [
  "Normal", "Fuego", "Agua", "Planta", "Eléctrico", "Hielo", "Lucha", "Veneno",
  "Tierra", "Volador", "Psíquico", "Bicho", "Roca", "Fantasma", "Dragón",
  "Siniestro", "Acero", "Hada",
];

export const RAREZAS = ["Común", "Poco común", "Raro", "Épico", "Legendario"];

const COLORES_TIPO = {
  normal: "#a8a878", fuego: "#f08030", agua: "#6890f0", planta: "#78c850",
  electrico: "#f8d030", hielo: "#98d8d8", lucha: "#c03028", veneno: "#a040a0",
  tierra: "#e0c068", volador: "#a890f0", psiquico: "#f85888", bicho: "#a8b820",
  roca: "#b8a038", fantasma: "#705898", dragon: "#7038f8", siniestro: "#705848",
  acero: "#b8b8d0", hada: "#ee99ac",
};

// Imagen de reemplazo (una pokébola) cuando una imagen no carga.
export const IMAGEN_RESPALDO =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="#fff" stroke="#333" stroke-width="5"/><path d="M4 50a46 46 0 0 1 92 0z" fill="#e3350d" stroke="#333" stroke-width="5"/><path d="M4 50h92" stroke="#333" stroke-width="5"/><circle cx="50" cy="50" r="12" fill="#fff" stroke="#333" stroke-width="5"/></svg>'
  );

export function escapar(texto) {
  return String(texto)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function normalizar(texto) {
  return String(texto)
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

export function colorDeTipo(tipo) {
  return COLORES_TIPO[normalizar(tipo)] || "#777";
}

export function chipsDeTipo(tipos) {
  return tipos
    .map(
      (t) =>
        `<span class="chip-tipo" style="background:${colorDeTipo(t)}">${escapar(t)}</span>`
    )
    .join("");
}

export function numeroPokedex(id) {
  return "#" + String(id).padStart(3, "0");
}

export function claseRareza(rareza) {
  return "rareza-" + normalizar(rareza).replace(/\s+/g, "-");
}

// Si alguna imagen falla al cargar, se reemplaza por la pokébola.
export function activarImagenRespaldo(contenedor) {
  contenedor.addEventListener(
    "error",
    (evento) => {
      const img = evento.target;
      if (img.tagName === "IMG" && img.src !== IMAGEN_RESPALDO) {
        img.src = IMAGEN_RESPALDO;
      }
    },
    true
  );
}

export function leerArchivoComoDataURL(archivo) {
  return new Promise((resolve, reject) => {
    const lector = new FileReader();
    lector.addEventListener("load", () => resolve(lector.result));
    lector.addEventListener("error", () => reject(lector.error));
    lector.readAsDataURL(archivo);
  });
}

export function tarjetaPokemon(p) {
  return `
    <article class="tarjeta" data-id="${p.id}">
      <span class="tarjeta-numero">${numeroPokedex(p.id)}</span>
      <div class="tarjeta-imagen">
        <img src="${escapar(p.imagen)}" alt="${escapar(p.nombre)}" loading="lazy">
      </div>
      <h3>${escapar(p.nombre)}</h3>
      <div class="chips">${chipsDeTipo(p.tipo)}</div>
      <span class="rareza ${claseRareza(p.rareza)}">${escapar(p.rareza)}</span>
      <button class="btn btn-secundario" data-accion="detalle" data-id="${p.id}">Ver detalle</button>
    </article>`;
}
