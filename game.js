/* ===================== GAME LOGIC ===================== */

// Game variables
let canvas;
let ctx;
let gameLoop;
let snake = [];
let food = {};
let direction = { x: 1, y: 0 };
let nextDirection = { x: 1, y: 0 };
let score = 0;
let highScore = 0;
let gameSpeed = 100;
let isGameRunning = false;

// Initialize game
function initGame() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');

    // Initialize audio
    if (!initAudio()) {
        console.log("Game will run without audio");
    }

    // Set up controls
    setupControls();

    // Load high score
    loadHighScore();
}

// Load high score from localStorage
function loadHighScore() {
    highScore = localStorage.getItem('snakeHighScore') || 0;
    updateHighScoreDisplay();
}

// Save high score to localStorage
function saveHighScore() {
    localStorage.setItem('snakeHighScore', highScore);
}

// Update high score display
function updateHighScoreDisplay() {
    const highScoreDisplay = document.getElementById('highScoreDisplay');
    const gameHighScore = document.getElementById('gameHighScore');

    if (highScoreDisplay) highScoreDisplay.textContent = highScore;
    if (gameHighScore) gameHighScore.textContent = highScore;
}

// Start game
function startGame(speed) {
    playClickSound();

    gameSpeed = speed;
    isGameRunning = true;

    // Reset game state
    snake = [{ x: 10, y: 10 }];
    direction = { x: 1, y: 0 };
    nextDirection = { x: 1, y: 0 };
    score = 0;

    // Generate first food
    generateFood();

    // Update displays
    updateScoreDisplay();
    updateHighScoreDisplay();

    // Start game loop
    clearInterval(gameLoop);
    gameLoop = setInterval(gameUpdate, gameSpeed);

    // Start background music
    playBackgroundMusic();

    // Show game screen
    showScreen('gameScreen');
}

// Game update loop
function gameUpdate() {
    // Update direction
    direction = nextDirection;

    // Calculate new head position
    const head = {
        x: snake[0].x + direction.x,
        y: snake[0].y + direction.y
    };

    // Check collision with walls
    if (head.x < 0 || head.y < 0 || head.x >= 20 || head.y >= 20) {
        gameOver();
        return;
    }

    // Check collision with self
    for (let segment of snake) {
        if (segment.x === head.x && segment.y === head.y) {
            gameOver();
            return;
        }
    }

    // Add new head
    snake.unshift(head);

    // Check food collision
    if (head.x === food.x && head.y === food.y) {
        // Increase score
        score++;
        updateScoreDisplay();

        // Play eat sound
        playEatSound();

        // Generate new food
        generateFood();
    } else {
        // Remove tail if no food eaten
        snake.pop();
    }

    // Draw game
    drawGame();
}

// Game over
function gameOver() {
    clearInterval(gameLoop);
    isGameRunning = false;

    // Stop background music
    stopBackgroundMusic();

    // Play game over sound
    playGameOverSound();

    // Check for new high score
    if (score > highScore) {
        highScore = score;
        saveHighScore();
        updateHighScoreDisplay();

        // Show new high score message
        const msg = document.getElementById('newHighScoreMsg');
        if (msg) msg.classList.remove('hidden');

        // Play high score sound
        playHighScoreSound();
    } else {
        const msg = document.getElementById('newHighScoreMsg');
        if (msg) msg.classList.add('hidden');
    }

    // Update final score
    const finalScoreElement = document.getElementById('finalScore');
    if (finalScoreElement) {
        finalScoreElement.textContent = score;
    }

    // Show game over screen
    showScreen('gameOverScreen');
}

// Play again
function playAgain() {
    playClickSound();
    startGame(gameSpeed);
}

// Exit game
function exitGame() {
    playClickSound();
    clearInterval(gameLoop);
    isGameRunning = false;
    stopBackgroundMusic();
    showScreen('homeScreen');
}

// Generate food at random position
function generateFood() {
    let newFood;
    let validPosition = false;

    while (!validPosition) {
        newFood = {
            x: Math.floor(Math.random() * 20),
            y: Math.floor(Math.random() * 20)
        };

        // Check if food is not on snake
        validPosition = true;
        for (let segment of snake) {
            if (segment.x === newFood.x && segment.y === newFood.y) {
                validPosition = false;
                break;
            }
        }
    }

    food = newFood;
}

// Update score display
function updateScoreDisplay() {
    const currentScore = document.getElementById('currentScore');
    if (currentScore) {
        currentScore.textContent = score;
    }
}

// Draw game
function drawGame() {
    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid (optional)
    ctx.strokeStyle = 'rgba(0, 247, 255, 0.1)';
    ctx.lineWidth = 1;

    // Draw food
    ctx.fillStyle = '#ff00ff';
    ctx.beginPath();
    ctx.arc(
        food.x * 20 + 10,
        food.y * 20 + 10,
        8, 0, Math.PI * 2
    );
    ctx.fill();

    // Draw snake
    snake.forEach((segment, index) => {
        if (index === 0) {
            // Head
            ctx.fillStyle = '#00f7ff';
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#00f7ff';
        } else {
            // Body
            const alpha = 1 - (index / snake.length) * 0.5;
            ctx.fillStyle = `rgba(0, 247, 255, ${alpha})`;
            ctx.shadowBlur = 5;
            ctx.shadowColor = 'rgba(0, 247, 255, 0.5)';
        }

        ctx.beginPath();
        ctx.arc(
            segment.x * 20 + 10,
            segment.y * 20 + 10,
            index === 0 ? 9 : 7,
            0, Math.PI * 2
        );
        ctx.fill();
    });

    ctx.shadowBlur = 0;
}

// Setup controls
function setupControls() {
    // Keyboard controls
    document.addEventListener('keydown', (e) => {
        if (!isGameRunning) return;

        e.preventDefault();

        switch(e.key) {
            case 'ArrowUp':
                if (direction.y !== 1) nextDirection = { x: 0, y: -1 };
                playClickSound();
                break;
            case 'ArrowDown':
                if (direction.y !== -1) nextDirection = { x: 0, y: 1 };
                playClickSound();
                break;
            case 'ArrowLeft':
                if (direction.x !== 1) nextDirection = { x: -1, y: 0 };
                playClickSound();
                break;
            case 'ArrowRight':
                if (direction.x !== -1) nextDirection = { x: 1, y: 0 };
                playClickSound();
                break;
            case ' ':
                // Space to pause/resume
                if (isGameRunning) {
                    clearInterval(gameLoop);
                    isGameRunning = false;
                    stopBackgroundMusic();
                } else {
                    isGameRunning = true;
                    gameLoop = setInterval(gameUpdate, gameSpeed);
                    if (musicEnabled) playBackgroundMusic();
                }
                break;
        }
    });

    // Touch controls for mobile
    let touchStart = null;
    canvas.addEventListener('touchstart', (e) => {
        touchStart = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY
        };
        e.preventDefault();
    });

    canvas.addEventListener('touchend', (e) => {
        if (!touchStart || !isGameRunning) return;

        const touchEnd = {
            x: e.changedTouches[0].clientX,
            y: e.changedTouches[0].clientY
        };

        const dx = touchEnd.x - touchStart.x;
        const dy = touchEnd.y - touchStart.y;

        if (Math.abs(dx) > Math.abs(dy)) {
            // Horizontal swipe
            if (dx > 30 && direction.x !== -1) nextDirection = { x: 1, y: 0 };
            if (dx < -30 && direction.x !== 1) nextDirection = { x: -1, y: 0 };
        } else {
            // Vertical swipe
            if (dy > 30 && direction.y !== -1) nextDirection = { x: 0, y: 1 };
            if (dy < -30 && direction.y !== 1) nextDirection = { x: 0, y: -1 };
        }

        touchStart = null;
        playClickSound();
        e.preventDefault();
    });
}

// Export functions for HTML
window.startGame = startGame;
window.playAgain = playAgain;
window.exitGame = exitGame;
window.initGame = initGame;
window.loadHighScore = loadHighScore;