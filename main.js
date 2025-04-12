const pits = document.querySelectorAll('.pit');
const player1Store = document.getElementById('player1-store');
const player2Store = document.getElementById('player2-store');
const turnDisplay = document.getElementById('turn-display');

let board = {
  player1: [4, 4, 4, 4, 4, 4],
  player2: [4, 4, 4, 4, 4, 4],
  stores: {
    player1: 0,
    player2: 0
  }
};

let currentPlayer = 'player1';

function updateBoard() {
  pits.forEach(pit => {
    const player = pit.dataset.player;
    const index = parseInt(pit.dataset.index);
    pit.textContent = board[player][index];
  });

  player1Store.textContent = board.stores.player1;
  player2Store.textContent = board.stores.player2;

  turnDisplay.textContent = `${currentPlayer === 'player1' ? "Player 1" : "Player 2"}'s Turn`;
}

function isGameOver() {
  const p1Empty = board.player1.every(seeds => seeds === 0);
  const p2Empty = board.player2.every(seeds => seeds === 0);
  return p1Empty || p2Empty;
}

function collectRemainingStones() {
  board.stores.player1 += board.player1.reduce((a, b) => a + b, 0);
  board.stores.player2 += board.player2.reduce((a, b) => a + b, 0);
  board.player1.fill(0);
  board.player2.fill(0);
}

function declareWinner() {
  let message;
  if (board.stores.player1 > board.stores.player2) {
    message = 'Player 1 wins!';
  } else if (board.stores.player2 > board.stores.player1) {
    message = 'Player 2 wins!';
  } else {
    message = 'It\'s a tie!';
  }
  alert(`Game Over! ${message}`);
}

function playTurn(player, index) {
  if (player !== currentPlayer || board[player][index] === 0) return;

  let seeds = board[player][index];
  board[player][index] = 0;

  let side = player;
  let i = index;

  while (seeds > 0) {
    i++;

    if (side === 'player1') {
      if (i === 6) {
        if (currentPlayer === 'player1') {
          board.stores.player1++;
          seeds--;
          if (seeds === 0) {
            updateBoard();
            checkEnd();
            return; // Player gets another turn
          }
        }
        i = -1;
        side = 'player2';
      } else {
        board.player1[i]++;
        seeds--;
      }
    } else {
      if (i === 6) {
        if (currentPlayer === 'player2') {
          board.stores.player2++;
          seeds--;
          if (seeds === 0) {
            updateBoard();
            checkEnd();
            return; // Player gets another turn
          }
        }
        i = -1;
        side = 'player1';
      } else {
        board.player2[i]++;
        seeds--;
      }
    }
  }

  currentPlayer = currentPlayer === 'player1' ? 'player2' : 'player1';
  updateBoard();
  checkEnd();
}

function checkEnd() {
  if (isGameOver()) {
    collectRemainingStones();
    updateBoard();
    declareWinner();
  }
}

pits.forEach(pit => {
  pit.addEventListener('click', () => {
    const player = pit.dataset.player;
    const index = parseInt(pit.dataset.index);
    playTurn(player, index);
  });
});

updateBoard();
