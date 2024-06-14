function Gameboard() {
    const board = [];

    function Tile() {
        let value = 0;
        const XorO = (player) => {
            value = player;
        }
        const getValue = () => value;
        return { XorO, getValue };
    }

    for (let i = 0; i < 3; i++) {
        board[i] = [];
        for (let j = 0; j < 3; j++) {
            board[i].push(Tile());
        }
    }

    const getBoard = () => board;

    const playXorO = (row, column, player) => {
        if(board[row][column].getValue() === 0) {
            board[row][column].XorO(player);
            //console.log(board[row][column].getValue());
        } else {
            return;
        }
    }

    const printBoard = () => {
        console.log(getBoard().map(row => row.map(tile => tile.getValue())));
    }

    return { playXorO, getBoard, printBoard };
};


function Controller(
    playerOne = 'player one',
    playerTwo = 'player two') {
    const board = Gameboard();
    const players = [
        {
            name: playerOne,
            symbol: 1
        },
        {
            name: playerTwo,
            symbol: 2
        }
    ];
    let currentPlayer = players[0];
    let win = false;
    let draw = false;

    const getWin = () => win;
    const getDraw = () => draw;

    const changeTurn = () => {
        currentPlayer = currentPlayer === players[0] ? players[1] : players[0];
    };

    const getCurrentPlayer = () => currentPlayer;

    const printRound = () => {
        board.printBoard();
        console.log(`${getCurrentPlayer().name} turn`);
    };

    const playRound = (row, column) => {
        const selectedTile = (board.getBoard())[row][column];
        if(!win && !draw) {
            if(selectedTile.getValue() === 0) {
                board.playXorO(row, column, getCurrentPlayer().symbol);
                checkWin();
            }
        }
    };

    const checkWin = () => {



        let valueArr = [];
        (board.getBoard()).map(row => {
            row.map(tile => valueArr.push(tile.getValue()));
        });


        let playerTiles = [
            valueArr.slice(0, 3),
            valueArr.slice(3, 6),
            valueArr.slice(6),
            [valueArr[0], valueArr[3], valueArr[6]],
            [valueArr[1], valueArr[4], valueArr[7]],
            [valueArr[2], valueArr[5], valueArr[8]],
            [valueArr[0], valueArr[4], valueArr[8]],
            [valueArr[2], valueArr[4], valueArr[6]]
        ];


        const threeInARow = (tileSet) => tileSet.every(value => value === tileSet[0]);

        let winningArr;

        playerTiles.forEach(array => {
                if(threeInARow(array) == true && array[0] !== 0) {
                    win = true;
                    winningArr = array;
                    console.log(`${getCurrentPlayer().name} wins!`);
                    board.printBoard();
                    return;
                }
        });

        if(!(valueArr.includes(0))) {
            if(!win) {
                draw = true;
                win = false;
                console.log('its a draw!');
                board.printBoard();
                return;
            }
        }

        if(!win && !draw) {
            changeTurn();
            printRound();
            return;
        }
    }

    return {playRound, getCurrentPlayer, checkWin, getWin, getDraw};
};

const display = (function Display() {
    const controller = Controller();
    const body = document.querySelector('body');


    const renderGameboard = () => {
        const boardContainer = document.createElement('div');
        boardContainer.classList.add('board');
        body.appendChild(boardContainer);
        for(let i = 0; i < 3; i++) {
            const boardRow = document.createElement('div');
            boardRow.classList.toggle('row');
            boardRow.setAttribute('data-row', i);
            boardContainer.appendChild(boardRow);
            for (let j = 0; j < 3; j++) {
                const boardTile = document.createElement('button');
                boardTile.setAttribute('data-column', j);
                boardTile.setAttribute('data-row', boardRow.dataset.row);
                boardTile.addEventListener('click', 
                    function() {
                        const row = parseInt(boardTile.dataset.row);
                        const col = parseInt(boardTile.dataset.column);
                        let playerSymbol = controller.getCurrentPlayer().symbol;
                        if(!controller.getWin() && !controller.getDraw()) {
                            controller.playRound(
                                parseInt(row),
                                parseInt(col)
                            );
                            if(playerSymbol === 1) {
                                boardTile.textContent = 'X';
                            } else if(playerSymbol === 2) {
                                boardTile.textContent = 'O';
                            }
                        }
                    }    
                );

                boardTile.classList.toggle('tile');
                boardRow.appendChild(boardTile);
            }
        }
    }

    const renderStartBtn = () => {
            const startBtn = document.createElement('button');
            startBtn.textContent = 'Start';
            startBtn.addEventListener('click', 
                function() {
                    console.log(body.children);
                    if(body.contains(document.querySelector('div.board'))) {
                        body.removeChild(document.querySelector('div.board'));
                    }
                    renderGameboard();
                    body.contains(document.querySelector('div.board')) ? startBtn.textContent = 'Restart' : startBtn.textContent = 'Start';
                }
            );
            body.appendChild(startBtn);
        }
    renderStartBtn();

    return { renderGameboard};
})();

// display.renderGameboard();