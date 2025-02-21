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
const registerForm = document.getElementById('register-form');

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
    const profilePic = document.getElementById('profile-pic').files[0];

    // Validaciones
    if (password !== confirmPassword) {
        alert('Las contraseñas no coinciden.');
        return;
    }

    try {
        // Crear usuario en Firebase Authentication
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;

        // Subir la imagen a Cloudinary
        const profilePicUrl = await uploadImageToCloudinary(profilePic);

        // Guardar datos del usuario en Firestore
        await db.collection('users').doc(user.uid).set({
            username,
            email,
            profilePicUrl
        });

        alert('Registro exitoso. Ahora puedes iniciar sesión.');
        window.location.href = "index.html"; // Redirige a la página de inicio de sesión
    } catch (error) {
        alert(`Error: ${error.message}`);
    }
});
