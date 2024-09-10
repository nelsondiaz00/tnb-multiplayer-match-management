document.addEventListener('DOMContentLoaded', () => {
    const gameRoomList = document.getElementById('game-room-list');
    const createGameButton = document.getElementById('create-game-button');

    // Función para mostrar las salas de partida con información adicional
    function displayGameRooms() {
        const gameRooms = JSON.parse(localStorage.getItem('gameRooms')) || [];

        gameRoomList.innerHTML = ''; // Limpia la lista sin borrar las partidas

        if (gameRooms.length === 0) {
            gameRoomList.innerHTML = '<p>No hay partidas disponibles en este momento.</p>';
        } else {
            // Crear secciones para salas públicas y privadas
            const publicSection = document.createElement('div');
            const privateSection = document.createElement('div');
            publicSection.innerHTML = '<h2>Salas Públicas</h2>';
            privateSection.innerHTML = '<h2>Salas Privadas</h2>';

            gameRooms.forEach(room => {
                const roomLink = document.createElement('a');
                roomLink.textContent = room.name || `Sala ${room.id}`;
                roomLink.classList.add('game-room-link');

                const roomInfo = document.createElement('div');
                roomInfo.innerHTML = `
                    <p><strong>Modo:</strong> ${room.mode}</p>
                    <p><strong>Apuesta:</strong> ${room.bet}</p>
                    <p><strong>Privacidad:</strong> ${room.privacy}</p>
                `;

                const listItem = document.createElement('div');
                listItem.classList.add('game-room-item');
                listItem.appendChild(roomLink);
                listItem.appendChild(roomInfo);

                if (room.privacy === 'public') {
                    roomLink.href = `../NBIII/jugar${getGameModeUrl(room.mode)}.html?sala=${room.id}`;
                    publicSection.appendChild(listItem);
                } else if (room.privacy === 'private') {
                    roomLink.href = '#';
                    roomLink.addEventListener('click', () => promptForPassword(room));
                    privateSection.appendChild(listItem);
                }
            });

            gameRoomList.appendChild(publicSection);
            gameRoomList.appendChild(privateSection);
        }
    }

    // Función para obtener la URL según el modo de juego
    function getGameModeUrl(mode) {
        switch (mode) {
            case '1v1':
                return '1v1';
            case '2v2':
                return '2v2';
            case '3v3':
                return '3v3';
            default:
                return '';
        }
    }

    // Función para solicitar una contraseña para las salas privadas
    function promptForPassword(room) {
        const password = prompt('Por favor, ingresa la contraseña para acceder a esta sala:');
        if (password === room.password) {
            window.location.href = `../NBIII/jugar${getGameModeUrl(room.mode)}.html?sala=${room.id}`;
        } else {
            alert('Contraseña incorrecta.');
        }
    }

    // Evento para crear una nueva partida
    createGameButton.addEventListener('click', () => {
        window.location.href = '../NBIII/createMatch.html';
    });

    // Inicializar la visualización de salas
    displayGameRooms();
});


