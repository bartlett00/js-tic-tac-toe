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
    let players = [
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
    
    
    const getDisplayText = () => displayText;
    
    const changeTurn = () => {
        currentPlayer = currentPlayer === players[0] ? players[1] : players[0];
    };
    
    const setPlayer = (playerNum, name) => {
        players[playerNum - 1].name = name;
    };

    const getCurrentPlayer = () => currentPlayer;
    let displayText = `${getCurrentPlayer().name} start!`;

    const printRound = () => {
        board.printBoard();
        displayText = `${getCurrentPlayer().name} turn`;
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
                    displayText =`${getCurrentPlayer().name} wins!`;
                    board.printBoard();
                    return;
                }
        });

        if(!(valueArr.includes(0))) {
            if(!win) {
                draw = true;
                win = false;
                displayText = 'its a draw!';
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

    return { 
        playRound, 
        getCurrentPlayer, 
        checkWin, 
        getWin, 
        getDraw, 
        getDisplayText, 
        setPlayer 
    };
};

const display = (function Display() {
    let controller = Controller();
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
                           if(boardTile.textContent == '') {
                                if(playerSymbol === 1) {
                                    boardTile.textContent = 'X';
                                } else if(playerSymbol === 2) {
                                    boardTile.textContent = 'O';
                                }
                           } 

                        }
                        changeTextDisplay(controller.getDisplayText());
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
            startBtn.classList.toggle('start-btn');
            startBtn.addEventListener('click', 
                function() {
                    console.log(body.children);
                    if(body.contains(document.querySelector('div.board'))) {
                        body.removeChild(document.querySelector('div.board'));
                    }
                    controller = Controller(name1, name2);
                    changeTextDisplay(controller.getDisplayText());
                    renderGameboard();
                    body.contains(document.querySelector('div.board')) ? startBtn.textContent = 'Restart' : startBtn.textContent = 'Start';
                }
            );
            body.appendChild(startBtn);
        }
    renderStartBtn();

    const textDisplay = document.createElement('div');
    textDisplay.classList.toggle('text-display');
    body.appendChild(textDisplay);
    textDisplay.textContent = controller.getDisplayText();

    const changeTextDisplay = (text) => {
        textDisplay.textContent = text;
    }

    const playerNames = document.querySelector('#namesForm');
    let name1;
    let name2;

    playerNames.addEventListener('submit', (e) => {
        e.preventDefault();
        let player1 = document.querySelector('#player-one').value;
        let player2 = document.querySelector('#player-two').value;

        name1 = player1;
        name2 = player2;

        controller.setPlayer(1, player1);
        controller.setPlayer(2, player2);

        changeTextDisplay(`${player1} starts!`);
    });
})();
