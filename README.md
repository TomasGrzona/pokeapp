# PokeApp

Pokédex interactiva hecha con HTML5, CSS3 y JavaScript (módulos ES6). Sin frameworks.
Trabajo Práctico 9 – Funcionamiento de los Sistemas Digitales.

## Cómo ejecutarla

Los módulos (`import/export`) no funcionan abriendo `index.html` con doble clic. Hay que servirla:

- **VS Code:** extensión *Live Server* → clic derecho en `index.html` → *Open with Live Server*.
- **Terminal:** `python3 -m http.server 8000` y abrir http://localhost:8000

## Usuarios de prueba

| Rol | Usuario | Contraseña |
|---|---|---|
| Administrador | `admin` | `admin123` |
| Común | `ash` | `pikachu123` |

Cualquier usuario registrado desde la app es común (no admin). Solo el admin ve "Cargar Pokémon".

## Estructura

```
index.html
css/styles.css
js/
  main.js        punto de entrada, registra las vistas
  router.js      navegación entre vistas con JavaScript
  storage.js     JSON + localStorage (Pokémon, usuarios, sesión)
  auth.js        registro, login, usuario actual, admin
  utils.js       funciones auxiliares y tarjeta de Pokémon
  data/          datos iniciales (pokemon.js, usuarios.js)
  batalla/motor.js   lógica de la batalla (sin DOM)
  views/         landing, pokedex, detalle, login, registro, carga, batalla, navbar
assets/          img, sound, avatar
```

## Flujo de datos

datos → JavaScript → formularios → eventos → DOM → interacción → JSON → localStorage → aplicación

Al abrir por primera vez se cargan los datos iniciales en localStorage; desde ahí la app
siempre lee y escribe el estado guardado. El botón "Restablecer datos iniciales" (pantalla de
carga) vuelve al estado original.

## Imágenes y sonidos locales

Por defecto las imágenes se cargan desde el repositorio público de sprites de PokeAPI.
Para que sean locales como pide el enunciado:

1. Descargá cada imagen a `assets/img/` (por ejemplo `bulbasaur.png`, `bulbasaur-shiny.png`).
2. En `js/data/pokemon.js` cambiá `sprite(1)` por `"./assets/img/bulbasaur.png"` y
   `spriteShiny(1)` por `"./assets/img/bulbasaur-shiny.png"`.
3. Poné los `.mp3` en `assets/sound/` con los nombres indicados (ej. `pikachu.mp3`).
   Si el archivo no existe, el botón "Escuchar" avisa que no está disponible.

Importante: si ya abriste la app antes, usá "Restablecer datos iniciales" para que tome los cambios.

## Subir a GitHub (con historial de commits)

```
cd pokeapp
git init
git add index.html css
git commit -m "Estructura base y estilos"
git add js/data js/storage.js js/auth.js
git commit -m "Datos, almacenamiento y autenticación"
git add js/router.js js/utils.js js/main.js js/views/navbar.js js/views/landing.js
git commit -m "Router y vista de inicio"
git add js/views/pokedex.js js/views/detalle.js assets
git commit -m "Pokédex y detalle de Pokémon"
git add js/views/login.js js/views/registro.js js/views/carga.js
git commit -m "Login, registro y carga de Pokémon"
git add js/batalla js/views/batalla.js README.md
git commit -m "Batalla por turnos y README"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/pokeapp.git
git push -u origin main
```

Para tener la versión funcional online: en GitHub → Settings → Pages → rama `main`.
