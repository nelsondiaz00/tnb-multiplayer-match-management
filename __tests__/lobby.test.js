const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

// Cargar el archivo HTML
const html = fs.readFileSync(path.resolve(__dirname, '../lobbyhtml.html'), 'utf8');

let dom;
let document;
let window;

beforeEach((done) => {
    dom = new JSDOM(html, { runScripts: 'dangerously', resources: "usable" });
    window = dom.window;
    document = window.document;
    global.window = window;
    global.document = document;

    // Esperar a que los scripts se carguen completamente
    const script = document.createElement('script');
    script.src = 'lobby/js/lobbyjavascript.js';
    script.onload = () => {
        // Esperar un breve tiempo para asegurar la inicialización
        setTimeout(() => {
            done();
        }, 100);
    };
    document.body.appendChild(script);
});

test('should display the correct hero image and enable/disable play button', () => {
    const heroImage = document.getElementById('hero-image');
    const playButton = document.querySelector('.play-button');
    const messageDisplay = document.getElementById('message-display');

    // Verificar la imagen inicial
    expect(heroImage.src).toContain('default.png');

    // Simular clic en el botón 'next-hero' (asegúrate de que el ID sea correcto)
    const nextHeroButton = document.getElementById('next-hero');
    expect(nextHeroButton).not.toBeNull();
    nextHeroButton.click();

    // Verificar el cambio de imagen
    expect(heroImage.src).toContain('fire.wizard.png');

    // Verificar el estado del botón
    expect(playButton.disabled).toBe(false); // O el estado esperado
    expect(messageDisplay.textContent).toBe('');
});

test('should handle play button click correctly', () => {
    const playButton = document.getElementById('play-button');
    const messageDisplay = document.getElementById('message-display');

    expect(playButton).not.toBeNull();

    // Simular selección de héroe
    const nextHeroButton = document.getElementById('next-hero');
    nextHeroButton.click();

    // Simular clic en el botón 'Play'
    playButton.click();

    // Verificar la redirección (ajusta según tu lógica)
    expect(window.location.href).toContain('SeleccionarPartida/Seleccionarhtml.html');
});

test('should display messages correctly in the chat', () => {
    const chatBox = document.getElementById('chat-box');
    const sendButton = document.getElementById('send-button');
    const messageInput = document.getElementById('message-input');

    expect(chatBox).not.toBeNull();
    expect(sendButton).not.toBeNull();
    expect(messageInput).not.toBeNull();

    // Enviar un mensaje válido
    messageInput.value = 'Hello World';
    sendButton.click();

    // Verificar que el mensaje se muestra en el chat
    expect(chatBox.innerHTML).toContain('User1: Hello World');
});
