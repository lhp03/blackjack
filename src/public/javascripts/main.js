const suits = { SPADES: "♠️", HEARTS: "❤️", CLUBS: "♣️", DIAMONDS: "♦️" };

let isEnd = false;

const main = () => {
  const playBtn = document.querySelector(".playBtn");
  playBtn.addEventListener("click", (e) => {
    e.preventDefault();
    //hide
    const start_form = document.querySelector(".start");
    start_form.style.display = "none";

    //createDeck and deal cards
    initBlackJack();
  });
};

const calcTotal = (cards) => {
  const cards_tmp = [...cards];

  let total = 0;
  cards_tmp.sort((elem1, elem2) => {
    if (elem1.rank < elem2.rank) {
      return -1;
    } else if (elem1.rank > elem2.rank) {
      return 1;
    } else {
      return 0;
    }
  });

  cards_tmp.map((elem) => {
    if (elem.rank === "A") {
      if (total + 11 > 21) {
        total += 1;
      } else {
        total += 11;
      }
    } else if (elem.rank === "K" || elem.rank === "Q" || elem.rank === "J") {
      total += 10;
    } else {
      total += parseInt(elem.rank);
    }
  });

  return total;
};

const initBlackJack = () => {
  const user_input = document.querySelector("#startValues").value;
  const deck = getDeck(getUsersInputCards(user_input));

  const computer_hand = [];
  const user_hand = [];

  computer_hand.push(deck.shift());
  user_hand.push(deck.shift());
  computer_hand.push(deck.shift());
  user_hand.push(deck.shift());

  const game_div = document.querySelector(".game");
  game_div.innerHTML = "";
  const computer_hand_div = document.createElement("div");
  computer_hand_div.className = "computer-hand";
  const user_hand_div = document.createElement("div");
  user_hand_div.className = "user-hand";

  game_div.appendChild(computer_hand_div);
  game_div.appendChild(user_hand_div);

  displayCards(user_hand, "user");
  displayCards(computer_hand, "computer");

  const hit_btn = document.createElement("button");
  const stand_btn = document.createElement("button");
  const hit_btn_text = document.createTextNode("HIT");
  const stand_btn_text = document.createTextNode("STAND");

  const game_btn_div = document.createElement("div");
  game_btn_div.className = "game-btn-div";
  game_div.appendChild(game_btn_div);

  hit_btn.appendChild(hit_btn_text);
  hit_btn.className = "button hit-btn";
  stand_btn.appendChild(stand_btn_text);
  stand_btn.className = "button stand-btn";

  game_btn_div.appendChild(hit_btn);
  game_btn_div.appendChild(stand_btn);

  //blackjack
  if (calcTotal(user_hand) == 21) {
    console.log("BLACKJACK!! USER WIN!!");
    endGame(user_hand, computer_hand, "blackjack");
  }

  hit_btn.addEventListener("click", () => {
    user_hand.push(deck.shift());
    displayCards(user_hand, "user");
    if (calcTotal(user_hand) > 21) {
      console.log("BURST!!! COMPUTER WIN!!!");
      endGame(user_hand, computer_hand, "userburst");
      return;
    }
  });

  stand_btn.addEventListener("click", () => {
    while (calcTotal(computer_hand) < 17 && !isEnd) {
      computer_hand.push(deck.shift());
      if (calcTotal(computer_hand) > 21) {
        console.log("USER WIN!!");
        endGame(user_hand, computer_hand, "computerburst");
        return;
      }
      displayCards(computer_hand, "computer");
    }

    if (calcTotal(user_hand) > calcTotal(computer_hand)) {
      console.log("USER WIN!!");
      endGame(user_hand, computer_hand, "userwin");
      return;
    } else if (calcTotal(user_hand) < calcTotal(computer_hand)) {
      console.log("COMPUTER WIN!!!!");
      endGame(user_hand, computer_hand, "computerwin");
      return;
    } else {
      console.log("TIE!!!");
      endGame(user_hand, computer_hand, "tie");
      return;
    }
  });
};

const endGame = (user_hand, computer_hand, option) => {
  const game_div = document.querySelector(".game");
  const game_btn_div = document.querySelector(".game-btn-div");

  isEnd = true;

  let result;
  if (option === "blackjack") {
    result = "BLACKJACK!! USER WIN!!!";
  } else if (option === "userburst") {
    result = "USER BURST!! COMPUTER WIN!!";
  } else if (option === "computerburst") {
    result = "COMPUTER BURST!! USER WIN!!";
  } else if (option === "userwin") {
    result = "USER WIN!!";
  } else if (option === "computerwin") {
    result = "COMPUTER WIN!!";
  } else {
    result = "TIE";
  }
  const result_head = document.createElement("h2");
  const result_text = document.createTextNode(result);
  result_head.className = "result-head ";
  result_head.appendChild(result_text);

  game_div.appendChild(result_head);
  game_btn_div.innerHTML = "";

  displayCards(computer_hand, "computer");
  displayCards(user_hand, "user");

  //post result
  const data = {
    user: JSON.stringify(user_hand),
    user_total: calcTotal(user_hand),
    computer: JSON.stringify(computer_hand),
    computer_total: calcTotal(computer_hand),
    result: result,
  };

  console.log(user_hand);
  console.log(computer_hand);

  let form = document.createElement("form");
  form.setAttribute("method", "POST");
  form.setAttribute("action", "/result");

  for (const prop in data) {
    let field = document.createElement("input");
    field.setAttribute("type", "hidden");
    field.setAttribute("name", prop);
    field.setAttribute("value", data[prop]);
    form.append(field);
  }

  document.body.appendChild(form);
  form.submit();
  form.remove();

  const restart_btn = document.createElement("button");
  restart_btn.className = "button restart-btn";
  const restart_text = document.createTextNode("Restart");

  restart_btn.appendChild(restart_text);
  restart_btn.addEventListener("click", () => {
    isEnd = false;
    initBlackJack();
  });

  game_btn_div.appendChild(restart_btn);
};

const getCardImg = (card) => {
  if (card === "Hidden") {
    return "/card_img/Card-back.png";
  } else {
    const suit =
      card.suit === suits.SPADES
        ? "S"
        : card.suit === suits.HEARTS
        ? "H"
        : card.suit === suits.DIAMONDS
        ? "D"
        : card.suit === suits.CLUBS
        ? "C"
        : "";
    return `/card_img/${card.rank}${suit}.png`;
  }
};

const displayCards = (cards, option) => {
  if (option === "user") {
    const user_hand_div = document.querySelector(".user-hand");
    user_hand_div.innerHTML = "";

    if (document.querySelector(".user-title") != undefined) {
      document.querySelector(".user-title").remove();
    }

    const user_hand_head = document.createElement("h2");
    user_hand_head.className = "user-title";
    user_hand_head.appendChild(
      document.createTextNode(`USER HAND - ${calcTotal(cards)}`)
    );
    document.querySelector(".game").insertBefore(user_hand_head, user_hand_div);

    cards.map((elem, i) => {
      const card_div = document.createElement("div");
      const card_img = document.createElement("img");
      card_img.src = getCardImg(elem);
      card_img.width = "138";
      card_img.height = "210";
      card_div.className = `card card-${i}`;
      card_div.appendChild(card_img);
      user_hand_div.appendChild(card_div);
    });

    user_hand_div.appendChild(document.createElement("br"));
  } else if (option === "computer") {
    const computer_hand_div = document.querySelector(".computer-hand");
    computer_hand_div.innerHTML = "";

    if (document.querySelector(".computer-title") != undefined) {
      document.querySelector(".computer-title").remove();
    }

    const computer_hand_head = document.createElement("h2");
    computer_hand_head.className = "computer-title";

    computer_hand_head.appendChild(
      document.createTextNode(
        `COMPUTER HAND - ${isEnd ? calcTotal(cards) : "?"}`
      )
    );

    document
      .querySelector(".game")
      .insertBefore(computer_hand_head, computer_hand_div);

    cards.map((elem, i) => {
      if (i === 0 && !isEnd) {
        const hidden_div = document.createElement("div");
        const card_img = document.createElement("img");
        card_img.src = getCardImg("Hidden");
        card_img.width = "138";
        card_img.height = "210";
        hidden_div.className = `card hidden`;
        hidden_div.appendChild(card_img);
        computer_hand_div.append(hidden_div);
      } else {
        const card_div = document.createElement("div");
        const card_img = document.createElement("img");
        card_img.src = getCardImg(elem);
        card_img.width = "138";
        card_img.height = "210";
        card_div.className = `card card-${i}`;
        card_div.appendChild(card_img);
        computer_hand_div.appendChild(card_div);
      }
    });
    computer_hand_div.appendChild(document.createElement("br"));
  }
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

  if (input !== "") {
    for (let i = 0; i < ranks.length; i++) {
      cards.push({
        suit: suits.DIAMONDS,
        rank: ranks[i],
      });
    }
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
