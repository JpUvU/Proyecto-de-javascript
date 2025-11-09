class AuthModal extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        this.shadowRoot.innerHTML = `
        <link rel="stylesheet" href="/style.css">
        <div class="login-modal" id="loginModal">
            <div class="login-container" id="loginContainer">

                <!-- PANEL LOGIN -->
                <div class="panel show" id="loginPanel">
                    <div class="panel-image"
                        style="background-image: url('https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=900&q=80');">
                    </div>
                    <div class="panel-content">
                        <button class="close-login" id="closeLoginBtn">×</button>
                        <h2>Iniciar sesión</h2>
                        <form id="loginForm">
                            <label for="loginEmail">Correo electrónico</label>
                            <input type="email" id="loginEmail" placeholder="tucorreo@abc.edu" required />

                            <label for="loginPassword">Contraseña</label>
                            <div class="input-wrapper">
                                <input type="password" id="loginPassword" placeholder="••••••••" required />
                                <button type="button" class="togglePwd">👁</button>
                            </div>

                            <div class="login-options">
                                <label><input type="checkbox" id="rememberMe" /> Recuérdame</label>
                                <a href="#" class="forgot">¿Olvidaste tu contraseña?</a>
                            </div>

                            <button type="submit" class="btn-primary">Entrar</button>
                            <p class="switch-text">¿No tienes cuenta?
                                <a href="#" id="toSignupLink">Crear cuenta</a>
                            </p>
                            <p id="loginError" class="msg-error"></p>
                        </form>
                    </div>
                </div>

                <!-- PANEL REGISTRO -->
                <div class="panel" id="signupPanel">
                    <div class="panel-image"
                        style="background-image: url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80');">
                    </div>
                    <div class="panel-content">
                        <button class="close-login" id="closeSignupBtn">×</button>
                        <h2>Crear cuenta</h2>
                        <form id="signupForm">
                            <label for="signupName">Nombre completo</label>
                            <input type="text" id="signupName" placeholder="Tu nombre completo" required />

                            <label for="signupStudy">¿Qué deseas estudiar?</label>
                            <input type="text" id="signupStudy" placeholder="Ej: Programación, Matemáticas..." required />

                            <label for="signupEmail">Correo electrónico</label>
                            <input type="email" id="signupEmail" placeholder="tucorreo@abc.edu" required />

                            <label for="signupPassword">Contraseña</label>
                            <input type="password" id="signupPassword" placeholder="••••••••" required />

                            <button type="submit" class="btn-primary">Registrarse</button>

                            <p class="switch-text">¿Ya tienes cuenta?
                                <a href="#" id="toLoginLink">Iniciar sesión</a>
                            </p>
                            <p id="signupError" class="msg-error"></p>
                        </form>
                    </div>
                </div>

            </div>
        </div>
        `;
    }

    connectedCallback() {
        // Exponer los elementos al documento principal
        this.modal = this.shadowRoot.getElementById("loginModal");
        this.loginPanel = this.shadowRoot.getElementById("loginPanel");
        this.signupPanel = this.shadowRoot.getElementById("signupPanel");

        // Permitir control externo (desde login.js)
        window.authModal = {
            showLogin: () => {
                this.modal.classList.add("show");
                this.loginPanel.classList.add("show");
                this.signupPanel.classList.remove("show");
                document.body.style.overflow = "hidden";
            },
            showSignup: () => {
                this.modal.classList.add("show");
                this.signupPanel.classList.add("show");
                this.loginPanel.classList.remove("show");
                document.body.style.overflow = "hidden";
            },
            close: () => {
                this.modal.classList.remove("show");
                document.body.style.overflow = "";
            }
        };
    }
}

customElements.define("auth-modal", AuthModal);
