const emojis = ['🍎', '🐶', '🎈', '🚗', '🌟', '🍕', '🐱', '⚽'];
let cards = [...emojis, ...emojis];
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let seconds = 0;
let timerInterval;

const board = document.getElementById('gameBoard');
const timer = document.getElementById('timer');
const movesDisplay = document.getElementById('moves');

// Shuffle cards
cards.sort(() => 0.5 - Math.random());

function startTimer() {
  timerInterval = setInterval(() => {
    seconds++;
    timer.textContent = `Time: ${seconds}s`;
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}

function updateMoves() {
  moves++;
  movesDisplay.textContent = `Moves: ${moves}`;
}

function createBoard() {
  cards.forEach(emoji => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.emoji = emoji;
    card.textContent = '';
    card.addEventListener('click', handleCardClick);
    board.appendChild(card);
  });
}

function handleCardClick(e) {
  const card = e.target;

  if (flippedCards.length === 0 && moves === 0) {
    startTimer();
  }

  if (
    card.classList.contains('flipped') ||
    card.classList.contains('matched') ||
    flippedCards.length === 2
  ) return;

  card.classList.add('flipped');
  card.textContent = card.dataset.emoji;
  flippedCards.push(card);

  if (flippedCards.length === 2) {
    updateMoves();
    const [card1, card2] = flippedCards;

    if (card1.dataset.emoji === card2.dataset.emoji) {
      card1.classList.add('matched');
      card2.classList.add('matched');
      flippedCards = [];
      matchedPairs++;

      if (matchedPairs === emojis.length) {
        stopTimer();
        showWinMessage();
      }
    } else {
      setTimeout(() => {
        card1.classList.remove('flipped');
        card2.classList.remove('flipped');
        card1.textContent = '';
        card2.textContent = '';
        flippedCards = [];
      }, 1000);
    }
  }
}

function showWinMessage() {
  document.getElementById('win-message').style.display = 'block';
  document.getElementById('final-stats').textContent = `You won in ${moves} moves and ${seconds} seconds!`;
}

function restartGame() {
  location.reload();
}

createBoard();
