class CourseAdminPanel extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const user = JSON.parse(localStorage.getItem("loggedInAdmin"));
    const data = JSON.parse(localStorage.getItem("lmsData")) || { courses: [] };
    const courses = data.courses;

    if (!user || !["maestro", "administrador", "abmin"].includes(user.role)) {
      this.shadowRoot.innerHTML = "";
      return;
    }

    const userCourses =
      user.role === "maestro"
        ? courses.filter(c => c.teacherId === user.id)
        : courses; 

    this.shadowRoot.innerHTML = `
      <style>
        .panel {
          background: #0f171b;
          padding: 30px;
          border-radius: 16px;
          box-shadow: 0 0 25px rgba(34,231,132,0.1);
          color: #eee;
          margin-top: 40px;
        }
        h2 {
          color: #22e784;
          margin-bottom: 20px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
        }
        th, td {
          border-bottom: 1px solid #22e78422;
          padding: 10px 8px;
          text-align: left;
        }
        th {
          color: #22e784;
          font-weight: 600;
          background: #1a2025;
        }
        tr:hover {
          background: #1a1f22;
        }
        button {
          border: none;
          border-radius: 6px;
          padding: 6px 10px;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        .edit { background: #22e784; color: #111; font-weight: 600; }
        .delete { background: #e74c3c; color: #fff; font-weight: 600; }
        .edit:hover { transform: scale(1.05); box-shadow: 0 0 10px rgba(34,231,132,0.4); }
        .delete:hover { transform: scale(1.05); box-shadow: 0 0 10px rgba(231,76,60,0.5); }
        .no-courses {
          text-align: center;
          padding: 20px;
          color: #aaa;
        }
      </style>

      <div class="panel">
        <h2>Panel de administración de cursos</h2>
        ${
          userCourses.length === 0
            ? `<div class="no-courses">No hay cursos disponibles</div>`
            : `
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Título</th>
                  <th>Descripción</th>
                  <th>Autor</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                ${userCourses
                  .map(
                    c => `
                  <tr>
                    <td>${c.id}</td>
                    <td>${c.title}</td>
                    <td>${c.description}</td>
                    <td>${c.teacherName || "N/A"}</td>
                    <td>
                      <button class="edit" data-id="${c.id}">Editar</button>
                      <button class="delete" data-id="${c.id}">Eliminar</button>
                    </td>
                  </tr>
                `
                  )
                  .join("")}
              </tbody>
            </table>`
        }
      </div>
    `;

    // Agregar listeners para editar y eliminar
    this.shadowRoot.querySelectorAll(".delete").forEach(btn => {
      btn.addEventListener("click", e => {
        const id = parseInt(e.target.dataset.id);
        if (confirm("¿Seguro que deseas eliminar este curso?")) {
          this.deleteCourse(id, user);
        }
      });
    });

    this.shadowRoot.querySelectorAll(".edit").forEach(btn => {
      btn.addEventListener("click", e => {
        const id = parseInt(e.target.dataset.id);
        this.editCourse(id, user);
      });
    });
  }

  deleteCourse(id, user) {
    const data = JSON.parse(localStorage.getItem("lmsData"));
    const course = data.courses.find(c => c.id === id);

    // Validación de permisos
    if (
      user.role === "maestro" &&
      course.teacherId !== user.id
    ) {
      alert("❌ No puedes eliminar cursos de otros maestros.");
      return;
    }

    data.courses = data.courses.filter(c => c.id !== id);
    localStorage.setItem("lmsData", JSON.stringify(data));
    alert(" Curso eliminado.");
    this.render();
  }

  editCourse(id, user) {
    const data = JSON.parse(localStorage.getItem("lmsData"));
    const course = data.courses.find(c => c.id === id);

    if (
      user.role === "maestro" &&
      course.teacherId !== user.id
    ) {
      alert(" No puedes editar cursos de otros maestros.");
      return;
    }

    const newTitle = prompt("Nuevo título del curso:", course.title);
    const newDesc = prompt("Nueva descripción:", course.description);

    if (newTitle && newDesc) {
      course.title = newTitle;
      course.description = newDesc;
      localStorage.setItem("lmsData", JSON.stringify(data));
      alert(" Curso actualizado correctamente.");
      this.render();
    }
  }
}

customElements.define("course-admin-panel", CourseAdminPanel);
