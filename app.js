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

// Configuración de Cloudinary
const cloudinaryConfig = {
    cloudName: 'dob3xhs1b', // Tu Cloud Name
    apiKey: '332996559628532', // Tu API Key
    apiSecret: 'm211_OEwPYtfg_u8do-6p8KTr2U', // Tu API Secret (solo para backend)
    uploadPreset: 'ml_default' // Puedes crear un Upload Preset en Cloudinary
};

// Elementos del DOM
const loginScreen = document.getElementById('login-screen');
const registerScreen = document.getElementById('register-screen');
const profileScreen = document.getElementById('profile-screen');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const logoutButton = document.getElementById('logout-button');
const profileImage = document.getElementById('profile-image');
const profileUsername = document.getElementById('profile-username');

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

// Función para subir la imagen a Cloudinary
const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', cloudinaryConfig.uploadPreset); // Usa tu Upload Preset
    formData.append('api_key', cloudinaryConfig.apiKey); // Agrega tu API Key

    const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`,
        {
            method: 'POST',
            body: formData
        }
    );
    const data = await response.json();
    return data.secure_url; // URL de la imagen subida
};

// Registro de usuario
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('register-username').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;

    // Validar que las contraseñas coincidan
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

        alert('Registro exitoso. Inicia sesión.');
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

        // Obtener datos del usuario desde Firestore
        const userDoc = await db.collection('users').doc(user.uid).get();
        if (userDoc.exists) {
            const userData = userDoc.data();
            profileUsername.textContent = userData.username;
            loginScreen.classList.add('hidden');
            profileScreen.classList.remove('hidden');
        }
    } catch (error) {
        alert(`Error: ${error.message}`);
    }
});

// Cerrar sesión
logoutButton.addEventListener('click', () => {
    auth.signOut().then(() => {
        profileScreen.classList.add('hidden');
        loginScreen.classList.remove('hidden');
    });
});

// Verificar si el usuario ya está autenticado
auth.onAuthStateChanged((user) => {
    if (user) {
        db.collection('users').doc(user.uid).get().then((doc) => {
            if (doc.exists) {
                const userData = doc.data();
                profileUsername.textContent = userData.username;
                loginScreen.classList.add('hidden');
                profileScreen.classList.remove('hidden');
            }
        });
    }
});
