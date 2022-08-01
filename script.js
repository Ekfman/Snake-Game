let table = document.querySelector("table");
let left = [0, -1];
let right = [0, 1];
let up = [-1, 0];
let down = [1, 0];
let gameState = {};
let scoreEl = document.querySelector("#reps");
let score = 0;
let highScoreEl = document.querySelector("#pr");
let highScore = 0;
let buttonEl = document.querySelector("button");
let verticalSound = new Audio ("assets/pop.wav");
let foodSound = new Audio ("assets/food.wav");
let horizontalSound = new Audio ("assets/bubble.mp3");
let endSound = new Audio ("assets/endGame.wav")

function renderGameState() {
  gameState = {
    board: [
      ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    ],
    food: [11, 8],
    snake: {
      body: [
        [13, 9],
        [13, 10],
        [13, 11],
      ],
      nextDirection: [0, -1],
    },
    speed: 200
  };
}

function initFood() {
  let foodY = gameState.food[0];
  let foodX = gameState.food[1];
  gameState.board[foodY][foodX] = "food";
}

function snakeGen() {
  for (let i = 0; i < gameState.snake.body.length; i++) {
    let currentCell = gameState.snake.body[i];
    if(currentCell[0] >= 0 && currentCell[0] <= 14 && currentCell[1] >= 0 && currentCell[1] <= 14){
        gameState.board[currentCell[0]][currentCell[1]] = "snake";
    }
  }
}

function initializeBoard() {
  table.innerHTML = "";
  for (let i = 0; i < 15; i++) {
    let row = document.createElement("tr");
    for (let j = 0; j < 15; j++) {
      let cell = document.createElement("td");
      //store current cell in var
      let currentCell = gameState.board[i][j];
      //check if current cell is an empty string or not
      if (currentCell === "snake") {
        cell.classList.add("snakeBody");
      }
      if (currentCell === "food") cell.classList.add("protein");
      //if string has value, add class name to cell
      table.appendChild(row);
      row.appendChild(cell);
    }
  }
}


function removeTail() {
  let removedTail = gameState.snake.body.pop();
  gameState.board[removedTail[0]][removedTail[1]] = "";
}

function addHead() {
  let oldHead = gameState.snake.body[0];
  let directionY = gameState.snake.nextDirection[0];
  let directionX = gameState.snake.nextDirection[1];
  let newHead = [oldHead[0] + directionY, oldHead[1] + directionX];
  gameState.snake.body.unshift(newHead);
}

function tick() {
  gameOver();
  initializeBoard();
  removeTail();
  addHead();
  initFood();
  snakeGen();
  eatFood();
  
}

function changeDirection(e){
    e.preventDefault();
    if(e.keyCode === 39 && gameState.snake.nextDirection[0] === left[0] && gameState.snake.nextDirection[1] === left[1]){
        return;
    }
    if(e.keyCode === 40 && gameState.snake.nextDirection[0] === up[0] && gameState.snake.nextDirection[1] === up[1]){
        return;
    }if(e.keyCode === 37 && gameState.snake.nextDirection[0] === right[0] && gameState.snake.nextDirection[1] === right[1]){
        return;
    }if(e.keyCode === 38 && gameState.snake.nextDirection[0] === down[0] && gameState.snake.nextDirection[1] === down[1]){
        return;
    }
    if (e.keyCode === 37) {
      gameState.snake.nextDirection = left;
      horizontalSound.play();
    }
    if (e.keyCode === 38) {
      gameState.snake.nextDirection = up;
     verticalSound.play();
    }
    if (e.keyCode === 39) {
      gameState.snake.nextDirection = right;
        horizontalSound.play();
    }
    if (e.keyCode === 40) {
      gameState.snake.nextDirection = down;
       verticalSound.play();
    }
}

document.addEventListener("keydown", changeDirection);


function moveFood() {
  let randomNum1 = Math.floor(Math.random() * 15);
  let randomNum2 = Math.floor(Math.random() * 15);
  let food = gameState.food;
  food[0] = randomNum1;
  food[1] = randomNum2;
}

function addScore() {
  scoreEl.innerText = `Reps: ${(score += 1)}`;
  if (highScore < score) {
    highScoreEl.innerText = `PR: ${(highScore += 1)}`;
  }
}

function breakBody(){
  let head = gameState.snake.body[0];
  let nextDirection = gameState.snake.nextDirection;
  let nextCell = [head[0] + nextDirection[0], head[1] + nextDirection[1]];
  if(gameState.board[nextCell[0]] && gameState.board[nextCell[0]][nextCell[1]] === "snake"){
    clearInterval(interval);
    endSound.play();
  }
}

function eatFood() {
  let head = gameState.snake.body[0];
  let food = gameState.food;

  if (head[0] === food[0] && head[1] === food[1]) {
    moveFood();
    addScore();
    gameState.snake.body.unshift(head);
    clearInterval(interval);
    interval = setInterval(tick, gameState.speed -= 5);
    foodSound.play();
  }
}

function gameOver() {
  breakBody();
    let snakeHead = gameState.snake.body[0];
  if (snakeHead[0] > 14 || snakeHead[0] < 0) {
    clearInterval(interval);
    endSound.play();
    
  }
  if (snakeHead[1] > 14 || snakeHead[1] < 0) {
    clearInterval(interval);
    endSound.play();
  }
  
}

buttonEl.addEventListener("click", function () {
    clearInterval(interval);
    renderGameState()
    score = 0;
    scoreEl.innerText = `Reps: ${score}`;
    tick();
    interval = setInterval(tick, gameState.speed);

  });


renderGameState();
let interval = setInterval(tick, gameState.speed);

