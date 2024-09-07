const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

let dom;
let document;
let window;
let localStorageMock;

beforeEach((done) => {
    // Cargar el archivo HTML
    const html = fs.readFileSync(path.resolve(__dirname, '../SeleccionarPartida/Seleccionarhtml.html'), 'utf8');
    dom = new JSDOM(html, { runScripts: 'dangerously', resources: "usable" });
    window = dom.window;
    document = window.document;
    global.window = window;
    global.document = document;

    // Mock de localStorage
    localStorageMock = (() => {
        let store = {};
        return {
            getItem: (key) => store[key] || null,
            setItem: (key, value) => store[key] = value.toString(),
            clear: () => store = {},
            removeItem: (key) => delete store[key]
        };
    })();

    Object.defineProperty(window, 'localStorage', { value: localStorageMock });

    // Esperar a que los scripts se carguen completamente
    const script = document.createElement('script');
    script.src = './js/Seleccionarscript.js';
    script.onload = () => {
        setTimeout(() => {
            done();
        }, 100);
    };
    document.body.appendChild(script);
});

test('should display "No hay partidas disponibles" if no game rooms exist', () => {
    localStorageMock.setItem('gameRooms', JSON.stringify([]));

    const gameRoomList = document.getElementById('game-room-list');
    expect(gameRoomList.textContent).toContain('No hay partidas disponibles en este momento.');
});

test('should redirect to the correct URL when clicking on a game room', () => {
    const mockGameRooms = [
        { id: 389449, name: 'Sala 389449', mode: '2v2', bet: 50, privacy: 'public' }
    ];

    localStorageMock.setItem('gameRooms', JSON.stringify(mockGameRooms));

    // Se fuerza la llamada para que se ejecute la lógica de actualización de la UI
    window.document.dispatchEvent(new window.Event("DOMContentLoaded"));

    const roomLink = document.querySelector('.game-room-link');
    expect(roomLink).not.toBeNull();

    // Simular clic en la sala
    roomLink.click();
    expect(window.location.href).toContain('jugar2v2.html?sala=389449');
});

test('should redirect to create match page when clicking the create game button', () => {
    const createGameButton = document.getElementById('create-game-button');

    createGameButton.click();

    expect(window.location.href).toContain('../NBIII/createMatch.html');
});

