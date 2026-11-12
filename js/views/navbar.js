// Barra de navegación superior. Se vuelve a dibujar en cada cambio de vista
// para reflejar si hay una sesión iniciada y si el usuario es administrador.

import { navegar } from "../router.js";
import { usuarioActual, cerrarSesion } from "../auth.js";
import { escapar } from "../utils.js";

export function renderNavbar(vistaActiva) {
  const barra = document.getElementById("navbar");
  const usuario = usuarioActual();

  const enlace = (vista, texto) =>
    `<button class="nav-link ${vistaActiva === vista ? "activo" : ""}" data-vista="${vista}">${texto}</button>`;

  const enlacesAdmin = usuario && usuario.admin ? enlace("carga", "Cargar Pokémon") : "";

  const zonaUsuario = usuario
    ? `<div class="nav-usuario">
         <img src="${escapar(usuario.avatar)}" alt="Avatar de ${escapar(usuario.nombre)}">
         <span>${escapar(usuario.nombre)}${usuario.admin ? ' <em class="insignia">admin</em>' : ""}</span>
         <button class="nav-link" data-accion="salir">Salir</button>
       </div>`
    : `<div class="nav-usuario">
         ${enlace("login", "Iniciar sesión")}
         ${enlace("registro", "Registrarse")}
       </div>`;

  barra.innerHTML = `
    <div class="nav-contenido">
      <button class="nav-marca" data-vista="landing">
        <span class="pokebola"></span> PokeApp
      </button>
      <nav class="nav-enlaces">
        ${enlace("landing", "Inicio")}
        ${enlace("pokedex", "Pokédex")}
        ${enlace("batalla", "Batalla")}
        ${enlacesAdmin}
      </nav>
      ${zonaUsuario}
    </div>`;

  barra.querySelectorAll("[data-vista]").forEach((boton) => {
    boton.addEventListener("click", () => navegar(boton.dataset.vista));
  });

  const botonSalir = barra.querySelector('[data-accion="salir"]');
  if (botonSalir) {
    botonSalir.addEventListener("click", () => {
      cerrarSesion();
      navegar("landing");
    });
  }
}
