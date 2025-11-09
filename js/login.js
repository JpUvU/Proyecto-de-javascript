// =============================
// ELEMENTOS
// =============================
const loginModal = document.getElementById("loginModal");
const showLoginBtn = document.getElementById("show-login-btn");
const closeLoginBtn = document.getElementById("closeLoginBtn");
const closeSignupBtn = document.getElementById("closeSignupBtn");

const loginPanel = document.getElementById("loginPanel");
const signupPanel = document.getElementById("signupPanel");

const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const loginError = document.getElementById("loginError");
const signupError = document.getElementById("signupError");
const togglePwdBtns = document.querySelectorAll(".togglePwd");

const toSignupLink = document.getElementById("toSignupLink");
const toLoginLink = document.getElementById("toLoginLink");

// =============================
// SERVICIO DE AUTENTICACIÓN
// =============================
class AuthService {
    static getAdmins() {
        return JSON.parse(localStorage.getItem("admins")) || [];
    }

    static saveAdmins(admins) {
        localStorage.setItem("admins", JSON.stringify(admins));
    }

    static addAdmin(admin) {
        const admins = this.getAdmins();
        admins.push(admin);
        this.saveAdmins(admins);
    }

    static validate(email, password) {
        return this.getAdmins().find(
            (u) => u.email === email && u.password === password
        );
    }
}

// =============================
// ABRIR / CERRAR MODAL
// =============================
showLoginBtn?.addEventListener("click", () => {
    loginModal.classList.add("show");
    document.body.style.overflow = "hidden";
});

const closeModal = () => {
    loginModal.classList.remove("show");
    document.body.style.overflow = "";
};

closeLoginBtn?.addEventListener("click", closeModal);
closeSignupBtn?.addEventListener("click", closeModal);

// Cerrar con tecla ESC
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
});

// Cerrar al hacer clic fuera del cuadro
loginModal?.addEventListener("click", (e) => {
    const container = document.querySelector(".login-container");
    if (!container.contains(e.target)) closeModal();
});

// =============================
// MOSTRAR / OCULTAR CONTRASEÑA
// =============================
togglePwdBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
        const input = btn.previousElementSibling;
        input.type = input.type === "password" ? "text" : "password";
        btn.textContent = input.type === "password" ? "👁" : "👁";
    });
});

// =============================
// REGISTRO DE NUEVO USUARIO
// =============================
signupForm?.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("signupName").value.trim();
    const study = document.getElementById("signupStudy").value.trim();
    const email = document.getElementById("signupEmail").value.trim();
    const pwd = document.getElementById("signupPassword").value;

    if (!name || !study || !email || !pwd) {
        signupError.textContent = "⚠️ Por favor completa todos los campos.";
        signupForm.classList.add("shake");
        setTimeout(() => signupForm.classList.remove("shake"), 600);
        return;
    }

    const admins = AuthService.getAdmins();
    if (admins.some((a) => a.email === email)) {
        signupError.textContent = "⚠️ Ya existe una cuenta con ese correo.";
        signupForm.classList.add("shake");
        setTimeout(() => signupForm.classList.remove("shake"), 600);
        return;
    }

    const newAdmin = { name, study, email, password: pwd };
    AuthService.addAdmin(newAdmin);

    signupForm.reset();
    signupError.textContent = "";
    loginError.textContent = "✅ Cuenta creada. Inicia sesión.";

    // Transición suave al panel de login
    signupPanel.classList.remove("show");
    loginPanel.classList.add("show");
});

// =============================
// LOGIN DE USUARIO
// =============================
loginForm?.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const pwd = document.getElementById("loginPassword").value;
    const user = AuthService.validate(email, pwd);

    if (user) {
        localStorage.setItem("loggedInAdmin", JSON.stringify(user));
        loginError.textContent = "";
        alert(`✅ Bienvenido ${user.name || "Administrador"}`);
        closeModal();
        // window.location.href = 'dashboard.html';
    } else {
        loginError.textContent = "❌ Email o contraseña incorrectos.";
        loginForm.classList.add("shake");
        setTimeout(() => loginForm.classList.remove("shake"), 600);
    }
});

// =============================
// CAMBIO ENTRE LOGIN Y SIGNUP
// =============================
toSignupLink?.addEventListener("click", (e) => {
    e.preventDefault();
    loginPanel.classList.remove("show");
    signupPanel.classList.add("show");
});

toLoginLink?.addEventListener("click", (e) => {
    e.preventDefault();
    signupPanel.classList.remove("show");
    loginPanel.classList.add("show");
});
