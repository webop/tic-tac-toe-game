"use strict";

// GAME BOARD MODULE
const gameBoard = (() => {
    let gameBoardDisplay = document.getElementById('game-board');

    let gameBoardArray = [' ' , ' ' , ' ' , ' ' , ' ' , ' ' , ' ' , ' ' , ' ' ];

    const clearGameBoard = function() {
        this.gameBoardArray = [' ' , ' ' , ' ' , ' ' , ' ' , ' ' , ' ' , ' ' , ' ' ];
    }

    const createGameBoard = function() {
        for (var i = 0; i < this.gameBoardArray.length; i++) {
            let markSpace = document.createElement('div');
            markSpace.className = 'mark';
            markSpace.dataset.id = i;
            markSpace.textContent = this.gameBoardArray[i];
            
            let placeholderElem = document.createElement('span');
            placeholderElem.className = 'hidden';
            placeholderElem.textContent = 'Hidden';
            markSpace.appendChild(placeholderElem);
    
            this.gameBoardDisplay.appendChild(markSpace);
        }
    }

    return {gameBoardDisplay, gameBoardArray, createGameBoard, clearGameBoard};
})();


// PLAYER FACTORY
const Player = (name, mark) => {
    let spotsPlayed = [];

    const clearPlayer = function() {
        this.spotsPlayed = [];
    }

    const play = function(id) {
        this.spotsPlayed.push(id);
    };

    return { name, mark, spotsPlayed, play, clearPlayer };
};


// Create the two players
let player1 = Player('Player 1', 'x');
let player2 = Player('Player 2', 'o');


// DISPLAY CONTROLLER MODULE
const displayController = (() => {
    let currentPlayer = player1;
    let winningLine = null;
    let gameStarted = true;
    let gameFinished = false;

    const checkForWinner = function() {
        let winningCombinations = [ [0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6] ];

        for (let i = 0; i < winningCombinations.length; i++) {
            if (winningCombinations[i].every(elem => currentPlayer.spotsPlayed.indexOf(elem) > -1)) {
                document.getElementById('title').textContent = `${currentPlayer.name} WON!`;

                winningLine = winningCombinations[i];

                gameFinished = true;
            }
        }
    };

    const setPlayer = function() {
        gameStarted = true;
        return currentPlayer === player1 ? currentPlayer = player2 : currentPlayer = player1;
    };

    const announceNextPlayer = function () {
        let nextPlayerDisplay = document.getElementById('title');
        currentPlayer === player1 ? nextPlayerDisplay.textContent = `${player2.name}'s turn` : nextPlayerDisplay.textContent = `${player1.name}'s turn`;
    };

    const printGame = function() {
        gameBoard.createGameBoard();

        gameBoard.gameBoardDisplay.addEventListener('click', () => {
            displayController.playGame(event);
        });
    };

    const playGame = function(event) {
        if (event.target.className === 'mark') {

            let markDOM = event.target;
            let id = parseInt(markDOM.dataset.id);
    
            gameBoard.gameBoardArray.forEach((curr, index) => {
                if (index ===  id) {
    
                    if (gameBoard.gameBoardArray[index] === ' ') {
    
                        // 1. Set current player
                        setPlayer();
    
                        // 2. Place the current players mark in the data structure
                        gameBoard.gameBoardArray[index] = currentPlayer.mark;
    
                        // 3. Store the current players spot played
                        currentPlayer.play(id);
    
                        // 4. Place the current players mark in the UI
                        markDOM.textContent = currentPlayer.mark;
    
                        // 5. Check for a winning combination
                        checkForWinner();
                        
                        // 6. Print out the next player
                        if (!gameFinished) announceNextPlayer();

                        // 7. Check for a tie
                        if (!gameFinished && !gameBoard.gameBoardArray.includes(' ')) {
                            document.getElementById('title').textContent = `It's a DRAW!`;
                        }

                        // 8. Make the game board unclickable if the game is finished and highlight winning line
                        if (gameFinished) {
                            gameBoard.gameBoardDisplay.className = 'game-finished';

                            let spots = document.querySelectorAll('.mark');

                            for (let i = 0; i < spots.length; i++) {
                                for (let j = 0; j < winningLine.length; j++) {
                                    if (parseInt(spots[i].dataset.id) === winningLine[j]) {
                                        spots[i].classList.add('winningLine');
                                    }
                                }
                            }
                        }

                    }
                }
            });
        }
    };

    const clearGame = function() {
        player1.clearPlayer();
        player2.clearPlayer();
        gameBoard.clearGameBoard();

        gameFinished = false;
        gameStarted = false;
        currentPlayer = player1;

        Array.from(gameBoard.gameBoardDisplay.children).forEach(elem => elem.remove());

        document.getElementById('title').textContent = `Tic Tac Toe`;
        gameBoard.gameBoardDisplay.className = '';

        printGame();
    };

    return { playGame, printGame, clearGame };
})();

// Init Game
displayController.printGame();