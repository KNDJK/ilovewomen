// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBG3v9FYhhbrggkdrvQ17mUH04FjC3wfNc",
    authDomain: "chatapp-web-9ea82.firebaseapp.com",
    projectId: "chatapp-web-9ea82",
    storageBucket: "chatapp-web-9ea82.appspot.com",
    messagingSenderId: "394476250181",
    appId: "1:394476250181:web:9de7b9c9d08b27977f6f2c",
    measurementId: "G-PL3230HHZ9"
};

// Inicializa Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Elementos del DOM
const loginScreen = document.getElementById('login-screen');
const registerScreen = document.getElementById('register-screen');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');

// Mostrar pantalla de registro
document.getElementById('register-link').addEventListener('click', (e) => {
    e.preventDefault();
    loginScreen.classList.add('hidden');
    registerScreen.classList.remove('hidden');
});

// Mostrar pantalla de inicio de sesión
document.getElementById('login-link').addEventListener('click', (e) => {
    e.preventDefault();
    registerScreen.classList.add('hidden');
    loginScreen.classList.remove('hidden');
});

// Registro de usuario
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('register-username').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;

    // Validaciones
    if (password !== confirmPassword) {
        alert('Las contraseñas no coinciden.');
        return;
    }

    try {
        // Crear usuario en Firebase Authentication
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;

        // Guardar datos del usuario en Firestore
        await db.collection('users').doc(user.uid).set({
            username,
            email
        });

        alert('Registro exitoso. Ahora puedes iniciar sesión.');
        registerScreen.classList.add('hidden');
        loginScreen.classList.remove('hidden');
    } catch (error) {
        alert(`Error: ${error.message}`);
    }
});

// Inicio de sesión
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        const user = userCredential.user;

        // Redirigir a la página del chat
        window.location.href = "chat.html";
    } catch (error) {
        alert(`Error: ${error.message}`);
    }
});
