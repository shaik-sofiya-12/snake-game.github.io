/* ===================== SCREEN MANAGEMENT ===================== */

// Show specific screen
function showScreen(screenId) {
    // Play click sound if audio is initialized
    if (window.playClickSound) {
        playClickSound();
    }

    // Hide all screens
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => {
        screen.classList.add('hidden');
    });

    // Show requested screen
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.remove('hidden');

        // If showing home screen, update high score
        if (screenId === 'homeScreen') {
            if (window.loadHighScore) {
                loadHighScore();
            }
        }

        // If showing game over screen, make sure new high score message is hidden
        if (screenId === 'gameOverScreen') {
            const msg = document.getElementById('newHighScoreMsg');
            if (msg) {
                msg.classList.add('hidden');
            }
        }
    }
}

// Export function for HTML
window.showScreen = showScreen;