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
const chatScreen = document.getElementById('chat-screen');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const chatForm = document.getElementById('chat-form');
const chatBox = document.getElementById('chat-box');
const messageInput = document.getElementById('message-input');
const logoutButton = document.getElementById('logout-button');

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

        // Mostrar pantalla del chat
        loginScreen.classList.add('hidden');
        chatScreen.classList.remove('hidden');
    } catch (error) {
        alert(`Error: ${error.message}`);
    }
});

// Escuchar mensajes en tiempo real
db.collection('messages').orderBy('timestamp').onSnapshot((snapshot) => {
    chatBox.innerHTML = ''; // Limpiar el chat
    snapshot.forEach((doc) => {
        const message = doc.data();
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');
        messageElement.innerHTML = `<strong>${message.username}:</strong> ${message.text}`;
        chatBox.appendChild(messageElement);
    });
    chatBox.scrollTop = chatBox.scrollHeight; // Desplazar al final
});

// Enviar mensaje
chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const messageText = messageInput.value.trim();

    if (messageText === '') return;

    const user = auth.currentUser;
    if (user) {
        const userDoc = await db.collection('users').doc(user.uid).get();
        const username = userDoc.data().username;

        await db.collection('messages').add({
            username,
            text: messageText,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });

        messageInput.value = ''; // Limpiar el campo de texto
    }
});

// Cerrar sesión
logoutButton.addEventListener('click', () => {
    auth.signOut().then(() => {
        chatScreen.classList.add('hidden');
        loginScreen.classList.remove('hidden');
    });
});

// Verificar si el usuario ya está autenticado
auth.onAuthStateChanged((user) => {
    if (user) {
        loginScreen.classList.add('hidden');
        chatScreen.classList.remove('hidden');
    } else {
        chatScreen.classList.add('hidden');
        loginScreen.classList.remove('hidden');
    }
});
