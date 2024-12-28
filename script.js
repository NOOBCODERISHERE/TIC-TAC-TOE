const squares = document.querySelectorAll('.square');
const resetButton = document.getElementById('resetButton');
const statusDisplay = document.getElementById('status');
let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];  // 3x3 grid for the game

const winningCombinations = [
    [0, 1, 2], // Top row
    [3, 4, 5], // Middle row
    [6, 7, 8], // Bottom row
    [0, 3, 6], // Left column
    [1, 4, 7], // Middle column
    [2, 5, 8], // Right column
    [0, 4, 8], // Diagonal
    [2, 4, 6]  // Diagonal
];

// Function to update the display of the game
function updateBoard() {
    squares.forEach((square, index) => {
        square.textContent = gameBoard[index];  // Display X or O
    });
}

// Function to handle player's click
function handleSquareClick(event) {
    const index = event.target.getAttribute('data-index');
    if (gameBoard[index] !== '' || checkWinner()) return; // Ignore click if square is taken or game has a winner
    gameBoard[index] = currentPlayer;  // Set current player's mark
    updateBoard();
    if (checkWinner()) {
        statusDisplay.textContent = `${currentPlayer} wins!`;
        return;
    }
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';  // Switch player
    statusDisplay.textContent = `Player ${currentPlayer}'s turn`;
}

// Function to check if a player has won
function checkWinner() {
    return winningCombinations.some(combination => {
        const [a, b, c] = combination;
        if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
            return true;
        }
        return false;
    });
}

// Function to reset the game
function resetGame() {
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    statusDisplay.textContent = `Player ${currentPlayer}'s turn`;
    updateBoard();
}

// Add event listeners
squares.forEach(square => {
    square.addEventListener('click', handleSquareClick);
});

resetButton.addEventListener('click', resetGame);

// Initialize the game display
updateBoard();
statusDisplay.textContent = `Player ${currentPlayer}'s turn`;
