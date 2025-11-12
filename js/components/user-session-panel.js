class UserSessionPanel extends HTMLElement {
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

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
          margin: 20px auto 0;
          padding: 0 20px;
          box-sizing: border-box;
        }
        .session-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: linear-gradient(135deg, #10252d, #09141a);
          border: 1px solid rgba(34,231,132,0.2);
          border-radius: 18px;
          padding: 18px 24px;
          color: #e4fff3;
          box-shadow: 0 12px 24px rgba(1, 11, 16, 0.6);
        }
        .info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .info h3 {
          margin: 0;
          font-size: 1.2rem;
        }
        .eyebrow {
          text-transform: uppercase;
          letter-spacing: 0.2em;
          font-size: 0.75rem;
          color: #98d4b4;
        }
        .role {
          font-size: 0.85rem;
          color: #b8f3d5;
        }
        button {
          background: transparent;
          border: 1px solid rgba(255,255,255,0.4);
          color: #f7fff8;
          padding: 10px 18px;
          border-radius: 999px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.2s ease;
        }
        button:hover {
          border-color: #22e784;
          color: #22e784;
        }
      </style>
      <div class="session-card">
        <div class="info">
          <span class="eyebrow">Sesión activa</span>
          <h3>${user.name}</h3>
          <span class="role">Rol · ${user.role}</span>
        </div>
        <button id="logoutSessionBtn">Cerrar sesión</button>
      </div>
    `;

    this.shadowRoot
      .getElementById("logoutSessionBtn")
      ?.addEventListener("click", () => this.handleLogout());
  }

  handleLogout() {
    localStorage.removeItem("loggedInAdmin");
    alert("Sesión cerrada.");
    document.querySelector("course-admin-panel")?.render?.();
    document.querySelector("admin-profile")?.render?.();
    document.querySelector("course-form")?.connectedCallback?.();
    this.render();
  }
}

customElements.define("user-session-panel", UserSessionPanel);

