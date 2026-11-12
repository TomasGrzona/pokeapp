import { navegar } from "../router.js";
import { usuarioActual } from "../auth.js";
import { cargarPokemon } from "../storage.js";
import { escapar } from "../utils.js";

export function renderLanding(contenedor) {
  const usuario = usuarioActual();
  const total = cargarPokemon().length;

  const saludo = usuario
    ? `<p class="saludo">¡Hola, ${escapar(usuario.nombre)}! Listo para seguir tu aventura.</p>`
    : `<p class="saludo">Iniciá sesión o registrate para participar de las batallas.</p>`;

  const botonesSesion = usuario
    ? ""
    : `<button class="btn btn-secundario" data-vista="login">Iniciar sesión</button>
       <button class="btn btn-secundario" data-vista="registro">Registrarse</button>`;

  contenedor.innerHTML = `
    <section class="hero">
      <div class="hero-pokebola"></div>
      <h1>PokeApp</h1>
      <p class="hero-sub">Tu Pokédex interactiva: consultá, descubrí y combatí.</p>
      ${saludo}
      <p class="hero-dato"><strong>${total}</strong> Pokémon registrados en la Pokédex</p>
      <div class="hero-botones">
        <button class="btn btn-primario" data-vista="pokedex">Abrir Pokédex</button>
        <button class="btn btn-primario" data-vista="batalla">¡A la batalla!</button>
        ${botonesSesion}
      </div>
    </section>`;

  contenedor.querySelectorAll("[data-vista]").forEach((boton) => {
    boton.addEventListener("click", () => navegar(boton.dataset.vista));
  });
}
