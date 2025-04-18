const pits = document.querySelectorAll('.pit');
const player1Store = document.getElementById('player1-store');
const player2Store = document.getElementById('player2-store');
const turnDisplay = document.getElementById('turn-display');

// Initial game state
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

pits.forEach(pit => {
  pit.addEventListener('click', () => {
    const player = pit.dataset.player;
    const index = parseInt(pit.dataset.index);

    if (player !== currentPlayer) return; // Not your turn
    if (board[player][index] === 0) return; // Can't pick empty pit

    let stones = board[player][index];
    board[player][index] = 0;

    let positions = [
      ...board.player1,
      board.stores.player1,
      ...board.player2,
      board.stores.player2
    ];

    // Build flat board with indexes to map back later
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

      // Skip opponent's store
      if (currentPlayer === 'player1' && flatIndex === 13) continue;
      if (currentPlayer === 'player2' && flatIndex === 6) continue;

      const pos = map[flatIndex];
      if (pos.store) {
        board.stores[pos.store]++;
      } else {
        board[pos.player][pos.index]++;
      }

      stones--;
    }

    // Determine if last stone landed in own store
    const lastPos = map[flatIndex];
    const landedInOwnStore =
      (currentPlayer === 'player1' && flatIndex === 6) ||
      (currentPlayer === 'player2' && flatIndex === 13);

    if (!landedInOwnStore) {
      currentPlayer = currentPlayer === 'player1' ? 'player2' : 'player1';
    }

    updateBoard();
  });
});

updateBoard();
