const suits = { SPADES: "♠️", HEARTS: "❤️", CLUBS: "♣️", DIAMONDS: "♦️" };

const main = () => {
  console.log("hihi");
  const playBtn = document.querySelector(".playBtn");
  playBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const user_input = document.querySelector("#startValues").value;

    const deck = getDeck(getUsersInputCards(user_input));

    console.log(deck);
    //hide
    const start_form = document.querySelector(".start");
    start_form.style.display = "none";
  });
};

const range = (...args) => {
  let arr = new Array();
  let start, end, inc;

  if (args.length === 1) {
    start = 0;
    end = args[0];
    inc = 1;
  } else if (args.length === 2) {
    start = args[0];
    end = args[1];
    inc = 1;
  } else if (args.length === 3) {
    start = args[0];
    end = args[1];
    inc = args[2];
  } else {
    start = 0;
    end = 0;
    inc = 0;
  }

  for (let i = start; i < end; i += inc) {
    arr.push(i);
  }

  return arr;
};

const getUsersInputCards = (input) => {
  const ranks = input.split(",");
  let cards = [];

  for (let i = 0; i < ranks.length; i++) {
    cards.push({
      suit: suits.DIAMONDS,
      rank: ranks[i],
    });
  }

  return cards;
};

const generateDeck = () => {
  let alpha = ["J", "Q", "K", "A"];
  let deck = [];

  let ranks = range(2, 11).map(String);

  ranks = ranks.concat(alpha);

  for (let i = 0; i < Object.values(suits).length; i++) {
    for (let j = 0; j < ranks.length; j++) {
      let new_card = {
        suit: Object.values(suits)[i],
        rank: ranks[j],
      };
      deck.push(new_card);
    }
  }

  return deck;
};

const shuffle = (deck) => {
  let shuffleDeck = [...deck];
  //From first element to last element, each element change the location that located an random element
  for (let i = 0; i < shuffleDeck.length; i++) {
    let rand_index = Math.floor(Math.random() * (i + 1));
    [shuffleDeck[i], shuffleDeck[rand_index]] = [
      shuffleDeck[rand_index],
      shuffleDeck[i],
    ];
  }

  return shuffleDeck;
};

const getDeck = (user_input = []) => {
  const deck = generateDeck();
  const shuffledDeck = shuffle(deck);

  for (let i = user_input.length - 1; i >= 0; i--) {
    const index = shuffledDeck.findIndex(
      (e) => e.suit === user_input[i].suit && e.rank === user_input[i].suit
    );
    shuffledDeck.splice(index, 1);
    shuffledDeck.unshift(user_input[i]);
  }

  return shuffledDeck;
};

document.addEventListener("DOMContentLoaded", main);
