import { navegar } from "../router.js";
import { cargarPokemon } from "../storage.js";
import {
  TIPOS,
  RAREZAS,
  normalizar,
  tarjetaPokemon,
  activarImagenRespaldo,
} from "../utils.js";

export function renderPokedex(contenedor) {
  // Se lee siempre el estado actual guardado (incluye los Pokémon cargados por el admin).
  const pokemones = cargarPokemon();

  contenedor.innerHTML = `
    <section class="pantalla">
      <h2>Pokédex</h2>
      <form class="filtros" id="filtros" autocomplete="off">
        <input type="search" id="busqueda" placeholder="Buscar por nombre…" aria-label="Buscar por nombre">
        <select id="filtro-tipo" aria-label="Filtrar por tipo">
          <option value="">Todos los tipos</option>
          ${TIPOS.map((t) => `<option value="${t}">${t}</option>`).join("")}
        </select>
        <select id="filtro-rareza" aria-label="Filtrar por rareza">
          <option value="">Todas las rarezas</option>
          ${RAREZAS.map((r) => `<option value="${r}">${r}</option>`).join("")}
        </select>
      </form>
      <p class="contador" id="contador"></p>
      <div class="grilla" id="grilla"></div>
    </section>`;

  const grilla = contenedor.querySelector("#grilla");
  const contador = contenedor.querySelector("#contador");
  const busqueda = contenedor.querySelector("#busqueda");
  const filtroTipo = contenedor.querySelector("#filtro-tipo");
  const filtroRareza = contenedor.querySelector("#filtro-rareza");

  activarImagenRespaldo(contenedor);

  function dibujar() {
    const texto = normalizar(busqueda.value.trim());
    const tipo = filtroTipo.value;
    const rareza = filtroRareza.value;

    const visibles = pokemones.filter(
      (p) =>
        normalizar(p.nombre).includes(texto) &&
        (tipo === "" || p.tipo.includes(tipo)) &&
        (rareza === "" || p.rareza === rareza)
    );

    contador.textContent = `${visibles.length} de ${pokemones.length} Pokémon`;

    if (visibles.length === 0) {
      grilla.innerHTML = `<p class="vacio">No se encontraron Pokémon con esos filtros.</p>`;
      return;
    }

    const ordenados = [...visibles].sort((a, b) => a.id - b.id);
    grilla.innerHTML = ordenados.map(tarjetaPokemon).join("");
  }

  busqueda.addEventListener("input", dibujar);
  filtroTipo.addEventListener("change", dibujar);
  filtroRareza.addEventListener("change", dibujar);
  contenedor.querySelector("#filtros").addEventListener("submit", (e) => e.preventDefault());

  // Un único listener para toda la grilla (delegación de eventos).
  grilla.addEventListener("click", (evento) => {
    const objetivo = evento.target.closest("[data-id]");
    if (objetivo) navegar("detalle", { id: Number(objetivo.dataset.id) });
  });

  dibujar();
}
