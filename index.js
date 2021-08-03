const grid = document.querySelector('.grid')
const blockWidth = 100
const blockHeigth = 20
const boardWidth = 900
const boardHeight = 600
const ballDiameter = 20
let lives = 5
let score = 0
let timerId
let userWidth = 100
let userHeight = 20

// user variables
const userInitial = [400, 10]
let currentPosition = userInitial

//ball variables
const ballInitial = [440, 40]
let ballCurrentPosition = ballInitial
let xDirection = 2
let yDirection = 2


// ** Blocks


// create blocks

class Block {
    constructor(xAxis, yAxis){
        this.bottomLeft = [xAxis, yAxis] 
        this.bottomRight = [xAxis + blockWidth, yAxis]
        this.topLeft = [xAxis, yAxis + blockHeigth]
        this. topRight = [xAxis + blockWidth, yAxis + blockHeigth]
    }
}

// all blocks
let blocks = [
    new Block(10, 570),
    new Block(120, 570),
    new Block(230, 570),
    new Block(340, 570),
    new Block(450, 570),
    new Block(560, 570),
    new Block(670, 570),
    new Block(780, 570),
    new Block(10, 540),
    new Block(120, 540),
    new Block(230, 540),
    new Block(340, 540),
    new Block(450, 540),
    new Block(560, 540),
    new Block(670, 540),
    new Block(780, 540),
    new Block(10, 510),
    new Block(120, 510),
    new Block(230, 510),
    new Block(340, 510),
    new Block(450, 510),
    new Block(560, 510),
    new Block(670, 510),
    new Block(780, 510),
]

// draw blocks on grid

function drawBlocks() {
    for(let i = 0; i < blocks.length; i++) {
        const block = document.createElement('div')
        block.classList.add('block')
        block.style.left = blocks[i].bottomLeft[0] + 'px'
        block.style.bottom = blocks[i].bottomLeft[1] + 'px'
        grid.appendChild(block)
    }
}

drawBlocks() 


// ** User

// create User

const user = document.createElement('div')
user.classList.add('user')
drawuser()
grid.appendChild(user)

// draw User

function drawuser() {
    user.style.left = currentPosition[0] + 'px'
    user.style.bottom = currentPosition[1] + 'px'
}

// move User

function moveUser(e) {
    switch(e.key) {
        case 'ArrowLeft':
            if(currentPosition[0] > 0) {
                currentPosition[0] -= 15
                drawuser()
            }
            break;
        case 'ArrowRight':
            if(currentPosition[0] < boardWidth - blockWidth) {
                currentPosition[0] += 15
                drawuser()
            }
            break;
    }
}

document.addEventListener('keydown', moveUser)

// ** Ball


// create ball

const ball = document.createElement('div')
ball.classList.add('ball')
drawBall()
grid.appendChild(ball)

// draw ball 

function drawBall() {
    ball.style.left = ballCurrentPosition[0] + 'px'
    ball.style.bottom = ballCurrentPosition[1] + 'px'
}

// move Ball

function moveBall() {
    ballCurrentPosition[0] += xDirection
    ballCurrentPosition[1] += yDirection
    drawBall()
    checkCollisions()
}

// ** collisions

function checkCollisions() {
    // block collisions
    for(let i = 0; i< blocks.length; i++){
        if(
        (ballCurrentPosition[0] > blocks[i].bottomLeft[0] && ballCurrentPosition[0] < blocks[i].bottomRight[0]) &&
        (ballCurrentPosition[1] + ballDiameter > blocks[i].bottomLeft[1] && ballCurrentPosition[1] < blocks[i].topLeft[1])
        ){
            const allBlocks = Array.from(document.querySelectorAll('.block'))
            allBlocks[i].classList.remove('block')
            blocks.splice(i, 1)
            changeDirection()
            score++
            scoreText.innerHTML = `Score: ${score}`
            winGame()
            restartGame()
        }
    }
    // wall collisions
    if(
        ballCurrentPosition[0] >=(boardWidth - ballDiameter) || 
        ballCurrentPosition[1] >= (boardHeight - ballDiameter)
        ) {
        changeDirection()
    }

    if(ballCurrentPosition[0] <= 0){
        leftWallCollision()
    }

    // user collisions

    if ((ballCurrentPosition[0] > currentPosition[0] && ballCurrentPosition[0] < currentPosition[0] + blockWidth) &&
        (ballCurrentPosition[1] > currentPosition[1] && ballCurrentPosition[1] < currentPosition[1] + blockHeigth)){
            yDirection = 2
    }

    if((ballCurrentPosition[0] > currentPosition[0] && ballCurrentPosition[0] < currentPosition[0] + blockWidth) &&
    (ballCurrentPosition[1] > currentPosition[1] && ballCurrentPosition[1] < currentPosition[1] + blockHeigth) && 
    (xDirection === 2 && yDirection === -2)){
        yDirection = 2
    }

    if((ballCurrentPosition[0] === currentPosition[0] + userHeight&& 
        ballCurrentPosition[1] === currentPosition[1] )){
            yDirection = 4
            xDirection = 4
            console.log('ok')
        }

    // check if lose
    if(ballCurrentPosition[1] <= 0) {
        clearInterval(timerId)
        lives--
        livesText.innerText = `Lives: ${lives}`
        resetBall(440, 40)
        resetUser(400, 10)
        paused = true
        document.getElementById('start_button').innerHTML = 'Start'
        gameOver()
        restartGame()
    }
}


    // ** change Directions

function changeDirection() {
    if (xDirection === 2 && yDirection === 2){
        yDirection = -2
        return
    }   
    if (xDirection === 2 && yDirection === -2){
        xDirection = -2
        return
    }
    if (xDirection === -2 && yDirection === -2) {
        yDirection = 2
        return
    }
    if ((xDirection === -2 && yDirection === 2)) {
        yDirection = -2
        return 
    }    
} 

function leftWallCollision() {
    if ((xDirection === -2 && yDirection === 2)) {
        xDirection = 2
        return 
    }
    if(xDirection === -2 && yDirection === -2){
        xDirection = 2
    }
}

// ** Lives and Score

const text = document.querySelector('.text')
const livesText = document.createElement('h3')
livesText.classList.add('life_count')
text.appendChild(livesText)
livesText.innerText = `Lives: ${lives}`

const scoreText = document.createElement('h3')
scoreText.classList.add('score_count')
text.appendChild(scoreText)
scoreText.innerHTML = `Score: ${score}`

// ** lose a life 

// reset ball

function resetBall(x, y) {
    ball.style.left = x + 'px'
    ball.style.bottom = y + 'px'
    xDirection = 2
    yDirection = 2
    ballCurrentPosition[0] = x 
    ballCurrentPosition[1] = y
}

// reset user

function resetUser(x, y) {
    user.style.left = x + 'px'
    user.style.bottom = y + 'px'
    currentPosition[0] = x
    currentPosition[1] = y
}

// ** start timer

//add button to start timer

let start = document.createElement('button')
let buttons = document.querySelector('.buttons')
start.setAttribute("id", 'start_button')
buttons.appendChild(start)
start.innerHTML = 'Start'

let paused = true

// start and pause game

function startTimer() {
    if(paused === true){
        paused = false
        start.innerHTML = "Pause"
        timerId = setInterval(moveBall, 10)
    }else {
        paused = true
        start.innerHTML = "Start"
        clearInterval(timerId)
    }
    console.log(paused)
}

start.addEventListener('click', startTimer)

// ** game over

let lost = false

let gameOverText = document.createElement('h1')
document.querySelector('.result_text').appendChild(gameOverText)

function gameOver() {
    if(lives === 0) {
        lost = true
        console.log('gameOver')
        start.removeEventListener('click', startTimer)
        document.removeEventListener('keydown', moveUser)
        gameOverText.innerHTML = "Game Over -- Try again!"
    } else {
        console.log('keep playing')
    }
}

// ** win game

let won = false

let winGameText = document.createElement('h1')
document.querySelector('.result_text').appendChild(winGameText)


function winGame() {
    if(score === 24) {
        won = true
        clearInterval(timerId)
        console.log("You've won")
        start.removeEventListener('click', startTimer)
        document.removeEventListener('keydown', moveUser)
        winGameText.innerHTML = "You Won!"
    }
}

// restart game

const restartButton = document.createElement('button')

function restartGame() {
    if(won || lost){
        buttons.appendChild(restartButton)
        restartButton.innerHTML = 'Restart'
        restartButton.addEventListener('click', newGame)
    }
}
const blockClasses = Array.from(document.querySelectorAll('.block'))

function newGame() {
    lives = 5
    score = 0
    livesText.innerText = `Lives: ${lives}`
    scoreText.innerHTML = `Score: ${score}`
    winGameText.innerHTML = ''
    gameOverText.innerHTML = ''
    resetUser(400, 10)
    resetBall(440, 40)
    grid.innerHTML = ''
    blocks =   [ 
        new Block(10, 570),
        new Block(120, 570),
        new Block(230, 570),
        new Block(340, 570),
        new Block(450, 570),
        new Block(560, 570),
        new Block(670, 570),
        new Block(780, 570),
        new Block(10, 540),
        new Block(120, 540),
        new Block(230, 540),
        new Block(340, 540),
        new Block(450, 540),
        new Block(560, 540),
        new Block(670, 540),
        new Block(780, 540),
        new Block(10, 510),
        new Block(120, 510),
        new Block(230, 510),
        new Block(340, 510),
        new Block(450, 510),
        new Block(560, 510),
        new Block(670, 510),
        new Block(780, 510),
    ]
    drawBlocks()
    grid.appendChild(user)
    grid.appendChild(ball)
    start.addEventListener('click', startTimer)
    document.addEventListener('keydown', moveUser)
    paused = true
    start.innerHTML = "Start"
    buttons.removeChild(restartButton)
    won = false
    lost = false
}