const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startButton');
const resetButton = document.getElementById('resetButton');
const scoreDisplay = document.getElementById('scoreDisplay');
const bestScoreDisplay = document.getElementById('bestScoreDisplay');

// Game variables
let bird, pipes, score, gameLoop, bestScore;
const GAME_STATE = {
    READY: 'ready',
    PLAYING: 'playing',
    GAME_OVER: 'game_over'
};
let currentState = GAME_STATE.READY;

// Bird properties
const BIRD_RADIUS = 20;
const GRAVITY = 0.5;
const JUMP_STRENGTH = 6;

// Pipe properties
const PIPE_WIDTH = 50;
const PIPE_GAP = 200;
const PIPE_SPEED = 2;

// Initialize game state
function initGame() {
    // Reset bird position
    bird = {
        x: canvas.width / 4,
        y: canvas.height / 2,
        velocity: 0
    };

    // Reset pipes
    pipes = [];

    // Reset score
    score = 0;
    scoreDisplay.textContent = score;

    // Ensure best score is saved
    bestScore = Math.max(bestScore || 0, score);
    bestScoreDisplay.textContent = bestScore;

    // Reset game state
    currentState = GAME_STATE.READY;
}

// Draw bird
function drawBird() {
    ctx.fillStyle = 'yellow';
    ctx.beginPath();
    ctx.arc(bird.x, bird.y, BIRD_RADIUS, 0, Math.PI * 2);
    ctx.fill();
    
    // Bird eye
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(bird.x + 10, bird.y - 5, 5, 0, Math.PI * 2);
    ctx.fill();
}

// Draw pipes
function drawPipes() {
    ctx.fillStyle = 'green';
    pipes.forEach(pipe => {
        // Top pipe
        ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.topHeight);
        
        // Bottom pipe
        ctx.fillRect(
            pipe.x, 
            pipe.topHeight + PIPE_GAP, 
            PIPE_WIDTH, 
            canvas.height - (pipe.topHeight + PIPE_GAP)
        );
    });
}

// Create new pipes
function createPipes() {
    const minHeight = 50;
    const maxHeight = canvas.height - PIPE_GAP - minHeight;
    const topHeight = minHeight + Math.random() * (maxHeight - minHeight);
    
    pipes.push({
        x: canvas.width,
        topHeight: topHeight
    });
}

// Update game state
function updateGame() {
    if (currentState !== GAME_STATE.PLAYING) return;

    // Bird physics
    bird.velocity += GRAVITY;
    bird.y += bird.velocity;

    // Move pipes
    pipes.forEach(pipe => {
        pipe.x -= PIPE_SPEED;
    });

    // Remove off-screen pipes
    pipes = pipes.filter(pipe => pipe.x + PIPE_WIDTH > 0);

    // Create new pipes
    if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 200) {
        createPipes();
    }

    // Check for pipe collision and scoring
    pipes.forEach(pipe => {
        // Check if bird passed pipe
        if (pipe.x + PIPE_WIDTH < bird.x && !pipe.scored) {
            score++;
            scoreDisplay.textContent = score;
            pipe.scored = true;
        }

        // Collision detection
        const birdRight = bird.x + BIRD_RADIUS;
        const birdLeft = bird.x - BIRD_RADIUS;
        const birdTop = bird.y - BIRD_RADIUS;
        const birdBottom = bird.y + BIRD_RADIUS;

        const pipeRight = pipe.x + PIPE_WIDTH;
        const topPipeBottom = pipe.topHeight;
        const bottomPipeTop = pipe.topHeight + PIPE_GAP;

        if (
            birdRight > pipe.x && birdLeft < pipeRight &&
            (birdTop < topPipeBottom || birdBottom > bottomPipeTop)
        ) {
            endGame();
        }
    });

    // Ground collision
    if (bird.y + BIRD_RADIUS > canvas.height) {
        endGame();
    }
}

// Draw game elements
function drawGame() {
    // Clear canvas
    ctx.fillStyle = 'skyblue';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw pipes
    drawPipes();

    // Draw bird
    drawBird();
}

// Game loop
function gameUpdate() {
    updateGame();
    drawGame();
}

// Start game
function startGame() {
    if (currentState === GAME_STATE.READY || currentState === GAME_STATE.GAME_OVER) {
        currentState = GAME_STATE.PLAYING;
        gameLoop = setInterval(gameUpdate, 1000 / 60);
    }
}

// End game
function endGame() {
    clearInterval(gameLoop);
    currentState = GAME_STATE.GAME_OVER;
    
    // Update best score
    bestScore = Math.max(bestScore || 0, score);
    bestScoreDisplay.textContent = bestScore;
    
    alert('Game Over! Your score: ' + score);
}

// Bird jump
function jump() {
    if (currentState === GAME_STATE.READY) {
        startGame();
    }
    
    if (currentState === GAME_STATE.PLAYING) {
        bird.velocity = -JUMP_STRENGTH;
    }
}

// Event Listeners
startButton.addEventListener('click', startGame);
resetButton.addEventListener('click', initGame);

// Keyboard and mouse controls
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        jump();
    }
});

document.addEventListener('click', () => {
    jump();
});

// Initialize game on page load
initGame();
drawGame();