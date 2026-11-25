const COLORS = [
    "#e74c3c",
    "#3498db",
    "#2ecc71",
    "#f1c40f",
    "#9b59b6",
    "#e67e22"
];

const GAME_DURATION = 30;
const FLIP_DELAY = 700;

const gameContainer = document.getElementById("game-container");
const scoreElement = document.getElementById("score");
const timerElement = document.getElementById("timer");
const startButton = document.getElementById("start-button");
const gameStatus = document.getElementById("game-status");

const gameState = {
    score: 0,
    timeLeft: GAME_DURATION,
    matchedPairs: 0,
    selectedCards: [],
    isProcessing: false,
    gameActive: false,
    timerId: null,
    flipTimeoutId: null
};

/**
 * Mélange un tableau avec l'algorithme Fisher-Yates.
 * Retourne une nouvelle copie sans modifier le tableau original.
 */
function shuffleArray(array) {
    const shuffled = [...array];

    for (let i = shuffled.length - 1; i > 0; i--) {
        const randomIndex = Math.floor(Math.random() * (i + 1));

        [shuffled[i], shuffled[randomIndex]] =
            [shuffled[randomIndex], shuffled[i]];
    }

    return shuffled;
}

/**
 * Met à jour le score affiché.
 */
function updateScore() {
    scoreElement.textContent = gameState.score;
}

/**
 * Met à jour le temps affiché.
 */
function updateTimer() {
    timerElement.textContent = gameState.timeLeft;
}

/**
 * Arrête le compte à rebours.
 */
function stopTimer() {
    if (gameState.timerId !== null) {
        clearInterval(gameState.timerId);
        gameState.timerId = null;
    }
}

/**
 * Nettoie le délai utilisé pour retourner les cartes.
 */
function clearFlipTimeout() {
    if (gameState.flipTimeoutId !== null) {
        clearTimeout(gameState.flipTimeoutId);
        gameState.flipTimeoutId = null;
    }
}

/**
 * Crée les cartes du jeu.
 */
function createCards() {
    gameContainer.innerHTML = "";

    const cardColors = shuffleArray([...COLORS, ...COLORS]);

    cardColors.forEach((color, index) => {
        const card = document.createElement("button");

        card.type = "button";
        card.classList.add("card");
        card.dataset.color = color;
        card.dataset.index = index;

        card.setAttribute("aria-label", `Card ${index + 1}, hidden`);
        card.setAttribute("aria-pressed", "false");

        card.addEventListener("click", handleCardClick);

        gameContainer.appendChild(card);
    });
}

/**
 * Retourne une carte et affiche sa couleur.
 */
function revealCard(card) {
    card.style.backgroundColor = card.dataset.color;
    card.classList.add("revealed");

    card.setAttribute("aria-label", `Revealed card, ${card.dataset.color}`);
    card.setAttribute("aria-pressed", "true");
}

/**
 * Cache une carte.
 */
function hideCard(card) {
    card.style.backgroundColor = "";
    card.classList.remove("revealed");

    card.setAttribute(
        "aria-label",
        `Card ${Number(card.dataset.index) + 1}, hidden`
    );

    card.setAttribute("aria-pressed", "false");
}

/**
 * Vérifie si les deux cartes sélectionnées correspondent.
 */
function checkMatch() {
    const [firstCard, secondCard] = gameState.selectedCards;

    if (firstCard.dataset.color === secondCard.dataset.color) {
        firstCard.classList.add("matched");
        secondCard.classList.add("matched");

        firstCard.disabled = true;
        secondCard.disabled = true;

        gameState.score += 10;
        gameState.matchedPairs++;

        updateScore();

        gameState.selectedCards = [];
        gameState.isProcessing = false;

        if (gameState.matchedPairs === COLORS.length) {
            endGame(true);
        }

        return;
    }

    gameState.isProcessing = true;

    gameState.flipTimeoutId = setTimeout(() => {
        hideCard(firstCard);
        hideCard(secondCard);

        gameState.selectedCards = [];
        gameState.isProcessing = false;
        gameState.flipTimeoutId = null;
    }, FLIP_DELAY);
}

/**
 * Gère le clic sur une carte.
 */
function handleCardClick(event) {
    const clickedCard = event.currentTarget;

    // Empêche les interactions après la fin du jeu.
    if (!gameState.gameActive) {
        return;
    }

    // Empêche de sélectionner une troisième carte.
    if (gameState.isProcessing) {
        return;
    }

    // Empêche de sélectionner une carte déjà révélée ou appariée.
    if (
        clickedCard.classList.contains("revealed") ||
        clickedCard.classList.contains("matched")
    ) {
        return;
    }

    // Révèle la carte sélectionnée.
    revealCard(clickedCard);

    gameState.selectedCards.push(clickedCard);

    // Vérifie uniquement lorsque deux cartes sont sélectionnées.
    if (gameState.selectedCards.length === 2) {
        checkMatch();
    }
}

/**
 * Démarre le compte à rebours.
 */
function startGameTimer() {
    stopTimer();

    gameState.timerId = setInterval(() => {
        if (!gameState.gameActive) {
            stopTimer();
            return;
        }

        gameState.timeLeft--;

        updateTimer();

        if (gameState.timeLeft <= 0) {
            endGame(false);
        }
    }, 1000);
}

/**
 * Termine la partie.
 *
 * @param {boolean} won - Indique si le joueur a gagné.
 */
function endGame(won) {
    gameState.gameActive = false;
    gameState.isProcessing = false;
    gameState.selectedCards = [];

    stopTimer();
    clearFlipTimeout();

    // Désactive toutes les cartes.
    const cards = gameContainer.querySelectorAll(".card");

    cards.forEach(card => {
        card.disabled = true;
    });

    if (won) {
        gameStatus.textContent =
            `Congratulations! You won with ${gameState.score} points.`;
    } else {
        gameStatus.textContent =
            `Game over! Your final score is ${gameState.score}.`;
    }

    startButton.textContent = "Play Again";
}

/**
 * Initialise et démarre une nouvelle partie.
 */
function startGame() {
    // Nettoyage de l'ancienne partie.
    stopTimer();
    clearFlipTimeout();

    // Réinitialisation de l'état.
    gameState.score = 0;
    gameState.timeLeft = GAME_DURATION;
    gameState.matchedPairs = 0;
    gameState.selectedCards = [];
    gameState.isProcessing = false;
    gameState.gameActive = true;

    // Mise à jour de l'interface.
    updateScore();
    updateTimer();

    gameStatus.textContent = "";
    startButton.textContent = "Restart Game";

    // Génération des cartes.
    createCards();

    // Démarrage du compte à rebours.
    startGameTimer();
}

// Événement de démarrage ou de redémarrage.
startButton.addEventListener("click", startGame);

// Affichage initial.
updateScore();
updateTimer();
gameStatus.textContent = "Press Start Game to begin.";