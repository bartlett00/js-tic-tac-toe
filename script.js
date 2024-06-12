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
            console.log(board[row][column].getValue());
        } else {
            return;
        }
    }

    const printBoard = () => {
        console.log(getBoard().map(row => row.map(tile => tile.getValue())));
    }

    return { playXorO, getBoard, printBoard };
}

//method for checking for ending the game(win or draw)
//method for changing player turn (round based)
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
        const winConditions = {
            row1: [1,1,1, 0,0,0, 0,0,0],
            row2: [0,0,0, 1,1,1, 0,0,0],
            row3: [0,0,0, 0,0,0, 1,1,1],
            col1: [1,0,0, 1,0,0, 1,0,0],
            col2: [0,1,0, 0,1,0, 0,1,0],
            col3: [0,0,1, 0,0,1, 0,0,1],
            diag1: [1,0,0, 0,1,0, 0,0,1],
            diag2: [0,0,1, 0,1,0, 1,0,0]
        };

        let valueArr = [];
        (board.getBoard()).map(row => {
            row.map(tile => valueArr.push(tile.getValue()));
        });
        //console.log(valueArr);

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
                //console.log(winningArr);
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

    //printRound();

    return {playRound, getCurrentPlayer, checkWin};
}

const game = Controller();
const game2 = Controller();
const game3 = Controller();
const game4 = Controller();
//tie 
/*
game.playRound(0,0);
game.playRound(1,0);
game.playRound(2,0);
game.playRound(0,1);
game.playRound(0,2);
game.playRound(2,2);
game.playRound(2,1);
game.playRound(1,1);
game.playRound(1,2);
*/
//player 1 wins (column)
/*
game2.playRound(0,0);
game2.playRound(2, 2);
game2.playRound(1,0)
game2.playRound(0, 1)
game2.playRound(2,0);
*/
//player 2 wins (diag)
/*
game3.playRound(0,0)
game3.playRound(0,1)
game3.playRound(2,2)
game3.playRound(1,1)
game3.playRound(2,1)
game3.playRound(0,2)
game3.playRound(1,2)
game3.playRound(2,0)
*/
//any player wins (row)
game4.playRound(0,0)
game4.playRound(1,0)
game4.playRound(0,1)
game4.playRound(1,1)
game4.playRound(0,2)