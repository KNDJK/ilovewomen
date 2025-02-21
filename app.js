const authContainer = document.getElementById('auth-container');
const chatContainer = document.getElementById('chat-container');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const registerBtn = document.getElementById('register-btn');
const loginBtn = document.getElementById('login-btn');
const authMessage = document.getElementById('auth-message');
const chatMessages = document.getElementById('chat-messages');
const messageInput = document.getElementById('message-input');
const imageInput = document.getElementById('image-input');
const sendBtn = document.getElementById('send-btn');
const logoutBtn = document.getElementById('logout-btn');

// Configuración de Cloudinary
const cloudinary = cloudinary.Cloudinary.new({ cloud_name: "dob3xhs1b" }); // Tu Cloud Name
const uploadPreset = "ChatApp Web"; // Tu Upload Preset

// Mostrar mensaje de estado
function showAuthMessage(message, isError = false) {
    authMessage.textContent = message;
    authMessage.classList.remove('hidden');
    authMessage.className = isError ? 'error' : '';
}

// Registro de usuario
registerBtn.addEventListener('click', () => {
    console.log("Intentando registrar usuario..."); // Mensaje de depuración
    const email = emailInput.value;
    const password = passwordInput.value;

    if (!email || !password) {
        console.log("Correo o contraseña vacíos"); // Mensaje de depuración
        showAuthMessage("Por favor, ingresa un correo electrónico y una contraseña.", true);
        return;
    }

    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            console.log("Registro exitoso:", userCredential.user); // Mensaje de depuración
            showAuthMessage("Registro exitoso. Redirigiendo al chat...");
            setTimeout(() => {
                authContainer.classList.add('hidden');
                chatContainer.classList.remove('hidden');
                loadMessages();
            }, 2000);
        })
        .catch((error) => {
            console.error("Error durante el registro:", error); // Mensaje de depuración
            showAuthMessage(`Error durante el registro: ${error.message}`, true);
        });
});

// Inicio de sesión
loginBtn.addEventListener('click', () => {
    console.log("Intentando iniciar sesión..."); // Mensaje de depuración
    const email = emailInput.value;
    const password = passwordInput.value;

    if (!email || !password) {
        console.log("Correo o contraseña vacíos"); // Mensaje de depuración
        showAuthMessage("Por favor, ingresa un correo electrónico y una contraseña.", true);
        return;
    }

    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            console.log("Inicio de sesión exitoso:", userCredential.user); // Mensaje de depuración
            showAuthMessage("Inicio de sesión exitoso. Redirigiendo al chat...");
            setTimeout(() => {
                authContainer.classList.add('hidden');
                chatContainer.classList.remove('hidden');
                loadMessages();
            }, 2000);
        })
        .catch((error) => {
            console.error("Error durante el inicio de sesión:", error); // Mensaje de depuración
            showAuthMessage(`Error durante el inicio de sesión: ${error.message}`, true);
        });
});

// Cerrar sesión
logoutBtn.addEventListener('click', () => {
    auth.signOut().then(() => {
        chatContainer.classList.add('hidden');
        authContainer.classList.remove('hidden');
    });
});

// Cargar mensajes
function loadMessages() {
    db.collection('messages').orderBy('timestamp').onSnapshot(snapshot => {
        chatMessages.innerHTML = '';
        snapshot.forEach(doc => {
            const message = doc.data();
            addMessageToChat(message.text, message.imageUrl);
        });
        chatMessages.scrollTop = chatMessages.scrollHeight;
    });
}

// Enviar mensaje
sendBtn.addEventListener('click', () => {
    const text = messageInput.value;
    const file = imageInput.files[0];

    if (text || file) {
        if (file) {
            uploadImageToCloudinary(file).then(imageUrl => {
                sendMessage(text, imageUrl);
            });
        } else {
            sendMessage(text);
        }
    }
});

// Subir imagen a Cloudinary
function uploadImageToCloudinary(file) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);

    return fetch(`https://api.cloudinary.com/v1_1/${cloudinary.config().cloud_name}/image/upload`, {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        console.log("Imagen subida a Cloudinary:", data.secure_url); // Mensaje de depuración
        return data.secure_url;
    })
    .catch(error => {
        console.error("Error al subir la imagen:", error); // Mensaje de depuración
        return null;
    });
}

// Enviar mensaje a Firestore
function sendMessage(text, imageUrl = null) {
    const user = auth.currentUser.email;
    db.collection('messages').add({
        user,
        text,
        imageUrl,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
    messageInput.value = '';
    imageInput.value = '';
}

// Mostrar mensaje en el chat
function addMessageToChat(text, imageUrl = null) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    messageElement.innerHTML = `
        <strong>${auth.currentUser.email}:</strong> ${text}
        ${imageUrl ? `<img src="${imageUrl}" alt="Imagen">` : ''}
    `;
    chatMessages.appendChild(messageElement);
}
