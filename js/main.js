// Punto de entrada: registra las vistas, conecta la barra de navegación y arranca en el inicio.

import { registrarVista, alCambiarVista, navegar } from "./router.js";
import { renderNavbar } from "./views/navbar.js";
import { renderLanding } from "./views/landing.js";
import { renderPokedex } from "./views/pokedex.js";
import { renderDetalle } from "./views/detalle.js";
import { renderLogin } from "./views/login.js";
import { renderRegistro } from "./views/registro.js";
import { renderCarga } from "./views/carga.js";
import { renderBatalla } from "./views/batalla.js";

registrarVista("landing", renderLanding);
registrarVista("pokedex", renderPokedex);
registrarVista("detalle", renderDetalle);
registrarVista("login", renderLogin);
registrarVista("registro", renderRegistro);
registrarVista("carga", renderCarga);
registrarVista("batalla", renderBatalla);

alCambiarVista(renderNavbar);

navegar("landing");
