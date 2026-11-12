// Pantalla de carga de Pokémon (solo administradores).
// Flujo: formulario -> captura -> objeto -> se agrega a los datos -> localStorage -> Pokédex.

import { navegar } from "../router.js";
import { esAdmin } from "../auth.js";
import {
  cargarPokemon,
  agregarPokemon,
  siguienteIdPokemon,
  restablecerDatosIniciales,
} from "../storage.js";
import { TIPOS, RAREZAS, escapar, leerArchivoComoDataURL } from "../utils.js";

const LIMITE_ARCHIVO = 300 * 1024; // 300 KB, para no llenar localStorage

function opciones(lista, vacio = "") {
  const primera = vacio ? `<option value="">${vacio}</option>` : "";
  return primera + lista.map((x) => `<option value="${x}">${x}</option>`).join("");
}

// Convierte los datos del formulario en un objeto Pokémon (con números reales).
function construirPokemon(datos, imagen, imagenShiny) {
  const tipos = [datos.get("tipo1"), datos.get("tipo2")].filter(
    (t, i, arr) => t && arr.indexOf(t) === i
  );
  const tieneEvolucion = datos.get("tieneEvolucion") === "on";
  const shiny = datos.get("shiny") === "on";

  return {
    id: siguienteIdPokemon(),
    nombre: datos.get("nombre").trim(),
    tipo: tipos,
    descripcion: datos.get("descripcion").trim(),
    altura: Number(datos.get("altura")),
    peso: Number(datos.get("peso")),
    generacion: Number(datos.get("generacion")),
    hp: Number(datos.get("hp")),
    ataque: Number(datos.get("ataque")),
    velocidad: Number(datos.get("velocidad")),
    defensa: Number(datos.get("defensa")),
    habilidad: datos.get("habilidad").trim(),
    tieneEvolucion,
    evolucion: tieneEvolucion ? datos.get("evolucion").trim() : "",
    nivelEvolucion: tieneEvolucion ? Number(datos.get("nivelEvolucion") || 0) : 0,
    rareza: datos.get("rareza"),
    imagen,
    sonido: datos.get("sonido").trim(),
    shiny,
    imagenShiny: shiny ? imagenShiny : "",
  };
}

function validar(pokemon) {
  if (!pokemon.nombre) return "Ingresá el nombre del Pokémon.";
  if (cargarPokemon().some((p) => p.nombre.toLowerCase() === pokemon.nombre.toLowerCase())) {
    return `Ya existe un Pokémon llamado "${pokemon.nombre}".`;
  }
  if (pokemon.tipo.length === 0) return "Elegí al menos un tipo.";
  if (!pokemon.descripcion) return "Ingresá una descripción.";
  if (!pokemon.habilidad) return "Ingresá la habilidad.";
  if (!pokemon.imagen) return "Indicá una imagen (ruta, URL o archivo).";

  const positivos = ["altura", "peso", "generacion", "hp", "ataque", "velocidad", "defensa"];
  for (const campo of positivos) {
    if (!Number.isFinite(pokemon[campo]) || pokemon[campo] <= 0) {
      return `El campo "${campo}" debe ser un número mayor que 0.`;
    }
  }
  if (pokemon.tieneEvolucion && !pokemon.evolucion) {
    return "Indicá el nombre de la evolución.";
  }
  if (pokemon.shiny && !pokemon.imagenShiny) {
    return "Indicá la imagen shiny o desmarcá la opción shiny.";
  }
  return null;
}

export function renderCarga(contenedor) {
  if (!esAdmin()) {
    contenedor.innerHTML = `
      <section class="pantalla pantalla-angosta">
        <h2>Acceso restringido</h2>
        <p>Esta sección es solo para usuarios administradores.</p>
        <button class="btn btn-primario" data-vista="login">Iniciar sesión</button>
      </section>`;
    contenedor.querySelector("[data-vista]").addEventListener("click", () => navegar("login"));
    return;
  }

  contenedor.innerHTML = `
    <section class="pantalla pantalla-media">
      <h2>Cargar nuevo Pokémon</h2>
      <p class="aviso">ID que se asignará: <strong>${siguienteIdPokemon()}</strong></p>
      <form class="formulario formulario-doble" id="form-carga" novalidate>
        <label>Nombre
          <input type="text" name="nombre" required>
        </label>
        <label>Habilidad
          <input type="text" name="habilidad" required>
        </label>
        <label>Tipo principal
          <select name="tipo1" required>${opciones(TIPOS, "Elegí un tipo")}</select>
        </label>
        <label>Tipo secundario (opcional)
          <select name="tipo2">${opciones(TIPOS, "Ninguno")}</select>
        </label>
        <label class="ancho-completo">Descripción
          <textarea name="descripcion" rows="3" required></textarea>
        </label>
        <label>Altura (m)
          <input type="number" name="altura" step="0.1" min="0" required>
        </label>
        <label>Peso (kg)
          <input type="number" name="peso" step="0.1" min="0" required>
        </label>
        <label>Generación
          <input type="number" name="generacion" step="1" min="1" required>
        </label>
        <label>Rareza
          <select name="rareza" required>${opciones(RAREZAS)}</select>
        </label>
        <label>HP
          <input type="number" name="hp" step="1" min="1" required>
        </label>
        <label>Ataque
          <input type="number" name="ataque" step="1" min="1" required>
        </label>
        <label>Defensa
          <input type="number" name="defensa" step="1" min="1" required>
        </label>
        <label>Velocidad
          <input type="number" name="velocidad" step="1" min="1" required>
        </label>

        <label class="check ancho-completo">
          <input type="checkbox" name="tieneEvolucion" id="chk-evolucion"> Tiene evolución
        </label>
        <label data-grupo="evolucion" hidden>Evoluciona a
          <input type="text" name="evolucion">
        </label>
        <label data-grupo="evolucion" hidden>Nivel de evolución (0 = por objeto)
          <input type="number" name="nivelEvolucion" step="1" min="0" value="0">
        </label>

        <label class="ancho-completo">Imagen (ruta o URL)
          <input type="text" name="imagen" placeholder="./assets/img/nombre.png o https://…">
        </label>
        <label class="ancho-completo">…o subir un archivo (máx. 300 KB)
          <input type="file" name="archivoImagen" accept="image/*">
        </label>
        <label class="ancho-completo">Sonido (ruta, opcional)
          <input type="text" name="sonido" placeholder="./assets/sound/nombre.mp3">
        </label>

        <label class="check ancho-completo">
          <input type="checkbox" name="shiny" id="chk-shiny"> Tiene versión shiny
        </label>
        <label class="ancho-completo" data-grupo="shiny" hidden>Imagen shiny (ruta o URL)
          <input type="text" name="imagenShiny">
        </label>
        <label class="ancho-completo" data-grupo="shiny" hidden>…o subir archivo shiny (máx. 300 KB)
          <input type="file" name="archivoShiny" accept="image/*">
        </label>

        <p class="error ancho-completo" id="error" role="alert" hidden></p>
        <p class="exito ancho-completo" id="exito" role="status" hidden></p>
        <div class="ancho-completo botonera">
          <button class="btn btn-primario" type="submit">Guardar Pokémon</button>
          <button class="btn btn-secundario" type="button" data-accion="pokedex">Ver Pokédex</button>
          <button class="btn btn-peligro" type="button" data-accion="reset">Restablecer datos iniciales</button>
        </div>
      </form>
    </section>`;

  const formulario = contenedor.querySelector("#form-carga");
  const error = contenedor.querySelector("#error");
  const exito = contenedor.querySelector("#exito");

  // Mostrar u ocultar los campos que dependen de una casilla.
  function enlazarGrupo(idCasilla, grupo) {
    const casilla = contenedor.querySelector(idCasilla);
    const campos = contenedor.querySelectorAll(`[data-grupo="${grupo}"]`);
    casilla.addEventListener("change", () => {
      campos.forEach((c) => (c.hidden = !casilla.checked));
    });
  }
  enlazarGrupo("#chk-evolucion", "evolucion");
  enlazarGrupo("#chk-shiny", "shiny");

  async function obtenerImagen(datos, campoTexto, campoArchivo) {
    const archivo = datos.get(campoArchivo);
    if (archivo && archivo.size > 0) {
      if (archivo.size > LIMITE_ARCHIVO) {
        throw new Error("La imagen supera los 300 KB. Usá una más liviana o una URL.");
      }
      return leerArchivoComoDataURL(archivo);
    }
    return datos.get(campoTexto).trim();
  }

  formulario.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    error.hidden = true;
    exito.hidden = true;

    const datos = new FormData(formulario);

    try {
      const imagen = await obtenerImagen(datos, "imagen", "archivoImagen");
      const imagenShiny = await obtenerImagen(datos, "imagenShiny", "archivoShiny");
      const pokemon = construirPokemon(datos, imagen, imagenShiny);

      const problema = validar(pokemon);
      if (problema) {
        error.textContent = problema;
        error.hidden = false;
        return;
      }

      agregarPokemon(pokemon); // actualiza los datos y los guarda en localStorage

      exito.innerHTML = `¡${escapar(pokemon.nombre)} se guardó con el número ${pokemon.id}! Ya está en la Pokédex.`;
      exito.hidden = false;
      renderCarga(contenedor); // vuelve a dibujar el formulario vacío
      contenedor.querySelector("#exito").innerHTML = exito.innerHTML;
      contenedor.querySelector("#exito").hidden = false;
    } catch (fallo) {
      error.textContent =
        fallo.name === "QuotaExceededError"
          ? "No hay más espacio en el navegador para guardar datos."
          : fallo.message;
      error.hidden = false;
    }
  });

  contenedor.querySelector('[data-accion="pokedex"]').addEventListener("click", () => navegar("pokedex"));

  contenedor.querySelector('[data-accion="reset"]').addEventListener("click", () => {
    if (confirm("Se borrarán los Pokémon cargados, los usuarios registrados y la sesión. ¿Continuar?")) {
      restablecerDatosIniciales();
      navegar("landing");
    }
  });
}
