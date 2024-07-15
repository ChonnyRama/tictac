function GameBoard() {
    const rows = 3;
    const columns = 3;
    let board = [];

    function populateBoard() {
        for (let i = 0; i < 3; i++) {
            board[i] = [];
            for (let j = 0; j < 3; j++) {
                board[i].push(Cell());
            }
        }
    }

    populateBoard()

    const getCurrentBoard = () => board;

    const resetBoard = () => {
        board = [];
        populateBoard();
    }

    const markBoard = function (row, column, player) {
        // const availableCells = board.filter((rowe)=>{
        //     rowe[column].getValue() === 0;
        // })

        if (board[row][column].getValue() != '') {
            return markBoard(row, column, player);
        }

        board[row][column].markSymbol(player)
    }

    const printBoard = () => {
        const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()))
        console.log(boardWithCellValues)
    }

    return { getCurrentBoard, markBoard, printBoard, resetBoard }
}

function Cell() {
    let value = '';

    const markSymbol = (player) => {
        value = player;
    }

    const getValue = () => value;

    return { markSymbol, getValue }

}

function GameController(playerOneName = "player1",
    playerTwoName = "player2"
) {
    const newBoard = GameBoard();
    const players = [
        {
            name: playerOneName,
            symbol: 'X',
        },
        {
            name: playerTwoName,
            symbol: 'O',
        }
    ];
    let gameIndex = 1;
    let activePlayer = players[0];

    const switchPlayer = () => activePlayer = activePlayer === players[0] ? players[1] : players[0];

    const getCurrentPlayer = () => activePlayer;

    const printNewRound = () => {
        newBoard.printBoard()
        console.log(`${activePlayer.name}'s turn`)
    }

    const determineWinner = (player) => {
        const currentBoard = newBoard.getCurrentBoard();
        let columnCheck = [0, 0, 0];
        let occupied = 0;
        // if there is 3 of the same mark for each column in a row, someone wins
        // loop through every row and 
        // if there is 3 of the same mark for each row of a column, someone wins
        for (let i = 0; i < 3; i++) {
            let rowCheck = 0;
            for (let j = 0; j < 3; j++) {
                if (currentBoard[i][j].getValue() === player.symbol) {
                    rowCheck++;
                    columnCheck[j]++;
                }
                if (rowCheck === 3 || columnCheck.includes(3)) {
                    return announceWinner(player)
                }
            }
        }

        if ((currentBoard[0][0].getValue() === player.symbol &&
            currentBoard[1][1].getValue() === player.symbol &&
            currentBoard[2][2].getValue() === player.symbol
        ) || (
                currentBoard[0][2].getValue() === player.symbol &&
                currentBoard[1][1].getValue() === player.symbol &&
                currentBoard[2][0].getValue() === player.symbol
            )) {
            return announceWinner(player)
        }

        currentBoard.forEach((row) => {
            row.forEach((cell) => {
                if (cell.getValue() != '') {
                    occupied++;
                }
            })
        })

        if (occupied === 9) {
            newBoard.printBoard();
            newBoard.resetBoard();
            const winnerDiv = document.querySelector(".winner-history");
            const winningMessage = document.createElement("div");
            winningMessage.textContent = `Game ${gameIndex} was a tie!`;
            winnerDiv.appendChild(winningMessage);
            return gameIndex++;
        }

        return false;
    }

    const announceWinner = (player) => {
        newBoard.printBoard();
        newBoard.resetBoard();
        const winnerDiv = document.querySelector(".winner-history");
        const winningMessage = document.createElement("div");
        winningMessage.textContent = `${player.name} wins game ${gameIndex}!`;
        winnerDiv.appendChild(winningMessage);
        return gameIndex++;
    }

    const playRound = (row, column) => {

        newBoard.markBoard(row, column, activePlayer.symbol);
        determineWinner(activePlayer);
        switchPlayer();
        printNewRound();
    }

    printNewRound();

    return { getCurrentPlayer, playRound, getBoard : newBoard.getCurrentBoard }
}

function DisplayController() {
    let newGame;
    const gameContainer = document.querySelector(".game-board");
    const playerTurnDiv = document.querySelector(".player");

    const showButton = document.querySelector(".container > button");
    const submitButton = document.querySelector("dialog > .submit");
    const cancelButton = document.querySelector("dialog > .close");
    const dialog = document.querySelector("dialog");
    const form = document.querySelector("form");

    showButton.addEventListener("click", () => {
        dialog.showModal();
    });
    
    cancelButton.addEventListener("click", () => {
        dialog.close();
    });
    
    submitButton.addEventListener("click", () => {
        const playerOneName = document.querySelector('#player1').value;
        const playerTwoName = document.querySelector('#player2').value;

        form.reset()
        dialog.close();
        makeNewGame(playerOneName,playerTwoName)
    })
    
    const makeNewGame = function(name1,name2) {
        newGame = GameController(name1,name2);
        renderBoard();
    }

    const renderBoard = () => {
        gameContainer.textContent = ''
        const board = newGame.getBoard();
        const activePlayer = newGame.getCurrentPlayer();

        playerTurnDiv.textContent = `${activePlayer.name}'s turn`

        board.forEach((row, rowIndex) => {
            row.forEach((cell,colIndex) => {
                const cellButton = document.createElement("button");
                cellButton.classList.add("cell");
                cellButton.dataset.row = rowIndex;
                cellButton.dataset.column = colIndex;

                cellButton.textContent = cell.getValue();
                gameContainer.appendChild(cellButton);
            })
        })
    }

    function clickHandlerBoard(e) {
        const [selectedRow, selectedColumn] = [e.target.dataset.row, e.target.dataset.column];

        newGame.playRound(selectedRow,selectedColumn);
        renderBoard();
    }

    gameContainer.addEventListener("click", clickHandlerBoard);
}


DisplayController();