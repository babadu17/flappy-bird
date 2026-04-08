const canvas = document.querySelector(".gameCanvas");
const ctx = canvas.getContext("2d");

const musique = new Audio("/assets/musique-flappy-bird.mp3");
const mort = new Audio("/assets/ouin-ouin-ouinnnnn.mp3");

const imgTerrain = new Image();
imgTerrain.src = "/assets/terrain.jpeg";
const imgBird = new Image();
imgBird.src = "/assets/bird.png";
const imgPotoTop = new Image();
imgPotoTop.src = "/assets/potoTop.png";
const imgPotoBottom = new Image();
imgPotoBottom.src = "/assets/potoBottom.png";

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let y = 0;
let vilocite = 0;
let dernierAppuie = true;
let score = 0;
let timePoto = 2000;
let timeRefresh = 20;

const TROU = 170;

let listPoto = [];

let intervalPoto;
let boucle;

// --------------initialisation----------
function initTouche() {
  document.addEventListener("keydown", (event) => {
    if (event.key === " " && dernierAppuie) {
      vilocite = -5;
      dernierAppuie = false;
      setTimeout(() => {
        dernierAppuie = true;
      }, 200);
    }
  });
  document.addEventListener("click", () => {
    vilocite = -5;
    dernierAppuie = false;
    setTimeout(() => {
      dernierAppuie = true;
    }, 200);
  });
}

function initTerrain() {
  const terrain = new Image();
  terrain.src = "/assets/terrain.jpeg";
  ctx.drawImage(terrain, 0, 0, canvas.width, canvas.height);
}

// --------------mouvement--------------
function drawBird() {
  ctx.drawImage(imgBird, 40, y, 55, 40);
}

function majCoBird() {
  y += vilocite;
  vilocite += 0.2;
}

function reset() {
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// --------------mort----------------
function testDead() {
  if (y < 0 || y > canvas.height - 70 - 30 || testPoto()) {
    setHighScore(score);
    mort.play();
    musique.pause();
    musique.currentTime = 0;
    stopGame();
    menuDead();
  }
}

function testPoto() {
  for (let poto of listPoto) {
    if (40 + 40 > poto.x && 40 < poto.x + 40) {
      if (y < poto.y || y + 40 > poto.y + TROU) {
        return true;
      }
    }
  }
  return false;
}

// --------------menu----------------
function menuDead() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.textAlign = "center";
  ctx.fillStyle = "white";
  ctx.strokeStyle = "black";
  ctx.lineWidth = 3;
  ctx.font = "20px 'Press Start 2P'";
  ctx.strokeText("Game Over", canvas.width / 2, canvas.height / 2 - 100);
  ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2 - 100);

  ctx.font = "12px 'Press Start 2P'";
  ctx.strokeText("Score: " + score, canvas.width / 2, canvas.height / 2);
  ctx.fillText("Score: " + score, canvas.width / 2, canvas.height / 2);
  ctx.strokeText(
    "High Score: " + getHighScore(),
    canvas.width / 2,
    canvas.height / 2 + 50,
  );
  ctx.fillText(
    "High Score: " + getHighScore(),
    canvas.width / 2,
    canvas.height / 2 + 50,
  );

  ctx.font = "10px 'Press Start 2P'";
  ctx.strokeText(
    "Appuyez pour rejouer",
    canvas.width / 2,
    canvas.height / 2 + 130,
  );
  ctx.fillText(
    "Appuyez pour rejouer",
    canvas.width / 2,
    canvas.height / 2 + 130,
  );

  setTimeout(() => {
    document.addEventListener("click", () => location.reload(), { once: true });
  }, 500);
}

function menuStart() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.textAlign = "center";
  ctx.fillStyle = "white";
  ctx.strokeStyle = "black";
  ctx.lineWidth = 3;

  ctx.font = "20px 'Press Start 2P'";
  ctx.strokeText("Flappy Bird", canvas.width / 2, canvas.height / 2 - 100);
  ctx.fillText("Flappy Bird", canvas.width / 2, canvas.height / 2 - 100);

  ctx.font = "10px 'Press Start 2P'";
  ctx.strokeText(
    "Appuyez pour commencer",
    canvas.width / 2,
    canvas.height / 2 + 50,
  );
  ctx.fillText(
    "Appuyez pour commencer",
    canvas.width / 2,
    canvas.height / 2 + 50,
  );

  setTimeout(() => {
    document.addEventListener("click", () => startGame(), { once: true });
  }, 500);
}

// --------------poto----------------
function drawPoto() {
  for (let poto of listPoto) {
    ctx.drawImage(imgPotoTop, poto.x, 0, 40, poto.y);
    ctx.drawImage(
      imgPotoBottom,
      poto.x,
      poto.y + TROU,
      40,
      canvas.height - 70 - poto.y - TROU,
    );
  }
}

function addPoto() {
  const poto = {
    x: canvas.width,
    y: Math.random() * (canvas.height - TROU - 200) + 100,
  };
  listPoto.push(poto);
}

function majPoto() {
  for (let poto of listPoto) {
    poto.x -= 2;
    if (poto.x + 40 < 0) {
      listPoto.splice(listPoto.indexOf(poto), 1);
      score++;
      majSpeed();
    }
  }
}

// --------------score----------------
function getHighScore() {
  const highScore = localStorage.getItem("highScore");
  return highScore ? parseInt(highScore) : 0;
}

function setHighScore(score) {
  const highScore = getHighScore();
  if (score > highScore) {
    localStorage.setItem("highScore", score);
  }
}

function drawScore() {
  ctx.fillStyle = "white";
  ctx.strokeStyle = "black";
  ctx.lineWidth = 3;
  ctx.font = "14px 'Press Start 2P'";
  ctx.strokeText(score, canvas.width - 50, canvas.height - 40);
  ctx.fillText(score, canvas.width - 50, canvas.height - 40);
}

// --------------speed----------------
function majSpeed() {
  if (score % 5 === 0) {
    timeRefresh -= 1;
    clearInterval(boucle);
    boucle = setInterval(gameTick, timeRefresh);
  }
}

function stopGame() {
  clearInterval(boucle);
  clearInterval(intervalPoto);
}

function gameTick() {
  reset();
  initTerrain();
  drawBird();
  majCoBird();
  drawPoto();
  drawScore();
  testDead();
  majPoto();
}

// --------------initialisation----------------
function startGame() {
  musique.loop = true;
  musique.play();
  intervalPoto = window.setInterval(addPoto, timePoto);
  initTouche();
  boucle = setInterval(gameTick, timeRefresh);
}

Promise.all([
  new Promise((res) => (imgTerrain.onload = res)),
  new Promise((res) => (imgBird.onload = res)),
  new Promise((res) => (imgPotoTop.onload = res)),
  new Promise((res) => (imgPotoBottom.onload = res)),
]).then(() => {
  menuStart();
});
