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

// Initialize game state
function initGame() {
    snake = [
        {x: 1, y: 10},  // Snake starts in the middle
    ];
    food = getRandomFood();
    score = 0;
    scoreDisplay.textContent = score;
    direction = 'RIGHT';
    isGameOver = false;
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

    snake.forEach((segment, index) => {
        const color = `rgb(${Math.max(baseColor.r - index * colorStep, 0)}, 
                          ${Math.max(baseColor.g - index * colorStep, 0)}, 
                          ${Math.max(baseColor.b - index * colorStep, 0)})`;
        ctx.fillStyle = color;
        ctx.fillRect(
            segment.x * gridSize, 
            segment.y * gridSize, 
            gridSize - 2, 
            gridSize - 2
        );
    });

    // // Draw snake
    // ctx.fillStyle = '#FAFAFA';
    // snake.forEach(segment => {
    //     ctx.fillRect(
    //         segment.x * gridSize, 
    //         segment.y * gridSize, 
    //         gridSize - 2, 
    //         gridSize - 2
    //     );
    // });

    // Draw food
    ctx.fillStyle = '#DC2626';
    ctx.fillRect(
        food.x * gridSize, 
        food.y * gridSize, 
        gridSize - 2, 
        gridSize - 2
    );

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
let direction = 'RIGHT';
function moveSnake() {
    const head = {...snake[0]};

    // Determine next position based on direction
    switch(direction) {
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
}

// Game update
function updateGame() {
    moveSnake();
    drawGame();
}

// Start game
startButton.addEventListener('click', () => {
    if (gameLoop) clearInterval(gameLoop);
    initGame();
    gameLoop = setInterval(updateGame, 100);
});

// Keyboard controls
document.addEventListener('keydown', (e) => {
    switch(e.key.toLowerCase()) {
        case 'arrowup': 
        case 'w': 
            if (direction !== 'DOWN') direction = 'UP'; 
            break;
        case 'arrowdown': 
        case 's': 
            if (direction !== 'UP') direction = 'DOWN'; 
            break;
        case 'arrowleft': 
        case 'a': 
            if (direction !== 'RIGHT') direction = 'LEFT'; 
            break;
        case 'arrowright': 
        case 'd': 
            if (direction !== 'LEFT') direction = 'RIGHT'; 
            break;
    }
});

// Initialize game on page load
initGame();