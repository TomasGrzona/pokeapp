import { navegar } from "../router.js";
import { buscarPokemonPorId, buscarPokemonPorNombre } from "../storage.js";
import {
  escapar,
  chipsDeTipo,
  numeroPokedex,
  claseRareza,
  activarImagenRespaldo,
} from "../utils.js";

const ESTADISTICAS = [
  ["HP", "hp"],
  ["Ataque", "ataque"],
  ["Defensa", "defensa"],
  ["Velocidad", "velocidad"],
];
const MAXIMO_ESTADISTICA = 255;

function textoEvolucion(p) {
  if (!p.tieneEvolucion) return "No evoluciona";
  const nivel =
    p.nivelEvolucion > 0
      ? `a nivel ${p.nivelEvolucion}`
      : "mediante un objeto o condición especial";
  return `${p.evolucion} (${nivel})`;
}

export function renderDetalle(contenedor, { id }) {
  const p = buscarPokemonPorId(id);

  if (!p) {
    contenedor.innerHTML = `
      <section class="pantalla">
        <p class="vacio">No se encontró el Pokémon solicitado.</p>
        <button class="btn btn-primario" data-accion="volver">Volver a la Pokédex</button>
      </section>`;
    contenedor.querySelector('[data-accion="volver"]').addEventListener("click", () => navegar("pokedex"));
    return;
  }

  const barras = ESTADISTICAS.map(([etiqueta, campo]) => {
    const porcentaje = Math.min(100, (p[campo] / MAXIMO_ESTADISTICA) * 100);
    return `
      <div class="stat">
        <span class="stat-nombre">${etiqueta}</span>
        <span class="stat-valor">${p[campo]}</span>
        <div class="stat-barra"><div style="width:${porcentaje}%"></div></div>
      </div>`;
  }).join("");

  const botonShiny = p.shiny
    ? `<button class="btn btn-secundario" data-accion="shiny">✨ Ver versión shiny</button>`
    : "";
  const botonSonido = p.sonido
    ? `<button class="btn btn-secundario" data-accion="sonido">🔊 Escuchar</button>`
    : "";

  const evolucionExiste = p.tieneEvolucion && buscarPokemonPorNombre(p.evolucion);
  const botonEvolucion = evolucionExiste
    ? `<button class="btn btn-secundario" data-accion="evolucion">Ver ${escapar(p.evolucion)}</button>`
    : "";

  contenedor.innerHTML = `
    <section class="pantalla detalle">
      <button class="btn btn-volver" data-accion="volver">← Volver a la Pokédex</button>
      <div class="detalle-grid">
        <div class="detalle-visual">
          <span class="tarjeta-numero">${numeroPokedex(p.id)}</span>
          <img id="imagen-principal" src="${escapar(p.imagen)}" alt="${escapar(p.nombre)}">
          <div class="detalle-acciones">${botonShiny}${botonSonido}</div>
        </div>
        <div class="detalle-info">
          <h2>${escapar(p.nombre)}</h2>
          <div class="chips">${chipsDeTipo(p.tipo)}</div>
          <span class="rareza ${claseRareza(p.rareza)}">${escapar(p.rareza)}</span>
          <p class="descripcion">${escapar(p.descripcion)}</p>

          <dl class="datos">
            <div><dt>Altura</dt><dd>${p.altura} m</dd></div>
            <div><dt>Peso</dt><dd>${p.peso} kg</dd></div>
            <div><dt>Generación</dt><dd>${p.generacion}</dd></div>
            <div><dt>Habilidad</dt><dd>${escapar(p.habilidad)}</dd></div>
            <div><dt>Evolución</dt><dd>${escapar(textoEvolucion(p))}</dd></div>
            <div><dt>Shiny</dt><dd>${p.shiny ? "Disponible" : "No disponible"}</dd></div>
          </dl>

          <h3>Estadísticas base</h3>
          <div class="stats">${barras}</div>
          ${botonEvolucion}
        </div>
      </div>
    </section>`;

  activarImagenRespaldo(contenedor);

  contenedor.querySelector('[data-accion="volver"]').addEventListener("click", () => navegar("pokedex"));

  const imagen = contenedor.querySelector("#imagen-principal");
  const btnShiny = contenedor.querySelector('[data-accion="shiny"]');
  if (btnShiny) {
    let mostrandoShiny = false;
    btnShiny.addEventListener("click", () => {
      mostrandoShiny = !mostrandoShiny;
      imagen.src = mostrandoShiny ? p.imagenShiny : p.imagen;
      btnShiny.textContent = mostrandoShiny ? "Ver versión normal" : "✨ Ver versión shiny";
    });
  }

  const btnSonido = contenedor.querySelector('[data-accion="sonido"]');
  if (btnSonido) {
    btnSonido.addEventListener("click", () => {
      const audio = new Audio(p.sonido);
      audio.play().catch(() => {
        btnSonido.textContent = "🔇 Sonido no disponible";
        btnSonido.disabled = true;
      });
    });
  }

  const btnEvolucion = contenedor.querySelector('[data-accion="evolucion"]');
  if (btnEvolucion) {
    btnEvolucion.addEventListener("click", () => {
      const evolucion = buscarPokemonPorNombre(p.evolucion);
      if (evolucion) navegar("detalle", { id: evolucion.id });
    });
  }
}
