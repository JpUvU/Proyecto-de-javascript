class AdminProfile extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  loadData() {
    if (window.DataService?.loadData) {
      return DataService.loadData();
    }
    return JSON.parse(localStorage.getItem("lmsData")) || { users: [], courses: [] };
  }

  saveData(data) {
    if (window.DataService?.saveData) {
      DataService.saveData(data);
    } else {
      localStorage.setItem("lmsData", JSON.stringify(data));
    }
  }

  render() {
    const user = JSON.parse(localStorage.getItem("loggedInAdmin"));
    if (!user || !["abmin", "administrador"].includes(user.role)) {
      this.shadowRoot.innerHTML = "";
      return;
    }

    const data = this.loadData();
    const courses = this.ensureCoursesHaveTeachers(data);
    const teachers = data.users.filter(u => u.role === "maestro");
    const assignableTeachers = Array.from(
      new Map(
        data.users
          .filter(u => ["maestro", "administrador", "abmin"].includes(u.role))
          .map(user => [user.id, user])
      ).values()
    );
    const teacherOptions = assignableTeachers
      .map(t => `<option value="${t.id}">${t.name} (${t.role})</option>`)
      .join("");
    const teacherSelectSize = Math.min(Math.max(assignableTeachers.length, 3), 6);

    const totalAdmins = data.users.filter(u => ["administrador", "abmin"].includes(u.role)).length;
    const totalStaff = data.users.filter(u => ["maestro", "administrador", "abmin"].includes(u.role)).length;

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          margin: 50px auto;
          max-width: 1200px;
          padding: 0 20px;
        }
        .profile-card {
          position: relative;
          background: radial-gradient(circle at top left, #14363d, #081014 70%);
          color: #eef6f0;
          border-radius: 24px;
          padding: 36px;
          box-shadow: 0 25px 60px rgba(7, 23, 31, 0.7);
          overflow: hidden;
        }
        .profile-card::after {
          content: "";
          position: absolute;
          inset: 15px;
          border-radius: 18px;
          border: 1px solid rgba(34, 231, 132, 0.08);
          pointer-events: none;
        }
        .profile-header {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 28px;
        }
        .profile-info {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .eyebrow {
          text-transform: uppercase;
          letter-spacing: 0.2em;
          font-size: 0.75rem;
          color: #9fdcc1;
          margin: 0;
        }
        .profile-info h2 {
          margin: 0;
          font-size: 2rem;
          color: #f5fff8;
        }
        .welcome {
          margin: 0;
          color: #cde9db;
        }
        .role-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          width: fit-content;
          text-transform: capitalize;
          font-weight: 600;
          padding: 6px 14px;
          border-radius: 999px;
          background: rgba(34, 231, 132, 0.15);
          color: #22e784;
          font-size: 0.85rem;
        }
        #logoutBtn {
          align-self: flex-start;
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.25);
          color: #f5fff8;
          padding: 10px 18px;
          border-radius: 999px;
        }
        #logoutBtn:hover {
          border-color: #22e784;
          color: #22e784;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          margin-bottom: 32px;
        }
        .stat-card {
          background: rgba(14, 30, 38, 0.8);
          border: 1px solid rgba(34, 231, 132, 0.15);
          border-radius: 16px;
          padding: 18px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .stat-card span {
          font-size: 0.85rem;
          color: #9ecbb6;
        }
        .stat-card strong {
          font-size: 1.8rem;
          color: #22e784;
        }
        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 24px;
          margin-bottom: 36px;
        }
        form {
          background: rgba(8, 18, 24, 0.85);
          border: 1px solid rgba(34, 231, 132, 0.2);
          border-radius: 18px;
          padding: 22px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        form h3 {
          margin: 0;
          color: #22e784;
        }
        input, textarea, select {
          background: #0d1a20;
          border: 1px solid rgba(34, 231, 132, 0.25);
          border-radius: 10px;
          padding: 12px;
          color: #f7fff9;
          font-size: 0.95rem;
        }
        input:focus, textarea:focus, select:focus {
          outline: none;
          border-color: #22e784;
          box-shadow: 0 0 0 2px rgba(34, 231, 132, 0.15);
        }
        button {
          background: linear-gradient(120deg, #22e784, #2da4ff);
          color: #04151a;
          border: none;
          border-radius: 12px;
          padding: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        button:hover {
          transform: translateY(-1px);
          box-shadow: 0 12px 22px rgba(45, 164, 255, 0.25);
        }
        .danger {
          background: linear-gradient(120deg, #ff5f6d, #ffc371);
          color: #230505;
        }
        .hint {
          font-size: 0.8rem;
          color: #98d6ba;
        }
        .table-section {
          margin-bottom: 28px;
          padding: 18px;
          background: rgba(8, 20, 25, 0.85);
          border: 1px solid rgba(34, 231, 132, 0.12);
          border-radius: 18px;
        }
        .table-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 14px;
        }
        .section-title {
          margin: 0;
          color: #cfeee0;
          font-size: 1.1rem;
        }
        .badge {
          padding: 4px 12px;
          border-radius: 999px;
          background: rgba(34, 231, 132, 0.18);
          color: #22e784;
          font-weight: 600;
        }
        .table-wrapper {
          overflow-x: auto;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.95rem;
        }
        th, td {
          padding: 12px 10px;
          border-bottom: 1px solid rgba(34, 231, 132, 0.12);
          text-align: left;
        }
        th {
          color: #9feac8;
          font-weight: 600;
          text-transform: uppercase;
          font-size: 0.78rem;
          letter-spacing: 0.08em;
        }
        tr:hover td {
          background: rgba(22, 228, 132, 0.05);
        }
        .actions {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .empty {
          font-style: italic;
          color: #8aa4a3;
          text-align: center;
          padding: 16px 0;
        }
      </style>
      <div class="profile-card">
        <div class="profile-header">
          <div class="profile-info">
            <p class="eyebrow">Centro de control</p>
            <h2>Panel del administrador</h2>
            <p class="welcome">Hola, <strong>${user.name}</strong></p>
            <span class="role-pill">${user.role}</span>
          </div>
          <button id="logoutBtn">Cerrar sesión</button>
        </div>

        <div class="stats-grid">
          <div class="stat-card">
            <span>Cursos activos</span>
            <strong>${courses.length}</strong>
          </div>
          <div class="stat-card">
            <span>Docentes registrados</span>
            <strong>${teachers.length}</strong>
          </div>
          <div class="stat-card">
            <span>Equipo administrativo</span>
            <strong>${totalAdmins}</strong>
          </div>
          <div class="stat-card">
            <span>Colaboradores totales</span>
            <strong>${totalStaff}</strong>
          </div>
        </div>

        <div class="form-grid">
          <form id="createTeacherForm">
            <h3>Crear nuevo docente</h3>
            <input id="teacherName" placeholder="Nombre completo" required />
            <input id="teacherEmail" type="email" placeholder="Correo institucional" required />
            <input id="teacherPassword" type="password" placeholder="Contraseña temporal" required />
            <button type="submit">Registrar docente</button>
          </form>

          <form id="createCourseForm">
            <h3>Crear curso</h3>
            <input id="courseTitle" placeholder="Título del curso" required />
            <textarea id="courseDescription" placeholder="Descripción breve" rows="3" required></textarea>
            <label for="courseTeachers">Docentes responsables</label>
            <select id="courseTeachers" multiple size="${teacherSelectSize}">
              ${teacherOptions}
            </select>
            <small class="hint">Usa Ctrl/⌘ para seleccionar varios docentes.</small>
            <input id="courseCover" type="url" placeholder="URL de portada (opcional)" />
            <button type="submit">Guardar curso</button>
          </form>
        </div>

        <div class="table-section">
          <div class="table-header">
            <h3 class="section-title">Docentes registrados</h3>
            <span class="badge">${teachers.length}</span>
          </div>
          ${
            teachers.length === 0
              ? `<div class="empty">No hay docentes registrados.</div>`
              : `
            <div class="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Correo</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  ${teachers
                    .map(
                      t => `
                    <tr>
                      <td>${t.name}</td>
                      <td>${t.email}</td>
                      <td>
                        <div class="actions">
                          <button data-action="edit-teacher" data-id="${t.id}">Editar</button>
                          <button class="danger" data-action="delete-teacher" data-id="${t.id}">Eliminar</button>
                        </div>
                      </td>
                    </tr>`
                    )
                    .join("")}
                </tbody>
              </table>
            </div>`
          }
        </div>

        <div class="table-section">
          <div class="table-header">
            <h3 class="section-title">Cursos disponibles</h3>
            <span class="badge">${courses.length}</span>
          </div>
          ${
            courses.length === 0
              ? `<div class="empty">Aún no hay cursos registrados.</div>`
              : `
            <div class="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Título</th>
                    <th>Docente(s)</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  ${courses
                    .map(
                      c => `
                    <tr>
                      <td>${c.title}</td>
                      <td>${this.formatTeacherNames(c)}</td>
                      <td>
                        <div class="actions">
                          <button data-action="edit-course" data-id="${c.id}">Editar</button>
                          <button class="danger" data-action="delete-course" data-id="${c.id}">Eliminar</button>
                        </div>
                      </td>
                    </tr>`
                    )
                    .join("")}
                </tbody>
              </table>
            </div>`
          }
        </div>
      </div>
    `;

    this.attachHandlers();
  }

  attachHandlers() {
    const root = this.shadowRoot;
    root.getElementById("createTeacherForm")?.addEventListener("submit", e => {
      e.preventDefault();
      this.createTeacher();
    });

    root.getElementById("createCourseForm")?.addEventListener("submit", e => {
      e.preventDefault();
      this.createCourse();
    });

    root.getElementById("logoutBtn")?.addEventListener("click", () => {
      localStorage.removeItem("loggedInAdmin");
      alert("Sesión finalizada.");
      window.location.reload();
    });

    root.querySelectorAll("button[data-action]").forEach(btn => {
      const id = parseInt(btn.dataset.id, 10);
      switch (btn.dataset.action) {
        case "edit-teacher":
          btn.addEventListener("click", () => this.editTeacher(id));
          break;
        case "delete-teacher":
          btn.addEventListener("click", () => this.deleteTeacher(id));
          break;
        case "edit-course":
          btn.addEventListener("click", () => this.editCourse(id));
          break;
        case "delete-course":
          btn.addEventListener("click", () => this.deleteCourse(id));
          break;
        default:
          break;
      }
    });
  }

  createTeacher() {
    const name = this.shadowRoot.getElementById("teacherName").value.trim();
    const email = this.shadowRoot.getElementById("teacherEmail").value.trim();
    const password = this.shadowRoot.getElementById("teacherPassword").value.trim();

    if (!name || !email || !password) {
      return alert("Completa todos los campos del docente.");
    }

    const data = this.loadData();
    if (data.users.some(u => u.email === email)) {
      return alert("Ya existe un usuario con ese correo.");
    }

    data.users.push({
      id: Date.now(),
      name,
      email,
      password,
      role: "maestro"
    });

    this.saveData(data);
    alert("Docente creado correctamente.");
    this.shadowRoot.getElementById("createTeacherForm")?.reset();
    this.render();
  }

  createCourse() {
    const title = this.shadowRoot.getElementById("courseTitle").value.trim();
    const description = this.shadowRoot.getElementById("courseDescription").value.trim();
    const teacherSelect = this.shadowRoot.getElementById("courseTeachers");
    const selectedTeacherIds = Array.from(teacherSelect?.selectedOptions || [])
      .map(opt => Number(opt.value))
      .filter(id => !Number.isNaN(id));
    const cover = this.shadowRoot.getElementById("courseCover").value.trim();
    const logged = JSON.parse(localStorage.getItem("loggedInAdmin"));

    if (!title || !description) {
      return alert("Título y descripción son obligatorios.");
    }

    const data = this.loadData();
    const assignedTeachers =
      data.users
        .filter(u => selectedTeacherIds.includes(u.id))
        .map(u => ({ id: u.id, name: u.name }));

    if (!assignedTeachers.length && logged) {
      assignedTeachers.push({ id: logged.id, name: logged.name });
    } else if (!assignedTeachers.length) {
      assignedTeachers.push({ id: 0, name: "Administrador" });
    }

    const newCourse = {
      id: Date.now(),
      title,
      description,
      teachers: assignedTeachers,
      category: "General",
      level: "Básico",
      duration: "20 horas",
      price: 0,
      media: [
        {
          type: "image",
          url:
            cover ||
            "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=600&q=80"
        }
      ],
      createdAt: new Date().toISOString()
    };

    this.applyTeacherMetadata(newCourse, assignedTeachers);

    data.courses.push(newCourse);
    this.saveData(data);
    alert("Curso creado correctamente.");
    this.shadowRoot.getElementById("createCourseForm")?.reset();
    document.querySelector("course-list")?.connectedCallback?.();
    document.querySelector("course-admin-panel")?.render?.();
    this.render();
  }

  editTeacher(teacherId) {
    const data = this.loadData();
    const teacher = data.users.find(u => u.id === teacherId);
    if (!teacher) return;

    const newName = prompt("Nuevo nombre del docente:", teacher.name);
    if (!newName) return;
    const newEmail = prompt("Nuevo correo del docente:", teacher.email);
    if (!newEmail) return;

    teacher.name = newName.trim();
    teacher.email = newEmail.trim();
    this.saveData(data);
    alert("Docente actualizado.");
    this.render();
  }

  deleteTeacher(teacherId) {
    if (!confirm("¿Eliminar este docente? Sus cursos quedarán sin asignar.")) return;

    const data = this.loadData();
    const teacherIndex = data.users.findIndex(u => u.id === teacherId && u.role === "maestro");
    if (teacherIndex === -1) return alert("Docente no encontrado.");

    data.users.splice(teacherIndex, 1);
    data.courses = data.courses.map(course => {
      const remaining = this.normalizeTeachers(course).filter(t => t.id !== teacherId);
      if (remaining.length === this.normalizeTeachers(course).length) return course;
      const updatedCourse = { ...course, teachers: remaining };
      this.applyTeacherMetadata(updatedCourse, remaining);
      return updatedCourse;
    });

    this.saveData(data);
    alert("Docente eliminado.");
    document.querySelector("course-list")?.connectedCallback?.();
    document.querySelector("course-admin-panel")?.render?.();
    this.render();
  }

  editCourse(courseId) {
    const data = this.loadData();
    const course = data.courses.find(c => c.id === courseId);
    if (!course) return;

    const newTitle = prompt("Nuevo título del curso:", course.title);
    if (!newTitle) return;
    const newDesc = prompt("Nueva descripción:", course.description);
    if (!newDesc) return;
    const teacherIdsRaw = prompt(
      "IDs de los docentes (separados por coma). Deja vacío para mantenerlos:",
      this.normalizeTeachers(course).map(t => t.id).filter(Boolean).join(",")
    );

    course.title = newTitle.trim();
    course.description = newDesc.trim();

    if (teacherIdsRaw !== null && teacherIdsRaw.trim() !== "") {
      const ids = teacherIdsRaw
        .split(",")
        .map(v => parseInt(v.trim(), 10))
        .filter(id => !Number.isNaN(id));
      const teachers = data.users
        .filter(u => ids.includes(u.id))
        .map(u => ({ id: u.id, name: u.name }));
      if (teachers.length) {
        course.teachers = teachers;
        this.applyTeacherMetadata(course, teachers);
      }
    } else {
      this.applyTeacherMetadata(course, this.normalizeTeachers(course));
    }

    this.saveData(data);
    alert("Curso actualizado.");
    document.querySelector("course-list")?.connectedCallback?.();
    document.querySelector("course-admin-panel")?.render?.();
    this.render();
  }

  deleteCourse(courseId) {
    if (!confirm("¿Eliminar este curso definitivamente?")) return;
    const data = this.loadData();
    data.courses = data.courses.filter(c => c.id !== courseId);
    this.saveData(data);
    alert("Curso eliminado.");
    document.querySelector("course-list")?.connectedCallback?.();
    document.querySelector("course-admin-panel")?.render?.();
    this.render();
  }

  formatTeacherNames(course) {
    const teachers = this.normalizeTeachers(course);
    if (teachers.length) {
      return teachers.map(t => t.name).join(", ");
    }
    return course?.teacherName || "Sin asignar";
  }

  normalizeTeachers(course) {
    if (Array.isArray(course?.teachers) && course.teachers.length) {
      return course.teachers;
    }
    if (course?.teacherId || course?.teacherName) {
      return [{
        id: course.teacherId ?? null,
        name: course.teacherName || "Sin asignar"
      }];
    }
    return [];
  }

  applyTeacherMetadata(course, teachers) {
    if (!Array.isArray(teachers) || !teachers.length) {
      course.teacherId = null;
      course.teacherName = "Sin asignar";
      course.teachers = [];
      return;
    }
    course.teacherId = teachers[0]?.id ?? null;
    course.teacherName = teachers.map(t => t.name).join(", ");
    course.teachers = teachers;
  }

  ensureCoursesHaveTeachers(data) {
    return Array.isArray(data.courses) ? data.courses : [];
  }
}

customElements.define("admin-profile", AdminProfile);
