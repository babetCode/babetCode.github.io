const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startButton');
const resetButton = document.getElementById('resetButton');
const scoreDisplay = document.getElementById('scoreDisplay');

// Game variables
const gridSize = 20;
const tileCount = canvas.width / gridSize;
let snake, food, score, gameLoop;
let isGameOver = false;
let direction = 'RIGHT';
let nextDirection = 'RIGHT';
let lastMoveTime = 0;
const moveInterval = 100; // Time in ms between moves

// Initialize game state
function initGame() {
    snake = [
        {x: 1, y: 10},  // Snake starts in the middle
    ];
    food = getRandomFood();
    score = 0;
    scoreDisplay.textContent = score;
    direction = 'RIGHT';
    nextDirection = 'RIGHT';
    isGameOver = false;
    lastMoveTime = 0;
}

// Generate random food position
function getRandomFood() {
    return {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount)
    };
}

// Draw game elements
function drawGame() {
    // Clear canvas
    ctx.fillStyle = '#171717';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw snake with gradient effect
    const baseColor = { r: 255, g: 251, b: 235 }; // Base color (white)
    const colorStep = 10; // Amount to darken each segment

    ctx.lineWidth = gridSize - 2;
    ctx.lineCap = 'round';

    for (let i = 0; i < snake.length - 1; i++) {
        const segment = snake[i];
        const nextSegment = snake[i + 1];
        const color = `rgb(${Math.max(baseColor.r - i * colorStep, 0)}, 
                          ${Math.max(baseColor.g - i * colorStep, 0)}, 
                          ${Math.max(baseColor.b - i * colorStep, 0)})`;
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.moveTo(segment.x * gridSize + gridSize / 2, segment.y * gridSize + gridSize / 2);
        ctx.lineTo(nextSegment.x * gridSize + gridSize / 2, nextSegment.y * gridSize + gridSize / 2);
        ctx.stroke();
    }

    // Draw head
    const head = snake[0];
    ctx.fillStyle = `rgb(${baseColor.r}, ${baseColor.g}, ${baseColor.b})`;
    ctx.beginPath();
    ctx.arc(
        head.x * gridSize + gridSize / 2, 
        head.y * gridSize + gridSize / 2, 
        gridSize / 2 - 2, 
        0, 
        Math.PI * 2
    );
    ctx.fill();

    // Draw eyes
    ctx.fillStyle = '#000000'; // Black color for the eyes
    const eyeRadius = gridSize / 10;
    let eyeX = head.x * gridSize + gridSize / 2;
    let eyeY = head.y * gridSize + gridSize / 2;
    switch (direction) {
        case 'UP':
        case 'DOWN':
            ctx.beginPath();
            ctx.arc(eyeX - eyeRadius *2, eyeY, eyeRadius, 0, Math.PI * 2);
            ctx.arc(eyeX + eyeRadius *2, eyeY, eyeRadius, 0, Math.PI * 2);
            ctx.fill();
            break;
        case 'LEFT':
        case 'RIGHT':
            ctx.beginPath();
            ctx.arc(eyeX, eyeY - eyeRadius *2, eyeRadius, 0, Math.PI * 2);
            ctx.arc(eyeX, eyeY + eyeRadius *2, eyeRadius, 0, Math.PI * 2);
            ctx.fill();
            break;
    }

    // Draw tongue
    ctx.fillStyle = '#FF0000'; // Red color for the tongue
    ctx.beginPath();
    const tongueLength = gridSize / 4;
    let tongueX = head.x * gridSize + gridSize / 2;
    let tongueY = head.y * gridSize + gridSize / 2;
    switch (direction) {
        case 'UP':
            tongueY -= gridSize / 2;
            ctx.moveTo(tongueX, tongueY);
            ctx.lineTo(tongueX - tongueLength / 2, tongueY - tongueLength);
            ctx.lineTo(tongueX + tongueLength / 2, tongueY - tongueLength);
            break;
        case 'DOWN':
            tongueY += gridSize / 2;
            ctx.moveTo(tongueX, tongueY);
            ctx.lineTo(tongueX - tongueLength / 2, tongueY + tongueLength);
            ctx.lineTo(tongueX + tongueLength / 2, tongueY + tongueLength);
            break;
        case 'LEFT':
            tongueX -= gridSize / 2;
            ctx.moveTo(tongueX, tongueY);
            ctx.lineTo(tongueX - tongueLength, tongueY - tongueLength / 2);
            ctx.lineTo(tongueX - tongueLength, tongueY + tongueLength / 2);
            break;
        case 'RIGHT':
            tongueX += gridSize / 2;
            ctx.moveTo(tongueX, tongueY);
            ctx.lineTo(tongueX + tongueLength, tongueY - tongueLength / 2);
            ctx.lineTo(tongueX + tongueLength, tongueY + tongueLength / 2);
            break;
    }
    ctx.closePath();
    ctx.fill();

    // Create gradient for food
    const gradient = ctx.createLinearGradient(
        food.x * gridSize, 
        food.y * gridSize, 
        (food.x + 1) * gridSize, 
        (food.y + 1) * gridSize
    );
    gradient.addColorStop(0, '#FDE68A');
    gradient.addColorStop(1, '#B45309');

    // Draw food with gradient
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(
        food.x * gridSize + gridSize / 2, 
        food.y * gridSize + gridSize / 2, 
        gridSize / 2 - 2, 
        0, 
        Math.PI * 2
    );
    ctx.fill();

    // Draw game over message if the game is over
    if (isGameOver) {
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '48px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Game Over!', canvas.width / 2, canvas.height / 2 - 24);
        ctx.font = '24px sans-serif';
        ctx.fillText('Your score: ' + score, canvas.width / 2, canvas.height / 2 + 24);
    }
}

// Movement logic
function moveSnake() {
    const head = {...snake[0]};

    // Determine next position based on direction
    switch(nextDirection) {
        case 'UP': head.y--; break;
        case 'DOWN': head.y++; break;
        case 'LEFT': head.x--; break;
        case 'RIGHT': head.x++; break;
    }

    // Check for food collision
    if (head.x === food.x && head.y === food.y) {
        score++;
        scoreDisplay.textContent = score;
        food = getRandomFood();
    } else {
        snake.pop();
    }

    // Add new head
    snake.unshift(head);

    // Wall collision / self collision
    if (
        head.x < 0 || head.x >= tileCount ||
        head.y < 0 || head.y >= tileCount ||
        snake.slice(1).some(segment => 
            segment.x === head.x && segment.y === head.y)
    ) {
        clearInterval(gameLoop);
        isGameOver = true;
    }

    direction = nextDirection;
}

// Game update
function updateGame(timestamp) {
    if (isGameOver) {
        return; // Stop the game loop if the game is over
    }

    if (timestamp - lastMoveTime > moveInterval) {
        moveSnake();
        lastMoveTime = timestamp;
    }
    drawGame();
    requestAnimationFrame(updateGame);
}

// Start game
startButton.addEventListener('click', () => {
    if (gameLoop) clearInterval(gameLoop);
    initGame();
    requestAnimationFrame(updateGame);
});

// Keyboard controls
document.addEventListener('keydown', (e) => {
    switch(e.key.toLowerCase()) {
        case 'arrowup': 
        case 'w': 
            if (direction !== 'DOWN') nextDirection = 'UP'; 
            break;
        case 'arrowdown': 
        case 's': 
            if (direction !== 'UP') nextDirection = 'DOWN'; 
            break;
        case 'arrowleft': 
        case 'a': 
            if (direction !== 'RIGHT') nextDirection = 'LEFT'; 
            break;
        case 'arrowright': 
        case 'd': 
            if (direction !== 'LEFT') nextDirection = 'RIGHT'; 
            break;
    }
});

// Initialize game on page load
initGame();