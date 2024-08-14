function generateCircleSVG() {
    // Create the SVG element
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 100 100");

    // Create the circle element
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("fill", "none");
    circle.setAttribute("stroke", "var(--o-color, #000000)");
    circle.setAttribute("stroke-width", "10");
    circle.setAttribute("cx", "50");
    circle.setAttribute("cy", "50");
    circle.setAttribute("r", "35");

    // Append the circle to the SVG
    svg.appendChild(circle);

    return svg;
}

function generateCrossSVG() {
    // Create the SVG element
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 100 100");

    // Create the path element
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", "M20,20 L80,80 M80,20 L20,80");
    path.setAttribute("stroke", "var(--x-color, #000000)");
    path.setAttribute("stroke-width", "10");
    path.setAttribute("stroke-linecap", "round");

    // Append the circle to the SVG
    svg.appendChild(path);

    return svg;
}


const board = document.getElementById('board');
const status = document.getElementById('status');
const newGameButton = document.getElementById('newGame');
const boardSizeSelect = document.getElementById('boardSize');
const winLengthSelect = document.getElementById('winLength');
const circleSVG = generateCircleSVG();
const crossSVG = generateCrossSVG();


let currentPlayer = 'X';
let gameState;
let gameActive = true;
let boardSize = 3;
let winLength = 3;
let winningConditions = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];

function initGame() {
    boardSize = parseInt(boardSizeSelect.value);
    winLength = parseInt(winLengthSelect.value);

    if (winLength > boardSize) {
        alert('Winning length cannot be greater than board size.');
        return;
    }

    gameState = Array(boardSize * boardSize).fill('');
    gameActive = true;
    currentPlayer = 'X';
    status.textContent = `Player ${currentPlayer}'s Turn`;

    winningConditions = getWinningConditions();

    board.innerHTML = '';
    board.style.gridTemplateColumns = `repeat(${boardSize}, var(--cell-size))`;

    for (let i = 0; i < boardSize * boardSize; i++) {
        const cell = document.createElement('button');
        cell.classList.add('cell');
        cell.setAttribute('data-index', i);
        board.appendChild(cell);
    }
}

function handleCellClick(e) {
    const clickedCell = e.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

    if (gameState[clickedCellIndex] !== '' || !gameActive) return;

    gameState[clickedCellIndex] = currentPlayer;
    ///clickedCell.classList.add(currentPlayer.toLowerCase());
    if (currentPlayer === 'X') {
        clickedCell.appendChild(crossSVG.cloneNode(true));
    } else {
        clickedCell.appendChild(circleSVG.cloneNode(true));
    }
    checkResult();
}

function checkResult() {
    let roundWon = false;
    for (let i = 0; i < winningConditions.length; i++) {
        const line = winningConditions[i];
        const firstCell = gameState[line[0]];
        if (firstCell === '') continue;

        if (line.every(index => gameState[index] === firstCell)) {
            roundWon = true;
            //break;
            line.forEach(index => {
                const cell = board.querySelector(`.cell[data-index="${index}"]`);
                cell.classList.add('win');
            });
        }
    }

    if (roundWon) {
        status.textContent = `Player ${currentPlayer} wins!`;
        gameActive = false;
        return;
    }

    if (!gameState.includes('')) {
        status.textContent = 'Game ended in a draw!';
        gameActive = false;
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    status.textContent = `Player ${currentPlayer}'s Turn`;
}

function getWinningConditions() {
    const conditions = [];

    // Rows and columns
    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j <= boardSize - winLength; j++) {
            conditions.push(Array.from({ length: winLength }, (_, k) => i * boardSize + j + k)); // Row
            conditions.push(Array.from({ length: winLength }, (_, k) => (j + k) * boardSize + i)); // Column
        }
    }

    // Diagonals
    for (let i = 0; i <= boardSize - winLength; i++) {
        for (let j = 0; j <= boardSize - winLength; j++) {
            conditions.push(Array.from({ length: winLength }, (_, k) => (i + k) * boardSize + j + k)); // Diagonal
            conditions.push(Array.from({ length: winLength }, (_, k) => (i + k) * boardSize + (j + winLength - 1 - k))); // Anti-diagonal
        }
    }

    return conditions;
}




board.addEventListener('click', handleCellClick);
newGameButton.addEventListener('click', initGame);

initGame(); // Initialize the game when the page loads