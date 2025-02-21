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
const db = firebase.firestore();

// Elementos del DOM
const nameModal = document.getElementById('name-modal');
const chatContainer = document.getElementById('chat-container');
const usernameInput = document.getElementById('username-input');
const startChatButton = document.getElementById('start-chat-button');
const chatBox = document.getElementById('chat-box');
const chatForm = document.getElementById('chat-form');
const messageInput = document.getElementById('message-input');

let username = '';

// Mostrar la ventana flotante al cargar la página
window.onload = () => {
    nameModal.style.display = 'flex';
};

// Comenzar el chat
startChatButton.addEventListener('click', () => {
    const inputValue = usernameInput.value.trim();
    if (inputValue === '') {
        alert('Por favor, ingresa un nombre válido.');
        return;
    }
    username = inputValue;
    nameModal.style.display = 'none';
    chatContainer.classList.remove('hidden');
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

    await db.collection('messages').add({
        username,
        text: messageText,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });

    messageInput.value = ''; // Limpiar el campo de texto
});

// Eliminar mensajes después de 24 horas
const deleteOldMessages = async () => {
    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const messages = await db.collection('messages')
        .where('timestamp', '<=', twentyFourHoursAgo)
        .get();

    messages.forEach((doc) => {
        doc.ref.delete();
    });
};

// Ejecutar la eliminación cada hora
setInterval(deleteOldMessages, 60 * 60 * 1000);
