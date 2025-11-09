class HeroCarousel extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this.slides = [
      {
        img: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1920&q=80",
        title: "Aprende sin límites",
        subtitle: "Explora cursos diseñados por expertos del mundo real.",
        btnText: "Ver Cursos",
        btnLink: "#"
      },
      {
        img: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1920&q=80",
        title: "Transforma tu carrera",
        subtitle: "Capacítate en habilidades digitales de alto impacto.",
        btnText: "Comenzar ahora",
        btnLink: "#"
      },
      {
        img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1920&q=80",
        title: "Aprendizaje colaborativo",
        subtitle: "Únete a comunidades activas de aprendizaje y progreso.",
        btnText: "Descubrir más",
        btnLink: "#"
      }
    ];

    this.current = 0;
    this.interval = null;

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          position: relative;
          overflow: hidden;
          height: 100vh;
          width: 100%;
        }

        .slide {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          opacity: 0;
          transform: scale(1.08);
          transition: opacity 1.5s ease, transform 3s ease;
        }

        .slide.active {
          opacity: 1;
          transform: scale(1);
          z-index: 2;
        }

        .overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, rgba(0,0,0,0.35), rgba(0,0,0,0.7));
          z-index: 3;
        }

        .content {
          position: absolute;
          z-index: 4;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
          color: #fff;
          max-width: 900px;
          width: 90%;
          padding: 40px 60px;
          background: rgba(15, 23, 28, 0.6);
          border-radius: 16px;
          backdrop-filter: blur(10px);
          animation: fadeInUp 1.2s ease;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
        }

        .content h1 {
          font-size: 3rem;
          font-weight: 800;
          color: #22e784;
          margin-bottom: 14px;
          text-shadow: 0 2px 10px rgba(0,0,0,0.4);
        }

        .content p {
          font-size: 1.2rem;
          color: #e0f7ec;
          margin-bottom: 26px;
        }

        .btn-primary {
          background: #22e784;
          color: #141e24;
          border: none;
          border-radius: 8px;
          padding: 14px 30px;
          font-weight: 700;
          cursor: pointer;
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .btn-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(34, 231, 132, 0.4);
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translate(-50%, -40%); }
          to { opacity: 1; transform: translate(-50%, -50%); }
        }

        /* Navegación */
        .nav-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 5;
          background: rgba(34, 231, 132, 0.25);
          color: #fff;
          border: none;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          cursor: pointer;
          transition: background 0.3s, transform 0.3s;
        }
        .nav-btn:hover {
          background: rgba(34, 231, 132, 0.6);
          transform: scale(1.1);
        }
        .nav-btn.prev { left: 25px; }
        .nav-btn.next { right: 25px; }

        /* Indicadores */
        .dots {
          position: absolute;
          bottom: 25px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 10px;
          z-index: 6;
        }

        .dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #22e78433;
          cursor: pointer;
          transition: background 0.3s;
        }

        .dot.active {
          background: #22e784;
        }

        @media (max-width: 768px) {
          .content {
            padding: 30px;
          }
          .content h1 {
            font-size: 2rem;
          }
          .content p {
            font-size: 1rem;
          }
        }
      </style>

      <div class="carousel">
        ${this.slides.map((s, i) => `
          <div class="slide ${i === 0 ? "active" : ""}" style="background-image:url('${s.img}')">
            <div class="overlay"></div>
            <div class="content">
              <h1>${s.title}</h1>
              <p>${s.subtitle}</p>
              <button class="btn-primary" onclick="window.location.href='${s.btnLink}'">
                ${s.btnText}
              </button>
            </div>
          </div>
        `).join("")}

        <button class="nav-btn prev">‹</button>
        <button class="nav-btn next">›</button>

        <div class="dots">
          ${this.slides.map((_, i) => `<div class="dot ${i === 0 ? "active" : ""}" data-index="${i}"></div>`).join("")}
        </div>
      </div>
    `;
  }

  connectedCallback() {
    const slides = this.shadowRoot.querySelectorAll(".slide");
    const dots = this.shadowRoot.querySelectorAll(".dot");
    const prev = this.shadowRoot.querySelector(".prev");
    const next = this.shadowRoot.querySelector(".next");

    const showSlide = (index) => {
      this.current = (index + slides.length) % slides.length;
      slides.forEach((s, i) => s.classList.toggle("active", i === this.current));
      dots.forEach((d, i) => d.classList.toggle("active", i === this.current));
    };

    next.addEventListener("click", () => showSlide(this.current + 1));
    prev.addEventListener("click", () => showSlide(this.current - 1));
    dots.forEach(dot =>
      dot.addEventListener("click", e => showSlide(parseInt(e.target.dataset.index)))
    );

    this.showSlide = showSlide;
    this.startAutoSlide();
  }

  startAutoSlide() {
    clearInterval(this.interval);
    this.interval = setInterval(() => {
      const slides = this.shadowRoot.querySelectorAll(".slide");
      this.showSlide?.((this.current + 1) % slides.length);
    }, 10000); 
  }
}

customElements.define("hero-carousel", HeroCarousel);
