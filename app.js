const authContainer = document.getElementById('auth-container');
const chatContainer = document.getElementById('chat-container');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const registerBtn = document.getElementById('register-btn');
const loginBtn = document.getElementById('login-btn');
const chatMessages = document.getElementById('chat-messages');
const messageInput = document.getElementById('message-input');
const imageInput = document.getElementById('image-input');
const sendBtn = document.getElementById('send-btn');

// Configuración de Cloudinary
const cloudinary = cloudinary.Cloudinary.new({ cloud_name: "dob3xhs1b" }); // Tu Cloud Name
const uploadPreset = "ChatApp Web"; // Tu Upload Preset

// Registro de usuario
registerBtn.addEventListener('click', () => {
    const email = emailInput.value;
    const password = passwordInput.value;
    auth.createUserWithEmailAndPassword(email, password)
        .then(() => {
            alert('Registro exitoso');
            showChat();
        })
        .catch(error => alert(error.message));
});

// Inicio de sesión
loginBtn.addEventListener('click', () => {
    const email = emailInput.value;
    const password = passwordInput.value;
    auth.signInWithEmailAndPassword(email, password)
        .then(() => {
            alert('Inicio de sesión exitoso');
            showChat();
        })
        .catch(error => alert(error.message));
});

// Mostrar chat después de autenticación
function showChat() {
    authContainer.classList.add('hidden');
    chatContainer.classList.remove('hidden');
    loadMessages();
}

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
    .then(data => data.secure_url)
    .catch(error => {
        console.error("Error al subir la imagen:", error);
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
        ${imageUrl ? `<img src="${imageUrl}" alt="Imagen" style="max-width: 200px;">` : ''}
    `;
    chatMessages.appendChild(messageElement);
}