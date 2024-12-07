// snake.js
export class SnakeGame {
    constructor(canvasId, startButtonId, resetButtonId, scoreDisplayId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.startButton = document.getElementById(startButtonId);
        this.resetButton = document.getElementById(resetButtonId);
        this.scoreDisplay = document.getElementById(scoreDisplayId);

        this.gridSize = 20;
        this.tileCount = this.canvas.width / this.gridSize;
        this.direction = 'RIGHT';
        this.gameLoop = null;

        this.initEventListeners();
    }

    initGame() {
        this.snake = [{ x: 1, y: 10 }];
        this.food = this.getRandomFood();
        this.score = 0;
        this.scoreDisplay.textContent = this.score;
        this.direction = 'RIGHT';
    }

    getRandomFood() {
        return {
            x: Math.floor(Math.random() * this.tileCount),
            y: Math.floor(Math.random() * this.tileCount)
        };
    }

    drawGame() {
        // Clear canvas
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw snake
        this.ctx.fillStyle = 'black';
        this.snake.forEach(segment => {
            this.ctx.fillRect(
                segment.x * this.gridSize, 
                segment.y * this.gridSize, 
                this.gridSize - 2, 
                this.gridSize - 2
            );
        });

        // Draw food
        this.ctx.fillStyle = 'red';
        this.ctx.fillRect(
            this.food.x * this.gridSize, 
            this.food.y * this.gridSize, 
            this.gridSize - 2, 
            this.gridSize - 2
        );
    }

    moveSnake() {
        const head = {...this.snake[0]};

        switch(this.direction) {
            case 'UP': head.y--; break;
            case 'DOWN': head.y++; break;
            case 'LEFT': head.x--; break;
            case 'RIGHT': head.x++; break;
        }

        // Food collision logic
        if (head.x === this.food.x && head.y === this.food.y) {
            this.score++;
            this.scoreDisplay.textContent = this.score;
            this.food = this.getRandomFood();
        } else {
            this.snake.pop();
        }

        this.snake.unshift(head);

        // Collision detection
        if (
            head.x < 0 || head.x >= this.tileCount ||
            head.y < 0 || head.y >= this.tileCount ||
            this.snake.slice(1).some(segment => 
                segment.x === head.x && segment.y === head.y)
        ) {
            this.stopGame();
            alert('Game Over! Your score: ' + this.score);
        }
    }

    updateGame() {
        this.moveSnake();
        this.drawGame();
    }

    startGame() {
        if (this.gameLoop) clearInterval(this.gameLoop);
        this.initGame();
        this.gameLoop = setInterval(() => this.updateGame(), 100);
    }

    stopGame() {
        clearInterval(this.gameLoop);
    }

    initEventListeners() {
        this.startButton.addEventListener('click', () => this.startGame());
        this.resetButton.addEventListener('click', () => this.stopGame());

        document.addEventListener('keydown', (e) => {
            switch(e.key.toLowerCase()) {
                case 'arrowup': 
                case 'w': 
                    if (this.direction !== 'DOWN') this.direction = 'UP'; 
                    break;
                case 'arrowdown': 
                case 's': 
                    if (this.direction !== 'UP') this.direction = 'DOWN'; 
                    break;
                case 'arrowleft': 
                case 'a': 
                    if (this.direction !== 'RIGHT') this.direction = 'LEFT'; 
                    break;
                case 'arrowright': 
                case 'd': 
                    if (this.direction !== 'LEFT') this.direction = 'RIGHT'; 
                    break;
            }
        });

        this.initGame();
    }
}

// flappy-bird.js
export class FlappyBirdGame {
    constructor(canvasId, startButtonId, resetButtonId, scoreDisplayId, bestScoreDisplayId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.startButton = document.getElementById(startButtonId);
        this.resetButton = document.getElementById(resetButtonId);
        this.scoreDisplay = document.getElementById(scoreDisplayId);
        this.bestScoreDisplay = document.getElementById(bestScoreDisplayId);

        this.BIRD_RADIUS = 20;
        this.GRAVITY = 0.5;
        this.JUMP_STRENGTH = 6;
        this.PIPE_WIDTH = 50;
        this.PIPE_GAP = 200;
        this.PIPE_SPEED = 2;

        this.GAME_STATE = {
            READY: 'ready',
            PLAYING: 'playing',
            GAME_OVER: 'game_over'
        };

        this.initEventListeners();
    }

    initGame() {
        this.bird = {
            x: this.canvas.width / 4,
            y: this.canvas.height / 2,
            velocity: 0
        };

        this.pipes = [];
        this.score = 0;
        this.scoreDisplay.textContent = this.score;

        this.bestScore = Math.max(this.bestScore || 0, this.score);
        this.bestScoreDisplay.textContent = this.bestScore;

        this.currentState = this.GAME_STATE.READY;
        this.drawGame();
    }

    drawBird() {
        this.ctx.fillStyle = 'yellow';
        this.ctx.beginPath();
        this.ctx.arc(this.bird.x, this.bird.y, this.BIRD_RADIUS, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.fillStyle = 'black';
        this.ctx.beginPath();
        this.ctx.arc(this.bird.x + 10, this.bird.y - 5, 5, 0, Math.PI * 2);
        this.ctx.fill();
    }

    drawPipes() {
        this.ctx.fillStyle = 'green';
        this.pipes.forEach(pipe => {
            this.ctx.fillRect(pipe.x, 0, this.PIPE_WIDTH, pipe.topHeight);
            this.ctx.fillRect(
                pipe.x, 
                pipe.topHeight + this.PIPE_GAP, 
                this.PIPE_WIDTH, 
                this.canvas.height - (pipe.topHeight + this.PIPE_GAP)
            );
        });
    }

    createPipes() {
        const minHeight = 50;
        const maxHeight = this.canvas.height - this.PIPE_GAP - minHeight;
        const topHeight = minHeight + Math.random() * (maxHeight - minHeight);
        
        this.pipes.push({
            x: this.canvas.width,
            topHeight: topHeight
        });
    }

    updateGame() {
        if (this.currentState !== this.GAME_STATE.PLAYING) return;

        this.bird.velocity += this.GRAVITY;
        this.bird.y += this.bird.velocity;

        this.pipes.forEach(pipe => {
            pipe.x -= this.PIPE_SPEED;
        });

        this.pipes = this.pipes.filter(pipe => pipe.x + this.PIPE_WIDTH > 0);

        if (this.pipes.length === 0 || this.pipes[this.pipes.length - 1].x < this.canvas.width - 200) {
            this.createPipes();
        }

        this.checkCollisions();
    }

    checkCollisions() {
        this.pipes.forEach(pipe => {
            if (pipe.x + this.PIPE_WIDTH < this.bird.x && !pipe.scored) {
                this.score++;
                this.scoreDisplay.textContent = this.score;
                pipe.scored = true;
            }

            const birdRight = this.bird.x + this.BIRD_RADIUS;
            const birdLeft = this.bird.x - this.BIRD_RADIUS;
            const birdTop = this.bird.y - this.BIRD_RADIUS;
            const birdBottom = this.bird.y + this.BIRD_RADIUS;

            const pipeRight = pipe.x + this.PIPE_WIDTH;
            const topPipeBottom = pipe.topHeight;
            const bottomPipeTop = pipe.topHeight + this.PIPE_GAP;

            if (
                birdRight > pipe.x && birdLeft < pipeRight &&
                (birdTop < topPipeBottom || birdBottom > bottomPipeTop)
            ) {
                this.endGame();
            }
        });

        if (this.bird.y + this.BIRD_RADIUS > this.canvas.height) {
            this.endGame();
        }
    }

    drawGame() {
        this.ctx.fillStyle = 'skyblue';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.drawPipes();
        this.drawBird();
    }

    startGame() {
        if (this.currentState === this.GAME_STATE.READY || this.currentState === this.GAME_STATE.GAME_OVER) {
            this.currentState = this.GAME_STATE.PLAYING;
            this.gameLoop = setInterval(() => {
                this.updateGame();
                this.drawGame();
            }, 1000 / 60);
        }
    }

    endGame() {
        clearInterval(this.gameLoop);
        this.currentState = this.GAME_STATE.GAME_OVER;
        
        this.bestScore = Math.max(this.bestScore || 0, this.score);
        this.bestScoreDisplay.textContent = this.bestScore;
        
        alert('Game Over! Your score: ' + this.score);
    }

    jump() {
        if (this.currentState === this.GAME_STATE.READY) {
            this.startGame();
        }
        
        if (this.currentState === this.GAME_STATE.PLAYING) {
            this.bird.velocity = -this.JUMP_STRENGTH;
        }
    }

    initEventListeners() {
        this.startButton.addEventListener('click', () => this.startGame());
        this.resetButton.addEventListener('click', () => this.initGame());

        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                this.jump();
            }
        });

        document.addEventListener('click', () => {
            this.jump();
        });

        this.initGame();
    }
}