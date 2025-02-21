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
const chatBox = document.getElementById('chat-box');
const chatForm = document.getElementById('chat-form');
const messageInput = document.getElementById('message-input');

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
