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
        if(selectedTile.getValue() === 0) {
            board.playXorO(row, column, getCurrentPlayer().symbol);
            checkWin();
        }
    };

    const checkWin = () => {

        let win = false;
        let draw = false;
        const getWin = () => win;
        const getDraw  = () => draw;

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
            draw = true;
            win = false;
            console.log('its a draw!');
            board.printBoard();
            return;
        }

        if(!win && !draw) {
            changeTurn();
            printRound();
            return;
        }
    }

    return {playRound, getCurrentPlayer, checkWin};
};

const display = (function Display() {
    const controller = Controller();
    const gameboard = Gameboard();
    const body = document.querySelector('body');


    const renderGameboard = () => {
        const boardContainer = document.createElement('div');
        boardContainer.classList.add('board');
        body.appendChild(boardContainer);
        for(let i = 0; i < 3; i++) {
            console.log(i);
            const boardRow = document.createElement('div');
            boardRow.classList.toggle('row');
            boardRow.setAttribute('data-row', i);
            boardContainer.appendChild(boardRow);
            for (let j = 0; j < 3; j++) {
                console.log(j);
                const boardTile = document.createElement('div');
                boardTile.setAttribute('data-column', j);
                boardTile.setAttribute('data-row', boardRow.dataset.row);
                boardTile.addEventListener('click', handlePlaceSymbol(boardTile.dataset.row, boardTile.dataset.column));
                boardTile.classList.toggle('tile');
                boardRow.appendChild(boardTile);
            }
        }

    }

     function handlePlaceSymbol(row, column) {
        gameboard.playXorO(parseInt(row), parseInt(column));
     }



    return { renderGameboard};
})();

display.renderGameboard();