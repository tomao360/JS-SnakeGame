const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls i");

let gameOver = false;
let foodX, foodY;
let snakeX = 5,
  snakeY = 10;
let snakeBody = [];
let velocityX = 0,
  velocityY = 0;
let setIntervalId;
let score = 0;

const audioGameOver = new Audio("./audio/gameOver.wav");
const audioScore = new Audio("./audio/score.wav");

// Getting high score from local storage
let highestScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerHTML = `High Score: ${highestScore}`;

const changeFoodPosition = () => {
  // Passing a random 0 - 30 value as food position (the grid is 1 - 31, so we add 1)
  foodX = Math.floor(Math.random() * 30) + 1;
  foodY = Math.floor(Math.random() * 30) + 1;
};

const handleGameOver = () => {
  // Clearing the timer and reloading the page on game over
  clearInterval(setIntervalId);
  audioGameOver.play();
  alert("Game Over! Press OK to restart...");
  location.reload();
};

const changeDirection = (e) => {
  // Changing velocity value based on the pressed key
  if (e.key === "ArrowUp" && velocityY != 1) {
    velocityX = 0;
    velocityY = -1;
  } else if (e.key === "ArrowDown" && velocityY != -1) {
    velocityX = 0;
    velocityY = 1;
  } else if (e.key === "ArrowLeft" && velocityX != 1) {
    velocityX = -1;
    velocityY = 0;
  } else if (e.key === "ArrowRight" && velocityX != -1) {
    velocityX = 1;
    velocityY = 0;
  }
};

controls.forEach((key) => {
  // Calling changeDirection on each key click and passing key dataset value as an object
  key.addEventListener("click", () =>
    changeDirection({ key: key.dataset.key })
  );
});

const initGame = () => {
  if (gameOver) return handleGameOver();

  // Creating a food div and inserting it in the playboard element
  let htmlMarkup = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`; // Position the div within the grid at row 10 and column 13

  // Checking if the snack hit the food
  if (snakeX === foodX && snakeY === foodY) {
    changeFoodPosition();
    snakeBody.push([foodX, foodY]); // Pushing food posiition to snakeBody array
    score++; // Increment score by 1
    audioScore.play();

    highestScore = score >= highestScore ? score : highestScore;
    localStorage.setItem("high-score", highestScore); // Storing high score in localStorage with the high-score name
    scoreElement.innerHTML = `Score: ${score}`;
    highScoreElement.innerHTML = `High Score: ${highestScore}`;
  }

  for (let i = snakeBody.length - 1; i > 0; i--) {
    // Shifting forward the values of the elements in the snake body by one
    snakeBody[i] = snakeBody[i - 1];
  }

  snakeBody[0] = [snakeX, snakeY]; // Setting first element of snakeBody array to current snake position

  // Updating the snake's head position based on the current velocity
  snakeX += velocityX;
  snakeY += velocityY;

  // Checking if the snake's head is out of the wall, is so setting gameOver to true
  if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
    gameOver = true;
  }

  for (let i = 0; i < snakeBody.length; i++) {
    // Adding a div for each part of the snake's body
    htmlMarkup += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
    // Checking if the snake's head hit the body, if so set gameOver to true
    if (
      i !== 0 &&
      snakeBody[0][1] === snakeBody[i][1] &&
      snakeBody[0][0] === snakeBody[i][0]
    ) {
      gameOver = true;
      audioGameOver.play();
    }
  }

  playBoard.innerHTML = htmlMarkup;
};

changeFoodPosition();
setIntervalId = setInterval(initGame, 125); // The head will move after every 125ms
document.addEventListener("keydown", changeDirection);
