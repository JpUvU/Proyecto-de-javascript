class CourseForm extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const user = JSON.parse(localStorage.getItem("loggedInAdmin"));

    if (!user) {
      this.shadowRoot.innerHTML = ""; 
      return;
    }

    if (!["maestro", "administrador", "abmin"].includes(user.role)) {
      this.shadowRoot.innerHTML = "";
      return;
    }

    this.shadowRoot.innerHTML = `
      <style>
        form {
          display: flex;
          flex-direction: column;
          gap: 12px;
          background: #0f171b;
          padding: 24px;
          border-radius: 16px;
          box-shadow: 0 0 20px rgba(34,231,132,0.15);
          margin-bottom: 40px;
        }
        h3 {
          color: #22e784;
          margin-bottom: 10px;
        }
        input, textarea {
          background: #1a2025;
          border: 1px solid #22e78433;
          color: #fff;
          padding: 10px;
          border-radius: 8px;
        }
        button {
          background: #22e784;
          color: #111;
          font-weight: bold;
          border: none;
          border-radius: 8px;
          padding: 12px;
          cursor: pointer;
          transition: 0.3s;
        }
        button:hover {
          box-shadow: 0 0 20px rgba(34,231,132,0.4);
          transform: translateY(-2px);
        }
      </style>

      <form id="courseForm">
        <h3>Subir nuevo curso</h3>
        <input id="title" placeholder="Título del curso" required />
        <textarea id="description" placeholder="Descripción del curso" required></textarea>
        <input type="file" id="mediaInput" multiple accept="image/*,video/*,.pdf" />
        <button type="submit">Guardar curso</button>
      </form>
    `;

    const form = this.shadowRoot.getElementById("courseForm");
    const mediaInput = this.shadowRoot.getElementById("mediaInput");

    // Evento de envío del formulario
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const title = this.shadowRoot.getElementById("title").value.trim();
      const description = this.shadowRoot.getElementById("description").value.trim();
      const files = Array.from(mediaInput.files);

      if (!title || !description) {
        alert("⚠️ Por favor completa todos los campos.");
        return;
      }

      const media = files.map(f => ({
        type: f.type.includes("video")
          ? "video"
          : f.type.includes("pdf")
          ? "pdf"
          : "image",
        url: URL.createObjectURL(f)
      }));

      const data = JSON.parse(localStorage.getItem("lmsData")) || { users: [], courses: [] };
      data.courses.push({
        id: Date.now(),
        title,
        description,
        teacherId: user.id,
        teacherName: user.name,
        media,
        createdAt: new Date().toISOString()
      });

      localStorage.setItem("lmsData", JSON.stringify(data));
      alert(" Curso subido correctamente.");
      form.reset();

      document.querySelector("course-list")?.connectedCallback();
    });
  }
}

customElements.define("course-form", CourseForm);
