document.addEventListener('DOMContentLoaded', () => {
    const heroes = [
        { name: 'Fire Wizard', image: 'lobby/imagenes/heroes/fire.wizard.png', owned: true },
        { name: 'Ice Wizard', image: 'lobby/imagenes/heroes/ice.wizard.png', owned: true },
        { name: 'Machete Rogue', image: 'lobby/imagenes/heroes/machete.rogue.png', owned: true },
        { name: 'Poison Rogue', image: 'lobby/imagenes/heroes/poison.rogue.png', owned: false },
        { name: 'Tank Warrior', image: 'lobby/imagenes/heroes/tank.warrior.png', owned: false },
        { name: 'Weapon Warrior', image: 'lobby/imagenes/heroes/weapon.warrior.png', owned: false }
    ];

    const lockedImages = {
        'Fire Wizard': 'lobby/imagenes/fire.wizard-blanconegro.png',
        'Ice Wizard': 'lobby/imagenes/ice.wizard-blanconegro.png',
        'Machete Rogue': 'lobby/imagenes/machete.rogue-blanconegro.png',
        'Poison Rogue': 'lobby/imagenes/poison.rogue-blanconegro.png',
        'Tank Warrior': 'lobby/imagenes/tank.warrior-blanconegro.png',
        'Weapon Warrior': 'lobby/imagenes/weapon.warrior-blanconegro.png'
    };

    let currentHeroIndex = 0;
    const heroImageElement = document.getElementById('hero-image');
    const playButton = document.querySelector('.play-button');
    const messageDisplay = document.getElementById('message-display'); // Elemento para mostrar mensajes

    function updateHeroDisplay() {
        const currentHero = heroes[currentHeroIndex];
        if (currentHero.owned) {
            heroImageElement.src = currentHero.image;
            playButton.disabled = false; // Habilitar botón de jugar
            messageDisplay.textContent = ''; // Limpiar mensaje
        } else {
            heroImageElement.src = lockedImages[currentHero.name] || 'lobby/imagenes'; // Imagen base para héroes bloqueados
            playButton.disabled = true; // Deshabilitar botón de jugar
            messageDisplay.textContent = 'No tienes este héroe disponible. ¡Cómpralo para jugar!'; // Mostrar mensaje
        }
        heroImageElement.alt = currentHero.name;
    }

    document.getElementById('prev-hero').addEventListener('click', () => {
        currentHeroIndex = (currentHeroIndex - 1 + heroes.length) % heroes.length;
        updateHeroDisplay();
    });

    document.getElementById('next-hero').addEventListener('click', () => {
        currentHeroIndex = (currentHeroIndex + 1) % heroes.length;
        updateHeroDisplay();
    });

    playButton.addEventListener('click', () => {
        const selectedHero = heroes[currentHeroIndex];
        if (selectedHero.owned) {
            const heroData = {
                name: selectedHero.name,
                owned: selectedHero.owned
            };
            localStorage.setItem('selectedHero', JSON.stringify(heroData));
            window.location.href = 'SeleccionarPartida/Seleccionarhtml.html';
        } else {
            // Mostrar mensaje de error si el héroe está bloqueado
            messageDisplay.textContent = 'No tienes este héroe disponible. ¡Cómpralo para jugar!';
        }
    });

    // Cargar mensajes del almacenamiento local
    const loadMessages = () => {
        const storedMessages = localStorage.getItem('messageStack');
        return storedMessages ? JSON.parse(storedMessages) : [];
    };

    // Guardar mensajes en el almacenamiento local
    const saveMessages = (messages) => {
        localStorage.setItem('messageStack', JSON.stringify(messages));
    };

    let messageStack = loadMessages(); // Inicializar la pila de mensajes
    const chatBox = document.getElementById('chat-box'); // Elemento del chat

    // Mostrar mensajes en el chat
    const displayMessages = () => {
        chatBox.innerHTML = ''; // Limpiar el chat
        messageStack.forEach(message => {
            const newMessage = document.createElement('p');
            newMessage.textContent = `User1: ${message}`; // Prefijo de usuario, modificar si es necesario
            chatBox.appendChild(newMessage);
        });

        chatBox.scrollTop = chatBox.scrollHeight; // Desplazarse hacia abajo
    };

    // Generar variaciones de palabras prohibidas
    const generateVariations = (word) => {
        const variations = [];
        const replacements = {
            'a': ['4'], 
            'e': ['3'], 
            'i': ['1'], 
            'o': ['0'], 
            's': ['5', '$'], 
            't': ['7'], 
            'l': ['|', '1']
        };

        const addVariations = (baseWord, replacementDict) => {
            for (const [key, values] of Object.entries(replacementDict)) {
                for (const value of values) {
                    const newWord = baseWord.replace(new RegExp(key, 'g'), value);
                    if (!variations.includes(newWord)) {
                        variations.push(newWord);
                        addVariations(newWord, replacementDict);
                    }
                }
            }
        };

        addVariations(word.toLowerCase(), replacements);
        return variations;
    };

    // Lista de palabras groseras en inglés y español
    const forbiddenWords = [
        "HIJUEPUTA", "BOBO", "TRIPLEHIJUEPUTA", "MAMA HUEVO", "ESTÚPIDO", "IMBÉCIL", "PENDEJO", "CARECHIMBA", 
        "MALPARIDO", "GONORREA", "PIROBO", "GUEVÓN", "ZORRA", "PERRA", "MARICA", "CAREVERGA", "CARECULO", 
        "CULICAGADO", "MOCOSO", "LAMBÓN", "CRETINO", "IDIOTA", "GILIPOLLAS", "CHIMBA", "GUEVADA", "CABRÓN", 
        "BASTARDO", "BABOSO", "CULO ROTO", "SAPO", "SARDINO", "VAGO", "PATÁN", "TARADO", "MALNACIDO", 
        "CAREMONDÁ", "VIEJUEPUTA", "MIERDA", "MUÉRGANO", "DESGRACIADO", "BASTARDA", "FORRO", "MALDITO", 
        "MALPARIDA", "PUTA", "MEQUETREFE", "MISERABLE", "INFELIZ", "ASQUEROSO", "LAGARTO",
        "FUCK YOU", "IDIOT", "BASTARD", "ASSHOLE", "STUPID", "DUMBASS", "BITCH", "SON OF A BITCH", "DICKHEAD", 
        "JERK", "MORON", "PRICK", "SHITHEAD", "CUNT", "WANKER", "FAGGOT", "TWAT", "PISS OFF", "WANK", 
        "BOLLOCKS", "CUNT", "COCK", "GOBSHITE", "KNOBHEAD", "TOSSER", "ARSEHOLE", "BOLLOCKS", "MOTHERFUCKER", 
        "BEEFY", "TITS", "CRAP", "JACKASS", "MOTHERFUCKING"
    ];

    const isForbiddenMessage = (message) => {
        const lowerCaseMessage = message.toUpperCase();
        return forbiddenWords.some(word => lowerCaseMessage.includes(word));
    };

    // Enviar mensaje
    document.getElementById('send-button').addEventListener('click', () => {
        const messageInput = document.getElementById('message-input');
        const newMessage = messageInput.value.trim();

        if (newMessage && !isForbiddenMessage(newMessage)) {
            messageStack.push(newMessage);
            saveMessages(messageStack);
            displayMessages();
            messageInput.value = '';
        } else if (isForbiddenMessage(newMessage)) {
            alert("El mensaje contiene palabras prohibidas.");
        }
    });

    displayMessages();
    updateHeroDisplay();
});
