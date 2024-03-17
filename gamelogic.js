const cellElements = document.querySelectorAll('[data-cell]')
const board = document.getElementById('board')
const showResult = document.getElementById('result')
const winningMessageElement = document.querySelector('[data-result-message-text]')
const restartButton = document.getElementById('restartButton')

const PvPButton = document.getElementById('PvPButton')
const PvAButton = document.getElementById('PvAButton')

const menuButton = document.getElementById('menuButton')
const chooseModeMenu = document.getElementById('chooseModeMenu')

const sideSelectionButtons = document.querySelectorAll('[data-SideSelection]')

const chooseSideMenu = document.getElementById('selectSide')
const chooseLevelMenu = document.getElementById('chooseLevelMenu')

const ModeButtons = document.querySelectorAll('[data-Mode]')


const X_Class = 'x'
const CIRCLE_Class = 'circle'

const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
]

let circleTurn
let isPvP
let isPlayerTurn
let PLAYER_Class
let AI_Class
let chosenGameMode


restartButton.addEventListener('click', resetGame)
menuButton.addEventListener('click', goToMenu)

PvPButton.addEventListener('click', startPvPGame)
PvAButton.addEventListener('click', goToLevelMenu)

/* Restart the game */
function resetGame() {
    showResult.classList.remove('show')
    board.classList.add('isHidden')
    chooseModeMenu.classList.remove('isHidden')
    if(isPvP)
        startPvPGame()
    else
        goToLevelMenu()
}

/* Resets board to menu */
function goToMenu() {
    cellElements.forEach(cell => {
        cell.removeEventListener('click', handleClick)
        cell.removeEventListener('click', handleClickWithAI)
    })
    showResult.classList.remove('show')
    board.classList.add('isHidden')
    chooseModeMenu.classList.remove('isHidden')
}

/* Switch to level menu */
function goToLevelMenu() {
    isPvP = false
    chooseModeMenu.classList.add('isHidden')
    chooseLevelMenu.classList.remove('isHidden')
    ModeButtons.forEach(modeButton => {
        modeButton.addEventListener('click', () =>  goToSideSelection(modeButton.id))
    })
}

/* Switch to side selection */
function goToSideSelection(chosenLevel) {
    chooseLevelMenu.classList.add('isHidden')
    chooseSideMenu.classList.remove('isHidden')
    sideSelectionButtons.forEach(selectionButton => {
        selectionButton.addEventListener('click', () => startPvAGame(selectionButton.id, chosenLevel))
    })
}

/* Player vs Player - Game logic */

function startPvPGame() {
    isPvP = true
    chooseModeMenu.classList.add('isHidden')
    board.classList.remove('isHidden')
    circleTurn = false
    cellElements.forEach(cell => {
        cell.classList.remove(X_Class)
        cell.classList.remove(CIRCLE_Class)
        cell.removeEventListener('click', handleClick)
        cell.addEventListener('click', handleClick, { once: true })
    })
    setBoardHoverClass()
    showResult.classList.remove('show')
}


function handleClick(e) {
    const cell = e.target
    const currentClass = circleTurn ? CIRCLE_Class : X_Class
    placeMark(cell, currentClass)
    if(checkWin(currentClass)) {
        endGame(false)
    } else if (isDraw()) {
        endGame(true)
    }
    swapTurns()
    setBoardHoverClass()
}

/* Show end message */

function endGame(draw) {
    if(draw) {
        winningMessageElement.innerText = "Draw!"
    }
    else {
        winningMessageElement.innerText = `${circleTurn ? "O's " : "X's "} winner`;
    }
    showResult.classList.add('show')
}

function isDraw() {
    return [...cellElements].every(cell => {
        return cell.classList.contains(X_Class) ||
        cell.classList.contains(CIRCLE_Class)
    })
}

function placeMark(cell, currentClass) {
    cell.classList.add(currentClass)
}

function swapTurns() {
    circleTurn = !circleTurn
    isPlayerTurn = !isPlayerTurn
}

function setBoardHoverClass() {
    board.classList.remove(X_Class)
    board.classList.remove(CIRCLE_Class)
    if(circleTurn) {
        board.classList.add(CIRCLE_Class)
    } else {
        board.classList.add(X_Class)
    }
}

function checkWin(currentClass) {
    return winningCombinations.some(combination => {
        return combination.every(index => {
            return cellElements[index].classList.contains(currentClass)
        })
    })
}


/* AI - Easy Mode - Losowe wybieranie wolnego pola */
function AI_EasyMode() {
    let randomNumber
    while(true) {
        randomNumber = Math.floor(Math.random() * 9);
        if(cellElements[randomNumber].classList.contains(X_Class) ||
            cellElements[randomNumber].classList.contains(CIRCLE_Class)) {
                continue
            }             
        else
            break
    }
    return randomNumber
}


function handleClickWithAI(e) {
    if(isPlayerTurn) {
        handlePlayerClick(e)
        swapTurns()
        setBoardHoverClass()
    }    
    

    AI_Move(AI_Class)

    

    swapTurns()
    setBoardHoverClass()
}

function handlePlayerClick(e) {
    const cell = e.target
    placeMark(cell, PLAYER_Class)
    if(checkWin(PLAYER_Class)) {
        if(PLAYER_Class == X_Class) circleTurn = false
        else circleTurn = true
        endGame(false)
        return
    } else if (isDraw()) {
        endGame(true)
        return
    }
}

function swapTurnsAI() {
    isPlayerTurn = !isPlayerTurn
    circleTurn = !circleTurn
}

function startPvAGame(playerSide, chosenMode) {
    chosenGameMode = chosenMode
    if(playerSide == "X_Class") {
        circleTurn = false
        isPlayerTurn = true
        PLAYER_Class = X_Class
        AI_Class = CIRCLE_Class
    } else {
        circleTurn = true
        isPlayerTurn = false
        PLAYER_Class = CIRCLE_Class 
        AI_Class = X_Class

    }

    chooseSideMenu.classList.add('isHidden')
    board.classList.remove('isHidden')

    cellElements.forEach(cell => {
        cell.classList.remove(X_Class)
        cell.classList.remove(CIRCLE_Class)
        cell.removeEventListener('click', handleClickWithAI)
        cell.addEventListener('click', handleClickWithAI, { once: true })
    })

    if(!isPlayerTurn) {
        let chosenMove = AI_EasyMode()
        placeMark(cellElements[chosenMove], AI_Class)
        cellElements[chosenMove].removeEventListener('click', handleClickWithAI)
        isPlayerTurn = true
    } 
    setBoardHoverClass()
    
    showResult.classList.remove('show')
}

function AI_Move(AI_Class) {
    switch (chosenGameMode) {
        case "Easy":
            let chosenCell = AI_EasyMode()
            placeMark(cellElements[chosenCell], AI_Class);
            cellElements[chosenCell].removeEventListener('click', handleClickWithAI)
            break;
        case "Medium":
            // Implement medium difficulty logic
            break;
        case "Hard":
            let bestMove = findBestMove(cellElements);
            placeMark(cellElements[bestMove], AI_Class);
            cellElements[bestMove].removeEventListener('click', handleClickWithAI)
            break;
        default:
            console.log("Invalid game mode");
            break;
    }

    if(checkWin(AI_Class)) {
        endGame(false)
        return
    } else if (isDraw()) {
        endGame(true)
        return
    }
}



function findBestMove(board) {
    let bestVal = -Infinity;
    let bestMove = -1;

    for (let i = 0; i < board.length; i++) {
        if (!board[i].classList.contains(X_Class) && !board[i].classList.contains(CIRCLE_Class)) {
            board[i].classList.add(AI_Class);
            let moveVal = minimax(board, 0, false);
            board[i].classList.remove(AI_Class);

            if (moveVal > bestVal) {
                bestMove = i;
                bestVal = moveVal;
            }
        }
    }

    return bestMove;
}

function minimax(board, depth, isMaximizing) {
    if (checkWin(AI_Class)) {
        return +10;
    } else if (checkWin(PLAYER_Class)) {
        return -10;
    } else if (isDraw()) {
        return 0;
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (!board[i].classList.contains(X_Class) && !board[i].classList.contains(CIRCLE_Class)) {
                board[i].classList.add(AI_Class);
                let score = minimax(board, depth + 1, false);
                board[i].classList.remove(AI_Class);
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (!board[i].classList.contains(X_Class) && !board[i].classList.contains(CIRCLE_Class)) {
                board[i].classList.add(PLAYER_Class);
                let score = minimax(board, depth + 1, true);
                board[i].classList.remove(PLAYER_Class);
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}
 