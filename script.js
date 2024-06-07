function Gameboard() {
    const board = [];
    const rows = 3;
    const columns = 3;

    function Tile() {
        let value = 0;

        const XorO = (player) => {
            value = player;
        }

        const getValue = () => value;

        return { XorO, getValue };
    }

    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i].push(Tile());
        }
    }

    const getBoard = () => board;

    const playXorO = (row, column, player) => {
        if(board[row][column].getValue() === 0) {
            board[row][column].XorO(player);
            console.log(board[row][column].getValue());
        } else {
            return;
        }
    }

    const printBoard = () => {
        console.log(getBoard());
    }

    return { playXorO, getBoard, printBoard };
}



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
        if(((board.getBoard())[row][column].getValue() === 0)) {
            board.playXorO(row, column, getCurrentPlayer().symbol);
            changeTurn();
            printRound();
        }
    };

    const checkWin = () => {
        //check state of board
        
        //look for winner (8 ways of winning)
        //end game if winner/draw
    }

    printRound();

    return {playRound, getCurrentPlayer};
}

const game = Controller();

game.playRound(1, 2);
game.playRound(1, 2);


