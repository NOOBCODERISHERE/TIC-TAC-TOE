// Game board state
const cells = Array.from(document.querySelectorAll('.square'));
let board = ['', '', '', '', '', '', '', '', '']; // Represents the 3x3 grid
let currentPlayer = 'X'; // Player 'X' starts the game
let gameActive = true; // Track if the game is still active
let isPlayerVsComputer = false; // Track if it's player vs computer mode

// Timer variables
let timerInterval;
let timerSeconds = 0;
let timerMinutes = 0;
let timerDisplay = document.getElementById('timer');

// Display the game status
const statusDisplay = document.getElementById('status');

// Game win counts
let playerXWins = 0;
let playerOWins = 0;
const playerXWinsDisplay = document.getElementById('playerXWins');
const playerOWinsDisplay = document.getElementById('playerOWins');

// Play Player vs Player mode
document.getElementById('playerVsPlayerButton').addEventListener('click', () => {
    isPlayerVsComputer = false; // Set mode to Player vs Player
    resetGame();  // Reset the game
    statusDisplay.textContent = "Player's Turn (vs Player)";
});

// Play Player vs Computer mode
document.getElementById('playerVsComputerButton').addEventListener('click', () => {
    isPlayerVsComputer = true; // Set mode to Player vs Computer
    resetGame();  // Reset the game
    statusDisplay.textContent = "Player's Turn (vs Computer)";
});

// Handles a player's move
function handleCellClick(index) {
    if (board[index] === '' && gameActive) {
        board[index] = currentPlayer; // Mark the square with the player's symbol
        cells[index].textContent = currentPlayer;

        if (checkWinner()) {
            statusDisplay.textContent = `${currentPlayer} wins!`;
            updateWinCount(currentPlayer);
            gameActive = false; // End the game when there's a winner
            clearInterval(timerInterval); // Stop the timer when the game ends
            displayGameOverScreen(`${currentPlayer} wins!`);
            return;
        }

        // Switch players
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';

        // Check if it's the computer's turn (Player "O")
        if (isPlayerVsComputer && currentPlayer === 'O' && gameActive) {
            setTimeout(computerMove, 500); // Delay for computer's turn
        } else {
            statusDisplay.textContent = `${currentPlayer}'s Turn`;
            startTimer(); // Start timer when player's turn begins
        }
    }
}

// Check if there is a winner or draw
function checkWinner() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6] // Diagonals
    ];

    // Check all win patterns
    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return true; // Winner found
        }
    }

    // Check if the board is full and it's a draw
    if (!board.includes('')) {
        statusDisplay.textContent = "It's a draw!";
        gameActive = false;
        clearInterval(timerInterval); // Stop the timer when the game ends
        displayGameOverScreen("It's a draw!");
        return true;
    }

    return false;
}

// Make the computer's move (random move)
function computerMove() {
    const availableCells = board.map((cell, index) => cell === '' ? index : null).filter(val => val !== null); // Get empty cells
    const randomIndex = availableCells[Math.floor(Math.random() * availableCells.length)]; // Select a random empty cell

    board[randomIndex] = 'O'; // Place 'O' in the random cell
    cells[randomIndex].textContent = 'O'; // Update the UI with 'O'

    if (checkWinner()) {
        statusDisplay.textContent = 'Computer (O) wins!';
        updateWinCount('O');
        gameActive = false; // End the game
        clearInterval(timerInterval); // Stop the timer
        displayGameOverScreen('Computer (O) wins!');
    } else {
        currentPlayer = 'X'; // Switch back to player
        statusDisplay.textContent = "Player's Turn";
        startTimer(); // Start timer again for the player's turn
    }
}

// Update the win count for the player who won
function updateWinCount(winner) {
    if (winner === 'X') {
        playerXWins++;
        playerXWinsDisplay.textContent = `Player X Wins: ${playerXWins}`;
    } else if (winner === 'O') {
        playerOWins++;
        playerOWinsDisplay.textContent = `Player O Wins: ${playerOWins}`;
    }
}

// Reset the game to its initial state
function resetGame() {
    board = ['', '', '', '', '', '', '', '', '']; // Clear the board
    currentPlayer = 'X'; // Player 'X' starts
    gameActive = true; // Game is active
    timerMinutes = 0;
    timerSeconds = 0;
    clearInterval(timerInterval); // Stop any running timer

    // Clear all grid cells
    cells.forEach(cell => cell.textContent = '');

    // Reset win counts when switching modes
    playerXWins = 0;
    playerOWins = 0;
    playerXWinsDisplay.textContent = `Player X Wins: ${playerXWins}`;
    playerOWinsDisplay.textContent = `Player O Wins: ${playerOWins}`;

    // Reset timer display
    timerDisplay.textContent = 'Time: 00:00';

    // Reset Game Over Screen
    document.getElementById('gameOverScreen').style.display = 'none';
}

// Add event listeners to each cell
cells.forEach((cell, index) => {
    cell.addEventListener('click', () => handleCellClick(index)); // Handle user clicks
});

// Reset button click event listener
document.getElementById('resetButton').addEventListener('click', resetGame);

// Timer functionality
function startTimer() {
    // Clear any existing interval if the timer was already running
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timerSeconds++;
        if (timerSeconds === 60) {
            timerSeconds = 0;
            timerMinutes++;
        }

        // Update the timer display
        timerDisplay.textContent = `Time: ${formatTime(timerMinutes)}:${formatTime(timerSeconds)}`;
    }, 1000); // Update every second
}

// Format time to always show two digits
function formatTime(time) {
    return time < 10 ? `0${time}` : time;
}

// Display Game Over Screen
function displayGameOverScreen(message) {
    const gameOverScreen = document.getElementById('gameOverScreen');
    const gameOverMessage = document.getElementById('gameOverMessage');
    const gameOverTime = document.getElementById('gameOverTime');

    gameOverMessage.textContent = message;
    gameOverTime.textContent = `Time taken: ${formatTime(timerMinutes)}:${formatTime(timerSeconds)}`;
    gameOverScreen.style.display = 'block'; // Show the game over screen
}
