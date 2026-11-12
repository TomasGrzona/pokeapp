// Vista de batalla: secuencia de pantallas y decisiones (elegir -> encuentro -> turnos -> resultado).

import { navegar } from "../router.js";
import { cargarPokemon } from "../storage.js";
import {
  crearBatalla,
  elegirRival,
  decidirEncuentro,
  ejecutarAccion,
} from "../batalla/motor.js";
import { escapar, tarjetaPokemon, activarImagenRespaldo } from "../utils.js";

function barraHp(nombre, actual, maximo, imagen, lado) {
  const porcentaje = Math.round((actual / maximo) * 100);
  const color = porcentaje > 50 ? "alto" : porcentaje > 20 ? "medio" : "bajo";
  return `
    <div class="combatiente combatiente-${lado}">
      <img src="${escapar(imagen)}" alt="${escapar(nombre)}">
      <div class="combatiente-info">
        <strong>${escapar(nombre)}</strong>
        <div class="hp-barra"><div class="hp-${color}" style="width:${porcentaje}%"></div></div>
        <small>${actual} / ${maximo} HP</small>
      </div>
    </div>`;
}

export function renderBatalla(contenedor) {
  let estado = null;

  activarImagenRespaldo(contenedor);

  function pintarEscena(titulo, cuerpo) {
    contenedor.innerHTML = `
      <section class="pantalla pantalla-media batalla">
        <h2>${titulo}</h2>
        ${cuerpo}
      </section>`;
  }

  function campoDeBatalla() {
    return `
      <div class="campo">
        ${barraHp(estado.rival.nombre, estado.hpRival, estado.hpRivalMax, estado.rival.imagen, "rival")}
        ${barraHp(estado.jugador.nombre, estado.hpJugador, estado.hpJugadorMax, estado.jugador.imagen, "jugador")}
      </div>`;
  }

  function registro() {
    return estado.mensajes.length
      ? `<ul class="registro">${estado.mensajes.map((m) => `<li>${escapar(m)}</li>`).join("")}</ul>`
      : "";
  }

  // ---------- Pantalla 1: elegir Pokémon ----------
  function pantallaElegir() {
    const pokemones = cargarPokemon();
    pintarEscena(
      "Elegí tu Pokémon",
      `<p>Seleccioná con quién querés combatir.</p>
       <div class="grilla">${[...pokemones].sort((a, b) => a.id - b.id).map(tarjetaPokemon).join("")}</div>`
    );
    contenedor.querySelectorAll('[data-accion="detalle"]').forEach((boton) => {
      // Reutilizamos la tarjeta: en esta pantalla el botón elige al luchador.
      boton.textContent = "Elegir";
      boton.addEventListener("click", () => {
        const jugador = pokemones.find((p) => p.id === Number(boton.dataset.id));
        estado = crearBatalla(jugador, elegirRival(jugador, pokemones));
        pantallaEncuentro();
      });
    });
  }

  // ---------- Pantalla 2: encuentro ----------
  function pantallaEncuentro() {
    pintarEscena(
      "¡Un Pokémon salvaje apareció!",
      `${campoDeBatalla()}
       <p class="narracion">Un <strong>${escapar(estado.rival.nombre)}</strong> salvaje bloquea tu camino. ¿Qué querés hacer?</p>
       <div class="acciones">
         <button class="btn btn-primario" data-decision="luchar">[ LUCHAR ]</button>
         <button class="btn btn-secundario" data-decision="huir">[ HUIR ]</button>
       </div>`
    );
    contenedor.querySelectorAll("[data-decision]").forEach((boton) => {
      boton.addEventListener("click", () => {
        decidirEncuentro(estado, boton.dataset.decision);
        estado.fase === "fin" ? pantallaFinal() : pantallaTurno();
      });
    });
  }

  // ---------- Pantalla 3: turnos ----------
  function pantallaTurno() {
    pintarEscena(
      `Turno ${estado.turno}`,
      `${campoDeBatalla()}
       ${registro()}
       <p class="narracion">¿Qué querés hacer?</p>
       <div class="acciones">
         <button class="btn btn-primario" data-accion-batalla="atacar">[ ATACAR ]</button>
         <button class="btn btn-secundario" data-accion-batalla="pocion">[ USAR POCIÓN ] (${estado.pociones})</button>
         <button class="btn btn-secundario" data-accion-batalla="defender">[ DEFENDER ]</button>
         <button class="btn btn-peligro" data-accion-batalla="huir">[ HUIR ]</button>
       </div>`
    );
    contenedor.querySelectorAll("[data-accion-batalla]").forEach((boton) => {
      boton.addEventListener("click", () => {
        ejecutarAccion(estado, boton.dataset.accionBatalla);
        estado.fase === "fin" ? pantallaFinal() : pantallaTurno();
      });
    });
  }

  // ---------- Pantalla 4: resultado ----------
  function pantallaFinal() {
    const textos = {
      victoria: ["¡Victoria!", `${estado.jugador.nombre} derrotó a ${estado.rival.nombre}.`],
      derrota: ["Derrota", `${estado.jugador.nombre} fue derrotado por ${estado.rival.nombre}.`],
      huida: ["Escapaste", "Lograste salir del combate a salvo."],
    };
    const [titulo, resumen] = textos[estado.resultado];

    pintarEscena(
      titulo,
      `${campoDeBatalla()}
       ${registro()}
       <p class="narracion resultado resultado-${estado.resultado}">${escapar(resumen)}</p>
       <p>Duración: ${estado.turno} turno(s).</p>
       <div class="acciones">
         <button class="btn btn-primario" data-fin="otra">Otra batalla</button>
         <button class="btn btn-secundario" data-fin="inicio">Volver al inicio</button>
       </div>`
    );
    contenedor.querySelector('[data-fin="otra"]').addEventListener("click", pantallaElegir);
    contenedor.querySelector('[data-fin="inicio"]').addEventListener("click", () => navegar("landing"));
  }

  pantallaElegir();
}
