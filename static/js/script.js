// --- State ---
const state = {
  theme: 'theme-dark',
  difficulty: 'hard',
  playerSide: 'X',
  scores: { player: 0, ai: 0, draw: 0 },
  board: Array(9).fill(""),
  winStreak: 0,
  moveCount: 0,
  gameMode: 'pvc',
  moveHistory: [],
  soundEnabled: true,
  gameStartTime: null,
  timerInterval: null
};

// --- Elements ---
const el = {
  body: document.body,
  board: document.getElementById('board'),
  status: document.getElementById('status'),
  cells: () => [...document.querySelectorAll('.cell')],
  difficulty: document.getElementById('difficulty'),
  side: document.getElementById('side'),
  gameMode: document.getElementById('game-mode'),
  newGame: document.getElementById('new-game'),
  resetScores: document.getElementById('reset-scores'),
  resetBoard: document.getElementById('reset-board'),
  undoMove: document.getElementById('undo-move'),
  sPlayer: document.getElementById('score-player'),
  sAI: document.getElementById('score-ai'),
  sDraw: document.getElementById('score-draw'),
  winStreak: document.getElementById('win-streak'),
  themeToggle: document.getElementById('theme-toggle'),
  soundToggle: document.getElementById('sound-toggle'),
  moveCount: document.getElementById('move-count'),
  gameTimer: document.getElementById('game-timer'),
  moveList: document.getElementById('move-list'),
  playerTurnIndicators: document.getElementById('player-turn-indicators')
};

// Sound effects
const sounds = {
  move: new Audio('data:audio/wav;base64,UklGRl4QAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YToQAACBgIF/gn6DgISChYSGhYeGiIeJiIqJi4qMi42Mjo2PjpCPkZCSkZOSlJOVlJaVl5aYl5mYmpmbmpyanZuenJ+doJ6hn6Kgo6GkoqWjpqSmpaemqKeqqKuprKmtqq6rr6ywrbGusq+zsbSytbO2tLe1uLa5t7q4u7m8ur27vry/vcC+wb/CwMPBxMLGw8fEyMTJxcrGy8fMyM3JzsrPy9DM0c3SztPP1NHV0tbT19TY1dnW2tfb2NzZ3dre297c393g3uHf4uDj4eTi5ePm5Ofl6Obp5+ro6+ns6u3r7uzv7fDu8e/y8PPx9PL18/b09/X49vn3+vj7+fz6/fv+/P/9//7/////AA=='),
  win: new Audio('data:audio/wav;base64,UklGRlwQAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YTgQAACAgIF/gn6DgISBhYKGg4eEiIWJhoqHi4iMiY2KjouPjJCNkY6Sj5OQlJGVkpaTl5SYlZmVmpabmJuZnJmdmp6an5ugnKGdoqCjoaSipaOmpKekqaWqpquorKmtqq6rr6ywrbGusq+zsbSytbO2tLe1uLa5t7q4u7m8ur27vry/vcC+wb/CwMPBxMLGw8fEyMTJxcrGy8fMyM3JzsrPy9DM0c3SztPP1NHV0tbT19TY1dnW2tfb2NzZ3dre297c393g3uHf4uDj4eTi5ePm5Ofl6Obp5+ro6+ns6u3r7uzv7fDu8e/y8PPx9PL18/b09/X49vn3+vj7+fz6/fv+/P/9//7/////AA=='),
  draw: new Audio('data:audio/wav;base64,UklGRl4QAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YToQAACBgIF/gn6DgISChYSGhYeGiIeJiIqJi4qMi42Mjo2PjpCPkZCSkZOSlJOVlJaVl5aYl5mYmpmbmpyanZuenJ+doJ6hn6Kgo6GkoqWjpqSmpaemqKeqqKuprKmtqq6rr6ywrbGusq+zsbSytbO2tLe1uLa5t7q4u7m8ur27vry/vcC+wb/CwMPBxMLGw8fEyMTJxcrGy8fMyM3JzsrPy9DM0c3SztPP1NHV0tbT19TY1dnW2tfb2NzZ3dre297c393g3uHf4uDj4eTi5ePm5Ofl6Obp5+ro6+ns6u3r7uzv7fDu8e/y8PPx9PL18/b09/X49vn3+vj7+fz6/fv+/P/9//7/////AA==')
};

// Set volume for sounds
Object.values(sounds).forEach(sound => {
  sound.volume = 0.3;
});

// --- Init ---
function init() {
  applyTheme(state.theme);

  el.difficulty.addEventListener('change', () => {
    state.difficulty = el.difficulty.value;
  });

  el.side.addEventListener('change', () => {
    state.playerSide = el.side.value;
  });

  el.gameMode.addEventListener('change', () => {
    state.gameMode = el.gameMode.value;
    updatePlayerIndicators();
  });

  el.newGame.addEventListener('click', startGame);

  el.resetScores.addEventListener('click', () => {
    state.scores = { player: 0, ai: 0, draw: 0 };
    state.winStreak = 0;
    updateScores();
    playSound(sounds.move);
    el.status.textContent = "Scores reset.";
  });

  el.resetBoard.addEventListener('click', clearBoardOnly);

  el.undoMove.addEventListener('click', undoLastMove);

  // theme toggle button
  el.themeToggle.addEventListener('click', toggleTheme);

  // sound toggle button
  el.soundToggle.addEventListener('click', toggleSound);

  el.cells().forEach(cell => {
    cell.addEventListener('click', () => onCellClick(+cell.dataset.index));
  });

  startGame();
}

function applyTheme(themeClass) {
  el.body.classList.remove('theme-dark', 'theme-light');
  el.body.classList.add(themeClass);
  state.theme = themeClass;
  updateThemeToggleIcon();
}

function toggleTheme() {
  if (state.theme === 'theme-dark') {
    applyTheme('theme-light');
  } else {
    applyTheme('theme-dark');
  }
  playSound(sounds.move);
}

function toggleSound() {
  state.soundEnabled = !state.soundEnabled;
  const icon = el.soundToggle.querySelector('i');
  if (state.soundEnabled) {
    icon.className = 'fas fa-volume-up';
  } else {
    icon.className = 'fas fa-volume-mute';
  }
}

function playSound(sound) {
  if (state.soundEnabled) {
    sound.currentTime = 0;
    sound.play().catch(e => console.log("Audio play failed:", e));
  }
}

function updateThemeToggleIcon() {
  const toggleBtn = el.themeToggle;
  const isDark = state.theme === 'theme-dark';

  if (isDark) {
    toggleBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
  } else {
    toggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
  }
}

function startGame() {
  // Reset game state
  state.board = Array(9).fill("");
  state.moveCount = 0;
  state.moveHistory = [];
  updateMoveCounter();
  updateMoveHistory();

  // Start timer
  resetTimer();
  startTimer();

  const aiFirst = (state.playerSide === 'O' && state.gameMode === 'pvc');
  el.status.textContent = 'Starting...';

  // Simulate API call with timeout
  setTimeout(() => {
    if (aiFirst) {
      // AI makes first move
      const aiMove = getAIMove();
      if (aiMove !== null) {
        const aiSymbol = state.playerSide === 'X' ? 'O' : 'X';
        state.board[aiMove] = aiSymbol;
        addToMoveHistory('AI', aiMove, aiSymbol);
        updateMoveCounter();
      }
    }

    renderBoard(state.board);
    updateScores();
    updatePlayerIndicators();

    if (aiFirst) {
      el.status.textContent = 'Your turn (X).';
    } else {
      el.status.textContent = `Your turn (${state.playerSide}).`;
    }
  }, 500);
}

function clearBoardOnly() {
  state.board = Array(9).fill("");
  state.moveCount = 0;
  state.moveHistory = [];
  renderBoard(state.board);
  updateMoveCounter();
  updateMoveHistory();
  resetTimer();
  startTimer();
  playSound(sounds.move);
  el.status.textContent = 'Board cleared. Start playing!';
}

function onCellClick(index) {
  if (state.board[index] !== "" || isGameOver()) return;

  // Determine current player
  const currentPlayer = state.gameMode === 'pvp' ?
    (state.moveCount % 2 === 0 ? 'X' : 'O') :
    state.playerSide;

  // Make move
  state.board[index] = currentPlayer;
  addToMoveHistory(state.gameMode === 'pvp' ? `Player ${currentPlayer}` : 'You', index, currentPlayer);
  state.moveCount++;
  updateMoveCounter();
  renderBoard(state.board);
  playSound(sounds.move);

  // Check for win
  const winner = checkWinner();
  if (winner) {
    endGame(winner);
    return;
  }

  // Check for draw
  if (isBoardFull()) {
    endGame(null);
    return;
  }

  if (state.gameMode === 'pvc') {
    // AI's turn
    el.status.textContent = 'AI is thinking...';
    setTimeout(() => {
      const aiMove = getAIMove();
      if (aiMove !== null) {
        const aiSymbol = state.playerSide === 'X' ? 'O' : 'X';
state.board[aiMove] = aiSymbol;
addToMoveHistory('AI', aiMove, aiSymbol);

        state.moveCount++;
        updateMoveCounter();
        renderBoard(state.board);
        playSound(sounds.move);

        // Check for win after AI move
        const winner = checkWinner();
        if (winner) {
          endGame(winner);
        } else if (isBoardFull()) {
          endGame(null);
        } else {
          el.status.textContent = 'Your turn.';
        }
      }
    }, 800);
  } else {
    // PvP mode - switch player
    updatePlayerIndicators();
    const nextPlayer = currentPlayer === 'X' ? 'O' : 'X';
    el.status.textContent = `Player ${nextPlayer}'s turn`;
  }
}

function getAIMove() {
    const aiSymbol = state.playerSide === 'X' ? 'O' : 'X';
    const playerSymbol = state.playerSide;

    const emptyCells = state.board
        .map((cell, index) => cell === "" ? index : -1)
        .filter(index => index !== -1);

    if (emptyCells.length === 0) return null;

    if (state.difficulty === 'easy') {
        // Random move
        return emptyCells[Math.floor(Math.random() * emptyCells.length)];
    } 
    else if (state.difficulty === 'medium') {
        // Try to win or block
        const players = [aiSymbol, playerSymbol];
        for (const player of players) {
            for (const index of emptyCells) {
                const testBoard = [...state.board];
                testBoard[index] = player;
                if (checkWinnerOnBoard(testBoard) === player) {
                    return index;
                }
            }
        }
        // Otherwise random
        return emptyCells[Math.floor(Math.random() * emptyCells.length)];
    } 
    else { 
        // Hard mode
        // Try to win
        for (const index of emptyCells) {
            const testBoard = [...state.board];
            testBoard[index] = aiSymbol;
            if (checkWinnerOnBoard(testBoard) === aiSymbol) {
                return index;
            }
        }

        // Try to block
        for (const index of emptyCells) {
            const testBoard = [...state.board];
            testBoard[index] = playerSymbol;
            if (checkWinnerOnBoard(testBoard) === playerSymbol) {
                return index;
            }
        }

        // Take center if available
        if (state.board[4] === "") return 4;

        // Otherwise random
        return emptyCells[Math.floor(Math.random() * emptyCells.length)];
    }
}


function checkWinner() {
  return checkWinnerOnBoard(state.board);
}

function checkWinnerOnBoard(board) {
  const winConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
  ];

  for (const condition of winConditions) {
    const [a, b, c] = condition;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }

  return null;
}

function isBoardFull() {
  return state.board.every(cell => cell !== "");
}

function isGameOver() {
  return checkWinner() !== null || isBoardFull();
}

function endGame(winner) {
  stopTimer();

  if (winner) {
    if (state.gameMode === 'pvc') {
      if (winner === state.playerSide) {
        state.scores.player++;
        state.winStreak++;
        el.status.textContent = 'You win! 🎉';
        playSound(sounds.win);
        showConfetti();
      } else {
        state.scores.ai++;
        state.winStreak = 0;
        el.status.textContent = 'AI wins!';
        playSound(sounds.move);
      }
    } else {
      // PvP mode
      if (winner === 'X') {
        state.scores.player++;
      } else {
        state.scores.ai++; // Using AI counter for Player O in PvP
      }
      state.winStreak = winner === 'X' ? state.winStreak + 1 : 0;
      el.status.textContent = `Player ${winner} wins! 🎉`;
      playSound(sounds.win);
      showConfetti();
    }
  } else {
    state.scores.draw++;
    state.winStreak = 0;
    el.status.textContent = 'Draw!';
    playSound(sounds.draw);
  }

  updateScores();
  highlightWinningCells(winner);
}

function renderBoard(boardArr) {
  el.cells().forEach((c, i) => {
    const v = boardArr[i];
    c.textContent = v;
    c.classList.remove('x', 'o', 'win', 'pop');
    if (v === 'X') c.classList.add('x');
    if (v === 'O') c.classList.add('o');
    if (v) c.classList.add('pop');
  });
}

function updateScores() {
  el.sPlayer.textContent = state.scores.player;
  el.sAI.textContent = state.scores.ai;
  el.sDraw.textContent = state.scores.draw;
  el.winStreak.textContent = state.winStreak;
}

function updateMoveCounter() {
  el.moveCount.textContent = state.moveCount;
}

function updateMoveHistory() {
  el.moveList.innerHTML = state.moveHistory.length === 0 ?
    '<div class="move-item">No moves yet</div>' :
    state.moveHistory.map((move, index) =>
      `<div class="move-item">${index + 1}. ${move.player} placed ${move.symbol} at position ${move.position}</div>`
    ).join('');

  // Scroll to bottom
  el.moveList.scrollTop = el.moveList.scrollHeight;
}

function addToMoveHistory(player, position, symbol) {
  const positionMap = [
    "top-left", "top-middle", "top-right",
    "middle-left", "center", "middle-right",
    "bottom-left", "bottom-middle", "bottom-right"
  ];

  state.moveHistory.push({
    player,
    position: positionMap[position],
    symbol
  });

  updateMoveHistory();
}

function highlightWinningCells(winner) {
  if (!winner) return;

  const winConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
  ];

  for (const condition of winConditions) {
    const [a, b, c] = condition;
    if (state.board[a] && state.board[a] === state.board[b] && state.board[a] === state.board[c]) {
      el.cells().forEach((cell, i) => {
        if (condition.includes(i)) {
          cell.classList.add('win');
        }
      });
      break;
    }
  }
}

function updatePlayerIndicators() {
  if (state.gameMode === 'pvp') {
    el.playerTurnIndicators.style.display = 'flex';
    const currentPlayer = state.moveCount % 2 === 0 ? 'X' : 'O';
    document.querySelectorAll('.player-indicator').forEach(indicator => {
      if (indicator.dataset.player === currentPlayer) {
        indicator.classList.add('active');
      } else {
        indicator.classList.remove('active');
      }
    });
  } else {
    el.playerTurnIndicators.style.display = 'none';
  }
}

function undoLastMove() {
  if (state.moveHistory.length < 1 || isGameOver()) return;

  // Remove the last move
  const lastMove = state.moveHistory.pop();
  state.board[getPositionIndex(lastMove.position)] = "";
  state.moveCount--;

  // In PvP mode, remove two moves (both players)
  if (state.gameMode === 'pvp' && state.moveHistory.length > 0) {
    const secondLastMove = state.moveHistory.pop();
    state.board[getPositionIndex(secondLastMove.position)] = "";
    state.moveCount--;
  }

  renderBoard(state.board);
  updateMoveCounter();
  updateMoveHistory();
  updatePlayerIndicators();
  playSound(sounds.move);
  el.status.textContent = state.gameMode === 'pvp' ?
    `Player ${state.moveCount % 2 === 0 ? 'X' : 'O'}'s turn` :
    'Your turn';
}

function getPositionIndex(positionStr) {
  const positionMap = {
    "top-left": 0, "top-middle": 1, "top-right": 2,
    "middle-left": 3, "center": 4, "middle-right": 5,
    "bottom-left": 6, "bottom-middle": 7, "bottom-right": 8
  };
  return positionMap[positionStr];
}

function startTimer() {
  state.gameStartTime = new Date();
  state.timerInterval = setInterval(updateTimer, 1000);
}

function stopTimer() {
  if (state.timerInterval) {
    clearInterval(state.timerInterval);
    state.timerInterval = null;
  }
}

function resetTimer() {
  stopTimer();
  el.gameTimer.textContent = '00:00';
}

function updateTimer() {
  const now = new Date();
  const diff = Math.floor((now - state.gameStartTime) / 1000);
  const minutes = Math.floor(diff / 60).toString().padStart(2, '0');
  const seconds = (diff % 60).toString().padStart(2, '0');
  el.gameTimer.textContent = `${minutes}:${seconds}`;
}

function showConfetti() {
  const confettiContainer = document.createElement('div');
  confettiContainer.className = 'confetti';
  document.body.appendChild(confettiContainer);

  // Simple confetti effect
  for (let i = 0; i < 50; i++) {
    const confetti = document.createElement('div');
    confetti.style.position = 'absolute';
    confetti.style.width = '10px';
    confetti.style.height = '10px';
    confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
    confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
    confetti.style.left = `${Math.random() * 100}%`;
    confetti.style.animation = `fall ${1 + Math.random() * 2}s linear forwards`;

    // Add keyframes for fall animation
    const style = document.createElement('style');
    style.textContent = `
            @keyframes fall {
                to {
                    top: 100%;
                    transform: rotate(${Math.random() * 360}deg);
                    opacity: 0;
                }
            }
        `;
    document.head.appendChild(style);

    confettiContainer.appendChild(confetti);
  }

  // Remove confetti after animation
  setTimeout(() => {
    document.body.removeChild(confettiContainer);
  }, 3000);
}

document.addEventListener('DOMContentLoaded', init);
