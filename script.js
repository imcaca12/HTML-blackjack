let deck = [];
let player = [];
let dealer = [];
let balance = 1000;
let bet = 100;
let gameOver = false;

const suits = ["♠", "♥", "♦", "♣"];
const values = [
  {name: "A", val: 11},
  {name: "2", val: 2},
  {name: "3", val: 3},
  {name: "4", val: 4},
  {name: "5", val: 5},
  {name: "6", val: 6},
  {name: "7", val: 7},
  {name: "8", val: 8},
  {name: "9", val: 9},
  {name: "10", val: 10},
  {name: "J", val: 10},
  {name: "Q", val: 10},
  {name: "K", val: 10}
];

function createDeck() {
  deck = [];
  for (let suit of suits) {
    for (let value of values) {
      deck.push({name: value.name, suit: suit, val: value.val});
    }
  }
  deck.sort(() => Math.random() - 0.5);
}

function drawCard(hand) {
  hand.push(deck.pop());
}

function calculateScore(hand) {
  let score = 0;
  let aces = 0;

  for (let card of hand) {
    score += card.val;
    if (card.name === "A") aces++;
  }

  while (score > 21 && aces > 0) {
    score -= 10;
    aces--;
  }

  return score;
}

function render() {
  const playerDiv = document.getElementById("player-cards");
  const dealerDiv = document.getElementById("dealer-cards");

  playerDiv.innerHTML = "";
  dealerDiv.innerHTML = "";

  player.forEach(c => {
    playerDiv.innerHTML += `<div class="card">${c.name}${c.suit}</div>`;
  });

  dealer.forEach(c => {
    dealerDiv.innerHTML += `<div class="card">${c.name}${c.suit}</div>`;
  });

  document.getElementById("player-score").innerText = calculateScore(player);
  document.getElementById("dealer-score").innerText = calculateScore(dealer);
  document.getElementById("balance").innerText = balance;
}

function startGame() {
  bet = parseInt(document.getElementById("bet").value);
  if (bet > balance) return alert("Not enough balance!");

  gameOver = false;
  document.getElementById("result").innerText = "";

  createDeck();
  player = [];
  dealer = [];

  drawCard(player);
  drawCard(player);
  drawCard(dealer);
  drawCard(dealer);

  render();
}

function hit() {
  if (gameOver) return;
  drawCard(player);

  if (calculateScore(player) > 21) {
    endGame();
  }

  render();
}

function stand() {
  if (gameOver) return;

  while (calculateScore(dealer) < 17) {
    drawCard(dealer);
  }

  endGame();
  render();
}

function endGame() {
  gameOver = true;

  let p = calculateScore(player);
  let d = calculateScore(dealer);
  let result = "";

  if (p > 21) {
    result = "You Bust! Lose.";
    balance -= bet;
  } else if (d > 21 || p > d) {
    result = "You Win!";
    balance += bet;
  } else if (p < d) {
    result = "Dealer Wins!";
    balance -= bet;
  } else {
    result = "Push!";
  }

  document.getElementById("result").innerText = result;
}
