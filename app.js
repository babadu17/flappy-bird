const canvas = document.querySelector(".gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 600;

let y = 0;
let vilocite = 0;
let dernierAppuie = true;
let score = 0;
let timePoto = 2000;
let timeRefresh = 20;

const TROU = 170;

let listPoto = [];

// --------------initialisation----------
function initTouche() {
  document.addEventListener("keydown", (event) => {
    if (event.key === " " && dernierAppuie) {
      vilocite = -5;
      dernierAppuie = false;
      window.setInterval((dernierAppuie = true), 200);
    }
  });
  document.addEventListener("click", () => {
    vilocite = -5;
    dernierAppuie = false;
    window.setInterval((dernierAppuie = true), 200);
  });
}

function initTerrain() {
  const terrain = new Image();
  terrain.src = "/assets/terrain.jpeg";
  ctx.drawImage(terrain, 0, 0, canvas.width, canvas.height);
}
// --------------mouvement--------------
function drawBird() {
  const bird = new Image();
  bird.src = "/assets/bird.png";
  ctx.drawImage(bird, 40, y, 55, 40);
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
  if (y < 0 || y > 530 || testPoto()) {
    setHighScore(score);
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

function menuDead() {
  clearInterval(boucle);
  ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";
  ctx.font = "30px Arial";
  ctx.fillText("Game Over", 120, 200);
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 150, 270);
  ctx.fillText("High Score: " + getHighScore(), 120, 320);
  ctx.font = "16px Arial";
  ctx.fillText("Appuyez pour rejouer", 120, 400);
  document.addEventListener("click", () => {
    location.reload();
  });
}

// --------------poto----------------
function drawPoto() {
  for (let poto of listPoto) {
    imgPotoTop = new Image();
    imgPotoTop.src = "/assets/potoTop.png";
    imgPotoBottom = new Image();
    imgPotoBottom.src = "/assets/potoBottom.png";
    ctx.drawImage(imgPotoTop, poto.x, 0, 40, poto.y);
    ctx.drawImage(
      imgPotoBottom,
      poto.x,
      poto.y + TROU,
      40,
      537 - poto.y - TROU,
    );
  }
}

function addPoto() {
  const poto = {
    x: canvas.width,
    y: Math.random() * (400 - TROU) + 100,
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

// --------------speed----------------
function majSpeed() {
  if (score % 5 === 0) {
    timePoto -= 20;
    timeRefresh -= 1;
    clearInterval(addPoto);
    window.setInterval(addPoto, timePoto);
    clearInterval(boucle);
    window.setInterval(() => {
      reset();
      initTerrain();
      drawBird();
      majCoBird();
      drawPoto();
      testDead();
      majPoto();
    }, timeRefresh);
  }
}
// --------------initialisation----------------
window.setInterval(addPoto, timePoto);
initTouche();

// ---------------boucle----------------
const boucle = setInterval(() => {
  reset();
  initTerrain();
  drawBird();
  majCoBird();
  drawPoto();
  testDead();
  majPoto();
}, timeRefresh);
