//Set global variable that would contain the position, velocity and the html element "ball"

var balls = [];

const ballsQty = 15;

const velocity = 30;
const Xmin = 0;
const Xmax = window.innerWidth;
const Ymin = 0;
const Ymax = window.innerHeight;
var i = 0;

function createBalls() {
    for (i = 0; i < ballsQty; ++i) {
        let ballId = `ball${i}`;
        const ball = document.createElement('div');
        ball.setAttribute('id', ballId);
        ball.className = 'ball';

        document.body.appendChild(ball);

        let randomWidth = 50 + Math.round(Math.random() * window.innerHeight / 5);

        balls.push({
            id: ballId,
            reverseX: !!Math.round(Math.random()),
            reverseY: !!Math.round(Math.random()),  
            positionX: window.innerWidth / 2,
            positionY: window.innerHeight / 2,
            width: randomWidth,
            velocity: 30 - 150 * (randomWidth / window.innerWidth)
        })

        ball.style.left = balls[i].positionX + 'px';
        ball.style.top = balls[i].positionY + 'px';
        ball.style.width = balls[i].width + 'px';
        ball.style.height = ball.style.width;
        ball.style.background = `RGB(${Math.round(Math.random() * 255)}, ${Math.round(Math.random() * 255)}, ${Math.round(Math.random() * 255)})`;
    }

    console.log('balls created!', balls)
};

function moveBalls() {

    if (i == ballsQty) i = 0;

    var ball = document.getElementById(`ball${i}`);

    balls[i].positionX += balls[i].reverseX ? -balls[i].velocity : balls[i].velocity;
    balls[i].positionY += balls[i].reverseY ? -balls[i].velocity : balls[i].velocity;

    if (balls[i].positionX >= Xmax - balls[i].width || balls[i].positionX <= Xmin) {
        balls[i].reverseX = !balls[i].reverseX;
        ball.style.background = `RGB(${Math.round(Math.random() * 255)}, ${Math.round(Math.random() * 255)}, ${Math.round(Math.random() * 255)})`;
    }

    if (balls[i].positionY >= Ymax - balls[i].width || balls[i].positionY <= Ymin) {
        balls[i].reverseY = !balls[i].reverseY;
        ball.style.background = `RGB(${Math.round(Math.random() * 255)}, ${Math.round(Math.random() * 255)}, ${Math.round(Math.random() * 255)})`;
    }

    ball.style.left = balls[i].positionX + 'px';
    ball.style.top = balls[i].positionY + 'px';

    ++i;

}

createBalls();

// This call the moveBall function every 100ms
setInterval(moveBalls, 1);
