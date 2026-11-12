// Lógica de la batalla guionada (sin DOM, para que sea fácil de probar).
// La batalla avanza por fases: elegir -> encuentro -> turno (repetido) -> fin.

const POCIONES_INICIALES = 2;
const CURA_POCION = 35;

export function calcularDano(atacante, defensor, azar = Math.random) {
  const base = atacante.ataque * 0.45 - defensor.defensa * 0.2;
  const variacion = Math.floor(azar() * 9); // 0 a 8
  return Math.max(8, Math.round(base + variacion));
}

export function crearBatalla(jugador, rival) {
  const hpJugador = jugador.hp + 50;
  const hpRival = rival.hp + 50;
  return {
    jugador,
    rival,
    hpJugador,
    hpJugadorMax: hpJugador,
    hpRival,
    hpRivalMax: hpRival,
    pociones: POCIONES_INICIALES,
    turno: 1,
    defendiendo: false,
    fase: "encuentro",
    resultado: null, // "victoria" | "derrota" | "huida"
    mensajes: [],
  };
}

export function elegirRival(jugador, pokemones, azar = Math.random) {
  const candidatos = pokemones.filter((p) => p.id !== jugador.id);
  if (candidatos.length === 0) return jugador;
  return candidatos[Math.floor(azar() * candidatos.length)];
}

function terminar(estado, resultado, mensaje) {
  estado.fase = "fin";
  estado.resultado = resultado;
  estado.mensajes.push(mensaje);
}

// Decisión del encuentro inicial: "luchar" o "huir".
export function decidirEncuentro(estado, decision) {
  estado.mensajes = [];
  if (decision === "huir") {
    terminar(estado, "huida", `${estado.jugador.nombre} se aleja sin pelear.`);
  } else {
    estado.fase = "turno";
    estado.mensajes.push(`¡${estado.jugador.nombre} entra al combate!`);
  }
  return estado;
}

function contraataque(estado, azar) {
  let dano = calcularDano(estado.rival, estado.jugador, azar);
  if (estado.defendiendo) {
    dano = Math.max(1, Math.round(dano / 2));
    estado.defendiendo = false;
    estado.mensajes.push(`${estado.jugador.nombre} resiste el golpe.`);
  }
  estado.hpJugador = Math.max(0, estado.hpJugador - dano);
  estado.mensajes.push(`${estado.rival.nombre} ataca y causa ${dano} de daño.`);

  if (estado.hpJugador === 0) {
    terminar(estado, "derrota", `${estado.jugador.nombre} no puede continuar.`);
  }
}

// Acciones de un turno: "atacar", "pocion", "defender", "huir".
export function ejecutarAccion(estado, accion, azar = Math.random) {
  estado.mensajes = [];

  if (estado.fase !== "turno") return estado;

  if (accion === "huir") {
    terminar(estado, "huida", `${estado.jugador.nombre} escapa del combate.`);
    return estado;
  }

  if (accion === "atacar") {
    const dano = calcularDano(estado.jugador, estado.rival, azar);
    estado.hpRival = Math.max(0, estado.hpRival - dano);
    estado.mensajes.push(
      `${estado.jugador.nombre} ataca y causa ${dano} de daño a ${estado.rival.nombre}.`
    );
    if (estado.hpRival === 0) {
      terminar(estado, "victoria", `¡${estado.rival.nombre} quedó fuera de combate!`);
      return estado;
    }
  } else if (accion === "pocion") {
    if (estado.pociones <= 0) {
      estado.mensajes.push("¡No te quedan pociones! Elegí otra acción.");
      return estado; // no se pierde el turno
    }
    const antes = estado.hpJugador;
    estado.hpJugador = Math.min(estado.hpJugadorMax, estado.hpJugador + CURA_POCION);
    estado.pociones -= 1;
    estado.mensajes.push(
      `${estado.jugador.nombre} recupera ${estado.hpJugador - antes} HP con una poción.`
    );
  } else if (accion === "defender") {
    estado.defendiendo = true;
    estado.mensajes.push(`${estado.jugador.nombre} se prepara para recibir el golpe.`);
  }

  contraataque(estado, azar);

  if (estado.fase === "turno") estado.turno += 1;
  return estado;
}
