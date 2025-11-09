const showLoginBtn = document.getElementById("show-login-btn");
const showSignupBtn = document.getElementById("show-signup-btn");

window.addEventListener("DOMContentLoaded", () => {
    const authComponent = document.querySelector("auth-modal");
    if (!authComponent) return;

    const shadow = authComponent.shadowRoot;
    const loginModal = shadow.getElementById("loginModal");
    const loginPanel = shadow.getElementById("loginPanel");
    const signupPanel = shadow.getElementById("signupPanel");
    const closeLoginBtn = shadow.getElementById("closeLoginBtn");
    const closeSignupBtn = shadow.getElementById("closeSignupBtn");

    const loginForm = shadow.getElementById("loginForm");
    const signupForm = shadow.getElementById("signupForm");
    const loginError = shadow.getElementById("loginError");
    const signupError = shadow.getElementById("signupError");
    const togglePwdBtns = shadow.querySelectorAll(".togglePwd");

    const toSignupLink = shadow.getElementById("toSignupLink");
    const toLoginLink = shadow.getElementById("toLoginLink");

    // =============================
    // SERVICIO DE AUTENTICACIÓN
    // =============================
    class AuthService {
        static getUsers() {
            const data = JSON.parse(localStorage.getItem("lmsData")) || { users: [] };
            return data.users;
        }

        static addUser(newUser) {
            const data = JSON.parse(localStorage.getItem("lmsData")) || { users: [], courses: [] };
            data.users.push(newUser);
            localStorage.setItem("lmsData", JSON.stringify(data));
        }

        static validate(email, password) {
            const users = this.getUsers();
            return users.find(u => u.email === email && u.password === password);
        }
    }

    // =============================
    // CONTROL MODAL
    // =============================
    const openModal = (showSignup = false) => {
        loginModal.classList.add("show");
        document.body.style.overflow = "hidden";
        if (showSignup) {
            loginPanel.classList.remove("show");
            signupPanel.classList.add("show");
        } else {
            signupPanel.classList.remove("show");
            loginPanel.classList.add("show");
        }
    };

    const closeModal = () => {
        loginModal.classList.remove("show");
        document.body.style.overflow = "";
    };

    // Métodos globales para abrir/cerrar desde otros scripts
    window.authModal = {
        showLogin: () => openModal(false),
        showSignup: () => openModal(true),
        close: closeModal
    };

    // Botones navbar
    showLoginBtn?.addEventListener("click", () => openModal(false));
    showSignupBtn?.addEventListener("click", () => openModal(true));

    // Cerrar modal
    closeLoginBtn?.addEventListener("click", closeModal);
    closeSignupBtn?.addEventListener("click", closeModal);
    document.addEventListener("keydown", (e) => e.key === "Escape" && closeModal());
    loginModal?.addEventListener("click", (e) => {
        const container = shadow.querySelector(".login-container");
        if (!container.contains(e.target)) closeModal();
    });

    // =============================
    // MOSTRAR / OCULTAR CONTRASEÑA
    // =============================
    togglePwdBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            const input = btn.previousElementSibling;
            input.type = input.type === "password" ? "text" : "password";
        });
    });

    // =============================
    // REGISTRO DE NUEVO USUARIO
    // =============================
    signupForm?.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = shadow.getElementById("signupName").value.trim();
        const study = shadow.getElementById("signupStudy").value.trim();
        const email = shadow.getElementById("signupEmail").value.trim();
        const pwd = shadow.getElementById("signupPassword").value;

        if (!name || !study || !email || !pwd) {
            signupError.textContent = "⚠️ Por favor completa todos los campos.";
            signupForm.classList.add("shake");
            setTimeout(() => signupForm.classList.remove("shake"), 600);
            return;
        }

        const users = AuthService.getUsers();
        if (users.some((u) => u.email === email)) {
            signupError.textContent = "⚠️ Ya existe una cuenta con ese correo.";
            signupForm.classList.add("shake");
            setTimeout(() => signupForm.classList.remove("shake"), 600);
            return;
        }

        // Nuevo usuario con rol estudiante por defecto
        const newUser = {
            id: Date.now(),
            name,
            study,
            email,
            password: pwd,
            role: "estudiante"
        };

        AuthService.addUser(newUser);
        signupForm.reset();
        signupError.textContent = "";
        loginError.textContent = "✅ Cuenta creada. Inicia sesión.";
        signupPanel.classList.remove("show");
        loginPanel.classList.add("show");
    });

    // =============================
    // LOGIN DE USUARIO
    // =============================
    loginForm?.addEventListener("submit", (e) => {
        e.preventDefault();

        const email = shadow.getElementById("loginEmail").value.trim();
        const pwd = shadow.getElementById("loginPassword").value;
        const user = AuthService.validate(email, pwd);

        if (user) {
            localStorage.setItem("loggedInAdmin", JSON.stringify(user));
            loginError.textContent = "";
            alert(`✅ Bienvenido ${user.name || "Usuario"}`);
            closeModal();

            // Redirección opcional por rol
            if (["maestro", "administrador", "abmin"].includes(user.role)) {
                document.querySelector("course-admin-panel")?.render?.();
            }
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
});
