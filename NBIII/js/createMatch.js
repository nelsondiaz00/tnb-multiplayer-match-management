document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.game-settings');
    const createButton = document.querySelector('.create-button');
    const privacyOptions = document.querySelectorAll('input[name="privacy-option"]');
    const passwordInput = document.querySelector('input[name="password"]');

    // Controlar el cambio en la opción de privacidad
    privacyOptions.forEach(option => {
        option.addEventListener('change', handlePrivacyChange);
    });

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const gameMode = document.querySelector('input[name="game-mode"]:checked');
        const betOption = document.querySelector('input[name="bet-option"]:checked');
        const privacyOption = document.querySelector('input[name="privacy-option"]:checked');
        const password = passwordInput.value;

        // Verificar si todas las opciones están seleccionadas
        if (!gameMode || !betOption || !privacyOption) {
            showAlert('Por favor, selecciona todas las opciones antes de crear la partida.');
            return;
        }

        // Validar contraseña si la opción es privada
        if (privacyOption.id === 'private' && !password) {
            showAlert('Por favor, ingresa una contraseña para partidas privadas.');
            return;
        }

        // Creando el objeto JSON con los valores seleccionados
        const gameConfig = {
            id: generateRandomId(), // Genera un ID aleatorio
            mode: gameMode ? gameMode.id : null,
            bet: betOption ? betOption.id : null,
            privacy: privacyOption ? privacyOption.id : null,
            password: privacyOption.id === 'private' ? password : null // Solo para partidas privadas
        };

        // Guardar la configuración de la partida en el almacenamiento local
        saveGameConfig(gameConfig);

        // Redirigir a la página de selección de partidas
        window.location.href = '../SeleccionarPartida/Seleccionarhtml.html';
    });
    passwordInput.disabled = true;
    // Función para manejar el cambio en la opción de privacidad
    function handlePrivacyChange() {
        const selectedPrivacy = document.querySelector('input[name="privacy-option"]:checked');
        if (selectedPrivacy) {
            
            if (selectedPrivacy.id === 'public') {
                passwordInput.disabled = true; // Deshabilitar el campo de contraseña para partidas públicas
                passwordInput.value = ''; // Limpiar el campo de contraseña
            } else {
                passwordInput.disabled = false; // Habilitar el campo de contraseña para partidas privadas
            }
        }
    }

    // Función para mostrar la alerta personalizada
    function showAlert(message) {
        const alertBox = document.createElement('div');
        alertBox.textContent = message;
        alertBox.style.position = 'fixed';
        alertBox.style.top = '20px';
        alertBox.style.right = '20px';
        alertBox.style.padding = '15px';
        alertBox.style.backgroundColor = '#ff4c4c';
        alertBox.style.color = '#fff';
        alertBox.style.fontFamily = 'T323';
        alertBox.style.fontSize = '1.2rem';
        alertBox.style.boxShadow = '6px 6px 0px 0px #583B67';
        alertBox.style.zIndex = '1000';

        document.body.appendChild(alertBox);

        // Eliminar la alerta después de 3 segundos
        setTimeout(() => {
            alertBox.remove();
        }, 3000);
    }

    // Función para generar un ID aleatorio
    function generateRandomId() {
        return Math.floor(Math.random() * 1000000); // Genera un número aleatorio de 6 dígitos
    }

    // Función para guardar la configuración de la partida en el almacenamiento local
    function saveGameConfig(gameConfig) {
        // Obtener la lista de partidas existentes
        const existingGames = JSON.parse(localStorage.getItem('gameRooms')) || [];
        // Agregar la nueva partida a la lista
        existingGames.push(gameConfig);
        // Guardar la lista actualizada en el almacenamiento local
        localStorage.setItem('gameRooms', JSON.stringify(existingGames));
    }

    // Inicializar el estado del campo de contraseña basado en la opción de privacidad seleccionada
    handlePrivacyChange();
});

