// Navegación entre vistas con JavaScript (sin recargar la página).
// Cada vista es una función render(contenedor, parametros) registrada por nombre.

const vistas = {};
let vistaActual = { nombre: null, parametros: {} };
let alCambiar = () => {};

export function registrarVista(nombre, funcionRender) {
  vistas[nombre] = funcionRender;
}

export function alCambiarVista(callback) {
  alCambiar = callback;
}

export function vistaActiva() {
  return vistaActual.nombre;
}

export function navegar(nombre, parametros = {}) {
  const render = vistas[nombre];
  if (!render) {
    console.error(`La vista "${nombre}" no existe`);
    return;
  }

  const contenedor = document.getElementById("app");
  contenedor.innerHTML = "";
  vistaActual = { nombre, parametros };
  render(contenedor, parametros);
  window.scrollTo(0, 0);
  alCambiar(nombre);
}
