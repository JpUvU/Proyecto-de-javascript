class CourseList extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    const data = JSON.parse(localStorage.getItem("lmsData")) || { courses: [] };
    const courses = data.courses;
    const teacherNames = course => {
      if (Array.isArray(course.teachers) && course.teachers.length) {
        return course.teachers.map(t => t.name).join(", ");
      }
      return course.teacherName || "Sin asignar";
    };

    const renderMedia = (media = []) =>
      media.map(m =>
        m.type === "pdf"
          ? `<a href="${m.url}" target="_blank"> Ver PDF</a>`
          : m.type === "video"
          ? `<video src="${m.url}" controls width="100%" style="border-radius:12px;"></video>`
          : `<img src="${m.url}" style="width:100%;border-radius:12px;" />`
      ).join("");

    this.shadowRoot.innerHTML = `
      <style>
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 24px;
          padding: 40px;
        }
        .card {
          background: #141e24;
          padding: 16px;
          border-radius: 12px;
          color: #fff;
          box-shadow: 0 0 20px rgba(34,231,132,0.15);
        }
        h3 { color: #22e784; }
        .teachers {
          font-size: 0.9rem;
          color: #b5f3d5;
        }
      </style>
      <div class="grid">
        ${courses.map(c => `
          <div class="card">
            <h3>${c.title}</h3>
            <p class="teachers">Docentes: ${teacherNames(c)}</p>
            <p>${c.description}</p>
            <div class="media">${renderMedia(c.media)}</div>
          </div>
        `).join("")}
      </div>
    `;
  }
}

customElements.define("course-list", CourseList);
