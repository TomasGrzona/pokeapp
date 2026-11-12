import { navegar } from "../router.js";
import { registrarUsuario, iniciarSesion } from "../auth.js";
import { AVATARES } from "../data/usuarios.js";

export function renderRegistro(contenedor) {
  const avatares = AVATARES.map(
    (ruta, i) => `
      <label class="avatar-opcion">
        <input type="radio" name="avatar" value="${ruta}" ${i === 0 ? "checked" : ""}>
        <img src="${ruta}" alt="Avatar ${i + 1}">
      </label>`
  ).join("");

  contenedor.innerHTML = `
    <section class="pantalla pantalla-angosta">
      <h2>Registrarse</h2>
      <form class="formulario" id="form-registro" novalidate>
        <label>Nombre
          <input type="text" name="nombre" autocomplete="name" required>
        </label>
        <label>Email
          <input type="email" name="email" autocomplete="email" required>
        </label>
        <label>Usuario
          <input type="text" name="username" autocomplete="username" required>
        </label>
        <label>Contraseña (mínimo 6 caracteres)
          <input type="password" name="password" autocomplete="new-password" required>
        </label>
        <label>Repetir contraseña
          <input type="password" name="confirmar" autocomplete="new-password" required>
        </label>
        <fieldset class="avatares">
          <legend>Elegí tu avatar</legend>
          ${avatares}
        </fieldset>
        <p class="error" id="error" role="alert" hidden></p>
        <button class="btn btn-primario" type="submit">Crear cuenta</button>
      </form>
      <p class="aviso">¿Ya tenés cuenta? <button class="enlace" data-vista="login">Iniciá sesión</button></p>
    </section>`;

  const formulario = contenedor.querySelector("#form-registro");
  const error = contenedor.querySelector("#error");

  function mostrarError(mensaje) {
    error.textContent = mensaje;
    error.hidden = false;
  }

  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();
    const datos = new FormData(formulario);

    if (datos.get("password") !== datos.get("confirmar")) {
      mostrarError("Las contraseñas no coinciden.");
      return;
    }

    const resultado = registrarUsuario({
      nombre: datos.get("nombre"),
      email: datos.get("email"),
      username: datos.get("username"),
      password: datos.get("password"),
      avatar: datos.get("avatar"),
    });

    if (!resultado.ok) {
      mostrarError(resultado.error);
      return;
    }

    // Después de registrarse, se inicia sesión automáticamente.
    iniciarSesion(datos.get("username"), datos.get("password"));
    navegar("landing");
  });

  contenedor.querySelector("[data-vista]").addEventListener("click", () => navegar("login"));
}
