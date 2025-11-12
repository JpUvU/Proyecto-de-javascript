# Proyecto LMS ABC

Aplicación web tipo LMS (Learning Management System) construida en JavaScript puro que simula una plataforma para gestionar cursos, usuarios y roles administrativos desde el navegador utilizando `localStorage`.

## Estructura principal

- `index.html`: montaje de la interfaz principal, navbar y registro del resto de componentes personalizados.
- `style.css`: estilos globales compartidos.
- `js/roles.js`: inicializa usuarios/roles base en `localStorage`.
- `js/course-system.js`: servicio de datos con operaciones CRUD sobre usuarios y cursos.
- `js/auth-modal.js` + `js/login.js`: modal de autenticación, registro y flujo de login con códigos para roles admin.
- `js/components/curso.js`: genera 35 cursos aleatorios (con imágenes y docentes) si aún no existen en `localStorage`.
- `js/components/*`: colección de Web Components que encapsulan cada módulo funcional.

### Componentes destacados

| Componente | Rol |
|------------|-----|
| `course-form.js` | Formulario para crear cursos con recursos multimedia (visible para docentes/admin). |
| `course-list.js` | Grid con los cursos públicos y sus docentes. |
| `course-admin-panel.js` | Panel de “Mis cursos” donde docentes/administradores editan o eliminan cursos asignados. |
| `admin-profile.js` | Perfil avanzado de administración capaz de crear docentes, asignar múltiples profesores por curso y mostrar métricas. |
| `user-session-panel.js` | Tarjeta compacta con el nombre del usuario logueado y botón de cierre de sesión. |

## Funcionalidades

### Autenticación y roles
- Modal con pestañas para login/registro.
- Registro admite códigos `ADMIN123` (administrador) o `ABMIN123` (super admin) para conceder privilegios tras crear la cuenta.
- El estado de sesión se guarda en `localStorage` (`loggedInAdmin`), lo que habilita/oculta componentes dinámicamente.

### Gestión de cursos
- Generador aleatorio crea 35 cursos con datos realistas si el almacenamiento está vacío.
- Formularios y paneles permiten añadir, editar o eliminar cursos; cada curso soporta múltiples docentes asignados.
- “Mis cursos” filtra por docente logueado; administradores ven todo.

### Gestión de docentes
- Panel de admin crea, edita y elimina docentes.
- Al eliminar un docente, sus cursos quedan sin asignar pero permanecen visibles.
- Se pueden reasignar docentes a cursos mediante prompts desde los paneles.

### Interfaz
- Navbar con anclas rápidas a “Cursos”, “Mis cursos” y “Administrador”.
- Panel administrativo con tarjetas de métricas, formularios estilizados y tablas responsivas.
- Tarjeta de sesión activa para mostrar rápidamente quién está autenticado y cerrar sesión.

## Cómo usar el proyecto

1. Abre `index.html` en un navegador (no requiere servidor).
2. Usa las credenciales por defecto definidas en `js/roles.js` (por ejemplo `superadmin@abc.edu` / `1234`) o regístrate con un código administrativo.
3. Explora:
   - `Mis cursos` → gestión de los cursos propios.
   - `Administrador` → creación/gestión de docentes y cursos masivos.
   - `Cursos disponibles` → catálogo visible para cualquier visitante.
4. Toda la información se persiste en `localStorage`; limpia el almacenamiento del navegador si quieres reiniciar los datos.

### Acceso al panel admin

- **Credenciales de ejemplo**:
  - `superadmin@abc.edu` / `1234` → rol `abmin`.
  - `administrador@abc.edu` / `1234` → rol `administrador`.
- **Registro con código**:
  - Ingresa cualquier correo institucional y contraseña.
  - Usa `ADMIN123` para crearte como `administrador` o `ABMIN123` para rol `abmin`.
- Tras iniciar sesión con un rol privilegiado:
  - El navbar mostrará la tarjeta de sesión y el enlace “Administrador” te llevará al panel completo.
  - Desde ahí podrás crear docentes, cursos y asignar múltiples profesores.

## Personalización

- **Cambiar imágenes**: edita la lista `imagenesProgramacion` en `js/components/curso.js`.
- **Roles/cuentas iniciales**: modifica `js/roles.js`.
- **Estilos**: ajusta `style.css` (global) o los bloques `<style>` incrustados en cada componente.

## Dependencias

Proyecto 100 % JavaScript/HTML/CSS sin dependencias externas, ideal para practicar Web Components y manejo de datos en el navegador.

---
Si quieres extenderlo (por ejemplo, conectarlo a una API real o agregar evaluaciones), puedes reutilizar la estructura de servicios y componentes actual para seguir escalándolo. ¡Feliz aprendizaje! 🧠✨
