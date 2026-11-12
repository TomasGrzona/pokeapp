import { navegar } from "../router.js";
import { iniciarSesion } from "../auth.js";

export function renderLogin(contenedor) {
  contenedor.innerHTML = `
    <section class="pantalla pantalla-angosta">
      <h2>Iniciar sesión</h2>
      <form class="formulario" id="form-login" novalidate>
        <label>Usuario
          <input type="text" name="username" autocomplete="username" required>
        </label>
        <label>Contraseña
          <input type="password" name="password" autocomplete="current-password" required>
        </label>
        <p class="error" id="error" role="alert" hidden></p>
        <button class="btn btn-primario" type="submit">Entrar</button>
      </form>
      <p class="aviso">¿No tenés cuenta? <button class="enlace" data-vista="registro">Registrate</button></p>
    </section>`;

  const formulario = contenedor.querySelector("#form-login");
  const error = contenedor.querySelector("#error");

  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();
    const datos = new FormData(formulario);
    const resultado = iniciarSesion(datos.get("username"), datos.get("password"));

    if (!resultado.ok) {
      error.textContent = resultado.error;
      error.hidden = false;
      return;
    }
    navegar("landing");
  });

  contenedor.querySelector("[data-vista]").addEventListener("click", () => navegar("registro"));
}
