const pits = document.querySelectorAll('.pit');
const player1Store = document.getElementById('player1-store');
const player2Store = document.getElementById('player2-store');
const turnDisplay = document.getElementById('turn-display');
const vsComputerCheckbox = document.getElementById('vs-computer');

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

  turnDisplay.textContent = `${currentPlayer === 'player1' ? 'Player 1' : 'Player 2'}'s Turn`;
}

function distributeStones(player, index) {
  let stones = board[player][index];
  board[player][index] = 0;

  const map = [];
  for (let i = 0; i < 14; i++) {
    if (i < 6) map.push({ player: 'player1', index: i });
    else if (i === 6) map.push({ store: 'player1' });
    else if (i < 13) map.push({ player: 'player2', index: i - 7 });
    else map.push({ store: 'player2' });
  }

  let flatIndex = player === 'player1' ? index : index + 7;

  while (stones > 0) {
    flatIndex = (flatIndex + 1) % 14;

    if (player === 'player1' && flatIndex === 13) continue;
    if (player === 'player2' && flatIndex === 6) continue;

    const pos = map[flatIndex];
    if (pos.store) {
      board.stores[pos.store]++;
    } else {
      board[pos.player][pos.index]++;
    }

    stones--;
  }

  const landedInOwnStore =
    (player === 'player1' && flatIndex === 6) ||
    (player === 'player2' && flatIndex === 13);

  if (!landedInOwnStore) {
    currentPlayer = currentPlayer === 'player1' ? 'player2' : 'player1';
  }

  updateBoard();

  // If it's now the computer's turn, let it play
  if (currentPlayer === 'player2' && vsComputerCheckbox.checked) {
    setTimeout(playComputerMove, 500);
  }
}

function playComputerMove() {
  // Simple AI: choose the first non-empty pit
  for (let i = 0; i < 6; i++) {
    if (board.player2[i] > 0) {
      distributeStones('player2', i);
      break;
    }
  }
}

pits.forEach(pit => {
  pit.addEventListener('click', () => {
    const player = pit.dataset.player;
    const index = parseInt(pit.dataset.index);

    if (player !== currentPlayer) return;
    if (board[player][index] === 0) return;

    distributeStones(player, index);
  });
});

updateBoard();