// SCREEN MANAGEMENT - FIXED
const screens = {
  home: document.getElementById('home'),
  about: document.getElementById('about'),
  help: document.getElementById('help'),
  gameScreen: document.getElementById('gameScreen'),
  gameOverScreen: document.getElementById('gameOverScreen')
};

function showHome() {
  playClickSound();
  // Hide all screens
  Object.values(screens).forEach(screen => {
    if (screen) screen.classList.add('hidden');
  });
  // Show home screen
  if (screens.home) screens.home.classList.remove('hidden');
  updateHighScoreDisplay();
}

function showAbout() {
  playClickSound();
  // Hide all screens
  Object.values(screens).forEach(screen => {
    if (screen) screen.classList.add('hidden');
  });
  // Show about screen
  if (screens.about) screens.about.classList.remove('hidden');
}

function showHelp() {
  playClickSound();
  // Hide all screens
  Object.values(screens).forEach(screen => {
    if (screen) screen.classList.add('hidden');
  });
  // Show help screen
  if (screens.help) screens.help.classList.remove('hidden');
}

function exitGame() {
  playClickSound();
  clearInterval(gameLoopInterval);
  gameLoopInterval = null;
  stopBackgroundMusic();
  showHome();
}

function startGame(speed) {
  if (!audioContext) {
    if (!initAudio()) {
      alert("Audio not supported. Game will continue without sound.");
    }
  }

  playClickSound();

  lastSpeed = speed;
  // Hide all screens
  Object.values(screens).forEach(screen => {
    if (screen) screen.classList.add('hidden');
  });
  // Show game screen
  if (screens.gameScreen) screens.gameScreen.classList.remove('hidden');

  snake = [{ x: 10, y: 10 }];
  dir = { x: 1, y: 0 };
  nextDir = { x: 1, y: 0 };
  food = randomFood();
  score = 0;

  clearInterval(gameLoopInterval);
  gameLoopInterval = setInterval(gameLoop, speed);

  updateScore();

  if (musicEnabled) {
    playBackgroundMusic();
  }
}

function playAgain() {
  playClickSound();
  if (screens.gameOverScreen) screens.gameOverScreen.classList.add('hidden');
  startGame(lastSpeed);
}

function goHome() {
  playClickSound();
  if (screens.gameOverScreen) screens.gameOverScreen.classList.add('hidden');
  showHome();
}

// Controls
document.addEventListener('keydown', e => {
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
    e.preventDefault();

    if (e.key === 'ArrowUp' && dir.y !== 1) nextDir = { x: 0, y: -1 };
    if (e.key === 'ArrowDown' && dir.y !== -1) nextDir = { x: 0, y: 1 };
    if (e.key === 'ArrowLeft' && dir.x !== 1) nextDir = { x: -1, y: 0 };
    if (e.key === 'ArrowRight' && dir.x !== -1) nextDir = { x: 1, y: 0 };

    playClickSound();
  }

  if (e.code === 'Space') {
    e.preventDefault();
    if (gameLoopInterval) {
      clearInterval(gameLoopInterval);
      gameLoopInterval = null;
      stopBackgroundMusic();
    } else if (lastSpeed) {
      gameLoopInterval = setInterval(gameLoop, lastSpeed);
      if (musicEnabled) playBackgroundMusic();
    }
  }
});

function gameLoop() {
  dir = nextDir;
  const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

  if (head.x < 0 || head.y < 0 || head.x >= 20 || head.y >= 20 ||
      snake.some(s => s.x === head.x && s.y === head.y)) {
    gameOver();
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score++;
    food = randomFood();
    updateScore();
    playEatSound();
  } else {
    snake.pop();
  }

  draw();
}

function gameOver() {
  clearInterval(gameLoopInterval);
  gameLoopInterval = null;

  playGameOverSound();
  stopBackgroundMusic();

  const isNewHighScore = score > highScore;
  if (isNewHighScore) {
    highScore = score;
    localStorage.setItem('snakeHigh', highScore);
    playHighScoreSound();
    if (document.getElementById('newHighScore')) {
      document.getElementById('newHighScore').style.display = 'block';
    }
  }

  if (document.getElementById('finalScore')) {
    document.getElementById('finalScore').textContent = score;
  }
  updateHighScoreDisplay();

  // Hide game screen, show game over screen
  if (screens.gameScreen) screens.gameScreen.classList.add('hidden');
  if (screens.gameOverScreen) screens.gameOverScreen.classList.remove('hidden');
}

function draw() {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, 400, 400);

  // Add cosmic grid effect
  ctx.strokeStyle = 'rgba(0, 247, 255, 0.1)';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 20; i++) {
    ctx.beginPath();
    ctx.moveTo(i * CELL, 0);
    ctx.lineTo(i * CELL, 400);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, i * CELL);
    ctx.lineTo(400, i * CELL);
    ctx.stroke();
  }

  // Food with glow effect
  ctx.shadowColor = '#ff00ff';
  ctx.shadowBlur = 15;
  ctx.fillStyle = '#ff00ff';
  ctx.beginPath();
  ctx.arc(food.x * CELL + 10, food.y * CELL + 10, 9, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  // Snake with gradient
  snake.forEach((p, i) => {
    const isHead = i === 0;

    if (isHead) {
      ctx.shadowColor = '#00f7ff';
      ctx.shadowBlur = 20;
      ctx.fillStyle = '#00f7ff';
    } else {
      const alpha = 1 - (i / snake.length) * 0.5;
      ctx.fillStyle = `rgba(0, 247, 255, ${alpha})`;
      ctx.shadowBlur = 10;
    }

    ctx.beginPath();
    ctx.arc(p.x * CELL + 10, p.y * CELL + 10, isHead ? 11 : 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  });
}

function randomFood() {
  return {
    x: Math.floor(Math.random() * 20),
    y: Math.floor(Math.random() * 20)
  };
}

function updateScore() {
  if (document.getElementById('score')) {
    document.getElementById('score').textContent = score;
  }
  if (document.getElementById('highScore')) {
    document.getElementById('highScore').textContent = highScore;
  }
}

function updateHighScoreDisplay() {
  const high = localStorage.getItem('snakeHigh') || 0;
  if (document.getElementById('homeHigh')) {
    document.getElementById('homeHigh').textContent = high;
  }
  if (document.getElementById('highScore')) {
    document.getElementById('highScore').textContent = high;
  }
}

/* ===================== INITIALIZATION ===================== */
document.addEventListener('DOMContentLoaded', function() {
  createStars();
  createLasers();
  createParticles();

  updateHighScoreDisplay();
  initAudio();

  // Initialize all screens as hidden except home
  showHome();
});
