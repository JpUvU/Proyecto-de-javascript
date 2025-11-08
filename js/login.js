// =============================
// ELEMENTOS PRINCIPALES
// =============================
const loginModal = document.getElementById('loginModal');
const showLoginBtn = document.getElementById('show-login-btn');
const closeLoginBtn = document.getElementById('closeLoginBtn');

const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const loginError = document.getElementById('loginError');
const signupError = document.getElementById('signupError');
const togglePwdBtns = document.querySelectorAll('.togglePwd');

// =============================
// SERVICIO DE AUTENTICACIÓN
// =============================
class AuthService {
    static getAdmins() {
        return JSON.parse(localStorage.getItem('admins')) || [];
    }
    static saveAdmins(admins) {
        localStorage.setItem('admins', JSON.stringify(admins));
    }
    static addAdmin(email, password) {
        const admins = this.getAdmins();
        admins.push({ email, password });
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
if (showLoginBtn) {
    showLoginBtn.addEventListener('click', () => {
        loginModal.classList.add('show');
        document.body.style.overflow = 'hidden';
    });
    }

    if (closeLoginBtn) {
    closeLoginBtn.addEventListener('click', () => {
        loginModal.classList.remove('show');
        document.body.style.overflow = '';
    });
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') loginModal.classList.remove('show');
});

// =============================
// MOSTRAR / OCULTAR CONTRASEÑA
// =============================
togglePwdBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
        const input = btn.previousElementSibling;
        input.type = input.type === 'password' ? 'text' : 'password';
        btn.textContent = input.type === 'password' ? '👁' : '🙈';
    });
});

// =============================
// REGISTRO DE USUARIO
// =============================
if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('signupEmail').value.trim();
        const pwd = document.getElementById('signupPassword').value;
        const pwd2 = document.getElementById('signupPassword2').value;

        if (pwd !== pwd2) {
        signupError.textContent = ' Las contraseñas no coinciden.';
        return;
        }

        const admins = AuthService.getAdmins();
        if (admins.some((a) => a.email === email)) {
        signupError.textContent = ' Ya existe una cuenta con ese email.';
        return;
        }

        AuthService.addAdmin(email, pwd);
        signupForm.reset();
        signupError.textContent = '';
        loginError.textContent = ' Cuenta creada. Inicia sesión.';
        document.querySelector('.login-card').classList.remove('show-signup');
    });
}

// =============================
// LOGIN DE USUARIO
// =============================
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value.trim();
        const pwd = document.getElementById('loginPassword').value;
        const user = AuthService.validate(email, pwd);

        if (user) {
        localStorage.setItem('loggedInAdmin', JSON.stringify(user));
        loginError.textContent = '';
        alert('✅ Bienvenido, acceso correcto');
        // Aquí puedes redirigir al dashboard
        // window.location.href = 'dashboard.html';
        loginModal.classList.remove('show');
        } else {
        loginError.textContent = '❌ Email o contraseña incorrectos.';
        loginForm.classList.add('shake');
        setTimeout(() => loginForm.classList.remove('shake'), 600);
        }
    });
}

// =============================
// CAMBIO ENTRE LOGIN / SIGNUP
// =============================
const toSignupLink = document.getElementById('toSignupLink');
const toLoginLink = document.getElementById('toLoginLink');

if (toSignupLink) {
    toSignupLink.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelector('.login-card').classList.add('show-signup');
        loginError.textContent = '';
    });
    }
    if (toLoginLink) {
    toLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelector('.login-card').classList.remove('show-signup');
        signupError.textContent = '';
    });
}
