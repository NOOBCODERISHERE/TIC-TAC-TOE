// Game board state
const cells = Array.from(document.querySelectorAll('.square'));
let board = Array(9).fill(''); // Represent the 3x3 grid
let currentPlayer = 'X'; // Player 'X' starts the game
let gameActive = true; // Track if the game is active
let isPlayerVsComputer = false; // Track Player vs Computer mode
let aiDifficulty = 'easy'; // Initial AI difficulty

// Timer variables
let timerInterval;
let timerSeconds = 0;
let timerMinutes = 0;
const timerDisplay = document.getElementById('timer');
const statusDisplay = document.getElementById('status');

// Game win counts
let playerXWins = 0;
let playerOWins = 0;
const playerXWinsDisplay = document.getElementById('playerXWins');
const playerOWinsDisplay = document.getElementById('playerOWins');

// Handle difficulty selection
const difficultyButtons = document.querySelectorAll('.difficulty-container button');
difficultyButtons.forEach(button =>
  button.addEventListener('click', () => setDifficulty(button.id))
);

// Handle mode selection
document.getElementById('playerVsPlayerButton').addEventListener('click', () => setGameMode(false));
document.getElementById('playerVsComputerButton').addEventListener('click', () => setGameMode(true));

// Handle square click
cells.forEach((cell, index) =>
  cell.addEventListener('click', () => handleCellClick(index))
);

// Restart button functionality
document.getElementById('restartButton').addEventListener('click', resetGame);

// Set AI difficulty
function setDifficulty(level) {
  aiDifficulty = level;
  resetGame();
  statusDisplay.textContent = `AI Difficulty: ${capitalize(level)}`;
}

// Set game mode
function setGameMode(isComputerMode) {
  isPlayerVsComputer = isComputerMode;
  resetGame();
  statusDisplay.textContent = isComputerMode ? "Starting game..." : "Player's Turn (vs Player)";
}

// Update win count
function updateWinCount(player) {
  player === 'X' ? playerXWins++ : playerOWins++;
  playerXWinsDisplay.textContent = `Player X Wins: ${playerXWins}`;
  playerOWinsDisplay.textContent = `Player O Wins: ${playerOWins}`;
}

// Reset the game
// Reset the game
function resetGame() {
    board.fill('');
    gameActive = true;
    currentPlayer = isPlayerVsComputer ? (Math.random() < 0.5 ? 'X' : 'O') : 'X';
    cells.forEach(cell => (cell.textContent = ''));
    document.getElementById('gameOverScreen').style.display = 'none';
    
    // Show the game board again
    document.querySelector('.game-board-container').style.display = 'block';
  
    statusDisplay.textContent = `${currentPlayer}'s Turn`;
  
    clearInterval(timerInterval);
    timerSeconds = timerMinutes = 0;
    timerDisplay.textContent = 'Time: 00:00';
    startTimer();
  
    if (isPlayerVsComputer && currentPlayer === 'O') {
      setTimeout(computerMove, 500);
    }
  }
  

// Start the timer
function startTimer() {
  timerInterval = setInterval(() => {
    timerSeconds++;
    if (timerSeconds === 60) {
      timerSeconds = 0;
      timerMinutes++;
    }
    timerDisplay.textContent = `Time: ${formatTime(timerMinutes)}:${formatTime(timerSeconds)}`;
  }, 1000);
}

// Format time for display
function formatTime(time) {
  return time < 10 ? `0${time}` : time;
}

// Handle a player's move
function handleCellClick(index) {
  if (board[index] || !gameActive) return;

  board[index] = currentPlayer;
  cells[index].textContent = currentPlayer;
  
  if (checkWinner()) {
    updateWinCount(currentPlayer);
    displayGameOver(`${currentPlayer} wins!`);
    return;
  }

  if (checkDraw()) {
    displayGameOver("It's a draw!");
    return;
  }

  switchPlayer();

  if (isPlayerVsComputer && currentPlayer === 'O') {
    setTimeout(computerMove, 500);
  } else {
    statusDisplay.textContent = `${currentPlayer}'s Turn`;
  }
}

// Check if the game is a draw
function checkDraw() {
  return board.every(cell => cell !== '');
}

// Switch current player
function switchPlayer() {
  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
}

// Check for a winner
function checkWinner() {
  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  return winPatterns.some(pattern => {
    const [a, b, c] = pattern;
    return board[a] && board[a] === board[b] && board[a] === board[c];
  });
}

// Display Game Over Screen
function displayGameOver(message) {
  gameActive = false;
  clearInterval(timerInterval);
  document.querySelector('.game-board-container').style.display = 'none';
  
  const gameOverScreen = document.getElementById('gameOverScreen');
  gameOverScreen.style.display = 'block';
  document.getElementById('gameOverMessage').textContent = message;
  document.getElementById('gameOverTime').textContent = `Time Taken: ${formatTime(timerMinutes)}:${formatTime(timerSeconds)}`;
}

// Computer's move (AI logic)
function computerMove() {
  const availableMoves = board.map((value, index) => value === '' ? index : -1).filter(index => index !== -1);
  const move = aiDifficulty === 'easy' 
    ? availableMoves[Math.floor(Math.random() * availableMoves.length)] 
    : minimax(availableMoves);
  handleCellClick(move);
}

// Simple AI: Minimax (can be optimized further for harder difficulties)
function minimax(availableMoves) {
  // Implement minimax logic here or return random for now
  return availableMoves[Math.floor(Math.random() * availableMoves.length)];
}

// Capitalize the first letter of a string
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
// Select the color pickers and game-related elements
const backgroundColorPicker = document.getElementById('background-color');
const squareColorPicker = document.getElementById('square-color');

// Event listener to change the background color of the entire website (body)
backgroundColorPicker.addEventListener('input', (event) => {
    // Change the body background color
    document.body.style.backgroundColor = event.target.value;
});

// Event listener to change the square color of the game squares
squareColorPicker.addEventListener('input', (event) => {
    // Select all the game squares
    const gameSquares = document.querySelectorAll('.square');

    // Change the background color of each square
    gameSquares.forEach((square) => {
        square.style.backgroundColor = event.target.value;
    });
});
