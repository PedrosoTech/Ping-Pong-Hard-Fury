const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 600;

const paddleWidth = 10;
const paddleHeight = 100;
const ballSize = 10;

let playerScore = 0;
let botScore = 0;

// Variáveis para arrastar a raquete
let isDragging = false;
let dragStartY = 0;
let dragOffsetY = 0;

// Raquetes
const playerPaddle = {
  x: 0,
  y: canvas.height / 2 - paddleHeight / 2,
  width: paddleWidth,
  height: paddleHeight,
  speed: 4,
  dy: 0
};

const botPaddle = {
  x: canvas.width - paddleWidth,
  y: canvas.height / 2 - paddleHeight / 2,
  width: paddleWidth,
  height: paddleHeight,
  speed: 6,
  dy: 0
};

// Bola
const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  size: ballSize,
  speed: 3,
  dx: 3,
  dy: 3
};

// Desenha a raquete
function drawPaddle(paddle) {
  ctx.fillStyle = 'white';
  ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

// Desenha a bola
function drawBall() {
  ctx.fillStyle = 'white';
  ctx.fillRect(ball.x, ball.y, ball.size, ball.size);
}

// Desenha pontuação
function drawScore() {
  ctx.font = '32px Arial';
  ctx.fillText(`Jogador: ${playerScore}`, 50, 50);
  ctx.fillText(`Bot: ${botScore}`, canvas.width - 200, 50);
}

// Move a raquete do jogador com o teclado
function movePlayerPaddle() {
  playerPaddle.y += playerPaddle.dy;

  // Limites do canvas
  if (playerPaddle.y < 0) playerPaddle.y = 0;
  if (playerPaddle.y + playerPaddle.height > canvas.height) {
    playerPaddle.y = canvas.height - playerPaddle.height;
  }
}

// Move a raquete do bot com um pequeno atraso e introduzindo erros
function moveBotPaddle() {
  const delay = 0.2;
  let targetY = ball.y - (botPaddle.height / 2) + (ball.dy * delay);

  // Aumenta a chance de erro para 50%
  if (Math.random() < 0.5) {
    targetY += Math.random() * 100 - 50;
  }

  const smoothness = 0.1;
  botPaddle.y += (targetY - botPaddle.y) * smoothness;

  // Limites do canvas
  if (botPaddle.y < 0) botPaddle.y = 0;
  if (botPaddle.y + botPaddle.height > canvas.height) {
    botPaddle.y = canvas.height - botPaddle.height;
  }
}

// Move a bola
function moveBall() {
  ball.x += ball.dx;
  ball.y += ball.dy;

  // Colisão com as bordas superior/inferior
  if (ball.y < 0 || ball.y + ball.size > canvas.height) {
    ball.dy *= -1;
  }

  // Colisão com o jogador
  if (ball.x < playerPaddle.x + playerPaddle.width &&
    ball.y + ball.size > playerPaddle.y &&
    ball.y < playerPaddle.y + playerPaddle.height) {
    ball.dx *= -1;
  }

  // Colisão com o bot
  if (ball.x + ball.size > botPaddle.x &&
    ball.y + ball.size > botPaddle.y &&
    ball.y < botPaddle.y + botPaddle.height) {
    ball.dx *= -1;
  }

  // Pontuação
  if (ball.x < 0) {
    botScore++;
    resetBall();
  } else if (ball.x + ball.size > canvas.width) {
    playerScore++;
    resetBall();
  }
}

// Reseta a posição da bola
function resetBall() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.dx *= -1;
}

// Função principal para desenhar o jogo
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawPaddle(playerPaddle);
  drawPaddle(botPaddle);
  drawBall();
  drawScore();
}

// Atualiza o estado do jogo
function update() {
  movePlayerPaddle();
  moveBotPaddle();
  moveBall();

  draw();
  requestAnimationFrame(update);
}

// Controle de teclas
function keyDown(e) {
  if (e.key === 'ArrowUp' || e.key === 'w') {
    playerPaddle.dy = -playerPaddle.speed;
  } else if (e.key === 'ArrowDown' || e.key === 's') {
    playerPaddle.dy = playerPaddle.speed;
  }
}

function keyUp(e) {
  if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'ArrowDown' || e.key === 's') {
    playerPaddle.dy = 0;
  }
}

// Funções de controle de arraste do mouse
function handleMouseDown(e) {
  if (e.offsetX < playerPaddle.width && e.offsetY > playerPaddle.y && e.offsetY < playerPaddle.y + playerPaddle.height) {
    isDragging = true;
    dragStartY = e.offsetY;
    dragOffsetY = e.offsetY - playerPaddle.y;
  }
}

function handleMouseMove(e) {
  if (isDragging) {
    playerPaddle.y = e.offsetY - dragOffsetY;
    if (playerPaddle.y < 0) {
      playerPaddle.y = 0;
    } else if (playerPaddle.y + playerPaddle.height > canvas.height) {
      playerPaddle.y = canvas.height - playerPaddle.height;
    }
  }
}

function handleMouseUp() {
  isDragging = false;
}

// Controles de arraste do mouse
canvas.addEventListener('mousedown', handleMouseDown);
canvas.addEventListener('mousemove', handleMouseMove);
canvas.addEventListener('mouseup', handleMouseUp);

// Listeners de teclas
document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

// Iniciar o jogo
update();

// Remover listeners de teclado
document.removeEventListener('keydown', keyDown);
document.removeEventListener('keyup', keyUp);
