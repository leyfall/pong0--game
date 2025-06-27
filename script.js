const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

// Game Variables
const paddleWidth = 10;
const paddleHeight = 80;
const ballRadius = 8;
const playerX = 10;
const aiX = canvas.width - paddleWidth - 10;
let playerY = (canvas.height - paddleHeight) / 2;
let aiY = (canvas.height - paddleHeight) / 2;
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballSpeedX = 5 * (Math.random() > 0.5 ? 1 : -1);
let ballSpeedY = 3 * (Math.random() > 0.5 ? 1 : -1);
let playerScore = 0;
let aiScore = 0;

// Mouse movement to control player paddle
canvas.addEventListener('mousemove', function(evt) {
    const rect = canvas.getBoundingClientRect();
    const mouseY = evt.clientY - rect.top;
    playerY = mouseY - paddleHeight / 2;
    if (playerY < 0) playerY = 0;
    if (playerY > canvas.height - paddleHeight) playerY = canvas.height - paddleHeight;
});

// Drawing Functions
function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
}

function drawText(text, x, y, size = 32) {
    ctx.fillStyle = "#fff";
    ctx.font = `${size}px monospace`;
    ctx.textAlign = "center";
    ctx.fillText(text, x, y);
}

// Game Logic
function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = 5 * (Math.random() > 0.5 ? 1 : -1);
    ballSpeedY = 3 * (Math.random() > 0.5 ? 1 : -1);
}

function update() {
    // Ball movement
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Top and bottom wall collision
    if (ballY - ballRadius < 0 || ballY + ballRadius > canvas.height) {
        ballSpeedY *= -1;
    }

    // Left paddle collision
    if (
        ballX - ballRadius < playerX + paddleWidth &&
        ballY > playerY &&
        ballY < playerY + paddleHeight
    ) {
        ballSpeedX *= -1;
        // Add some spin based on where it hits the paddle
        let collidePoint = ballY - (playerY + paddleHeight / 2);
        collidePoint = collidePoint / (paddleHeight / 2);
        ballSpeedY = 4 * collidePoint;
        ballX = playerX + paddleWidth + ballRadius; // Prevent sticking
    }

    // Right paddle collision (AI)
    if (
        ballX + ballRadius > aiX &&
        ballY > aiY &&
        ballY < aiY + paddleHeight
    ) {
        ballSpeedX *= -1;
        let collidePoint = ballY - (aiY + paddleHeight / 2);
        collidePoint = collidePoint / (paddleHeight / 2);
        ballSpeedY = 4 * collidePoint;
        ballX = aiX - ballRadius; // Prevent sticking
    }

    // Score and reset
    if (ballX - ballRadius < 0) {
        aiScore++;
        resetBall();
    }
    if (ballX + ballRadius > canvas.width) {
        playerScore++;
        resetBall();
    }

    // Simple AI for right paddle
    let aiCenter = aiY + paddleHeight / 2;
    if (aiCenter < ballY - 10) {
        aiY += 4;
    } else if (aiCenter > ballY + 10) {
        aiY -= 4;
    }
    // Keep AI paddle inside canvas
    if (aiY < 0) aiY = 0;
    if (aiY > canvas.height - paddleHeight) aiY = canvas.height - paddleHeight;
}

function render() {
    // Clear
    drawRect(0, 0, canvas.width, canvas.height, "#111");

    // Divider
    for (let i = 0; i < canvas.height; i += 30) {
        drawRect(canvas.width / 2 - 1, i, 2, 15, "#555");
    }

    // Paddles
    drawRect(playerX, playerY, paddleWidth, paddleHeight, "#fff");
    drawRect(aiX, aiY, paddleWidth, paddleHeight, "#fff");

    // Ball
    drawCircle(ballX, ballY, ballRadius, "#fff");

    // Score
    drawText(playerScore, canvas.width / 4, 50);
    drawText(aiScore, canvas.width * 3 / 4, 50);
}

function gameLoop() {
    update();
    render();
    requestAnimationFrame(gameLoop);
}

gameLoop();
