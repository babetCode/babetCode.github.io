import { SnakeGame } from './games.js';
import { FlappyBirdGame } from './games.js';

// Initialize Snake Game
const snakeGame = new SnakeGame(
    'snakeCanvas', 
    'snakeStartButton', 
    'snakeResetButton', 
    'snakeScoreDisplay'
);

// Initialize Flappy Bird Game
const flappyBirdGame = new FlappyBirdGame(
    'flappyBirdCanvas', 
    'flappyBirdStartButton', 
    'flappyBirdResetButton', 
    'flappyBirdScoreDisplay',
    'flappyBirdBestScoreDisplay'
);