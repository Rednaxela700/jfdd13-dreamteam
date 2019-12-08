let id = 0;

const
    body = document.querySelector('body'),
    board = {
        domEl: document.querySelector('.board')
    },
    startBtn = document.getElementById('start__btn'),
    instBtn = document.getElementById('inst__btn'),
    backBtn = document.getElementById('back__btn');

const
    playerWidth = 50,
    playerHeight = 40,
    obstWidth = 200,
    obstHeight = 200,
    birdWidth = 40,
    birdHeight = 40,
    boardStart = 0,
    boardWidth = 600,
    boardHeight = 600,
    startLine = 160,
    creationLine = 700,
    speed = 1,
    speedObst = 1,
    speedBird = 2,
    speedBirdZ = 2,
    childrenArray = [],
    intervals = [],
    timeouts = [],

backToMenu = () => {
    document.location.assign('../index.html');
},

startGame = () => {
    startBtn.style.display = 'none';
    instBtn.style.display = 'none';
    backBtn.style.display = 'none';
    event.preventDefault();
    document.addEventListener("keydown", event => Render.KeySupport(Player, event));

    checkPosition = () => {
        const outOfTheBoard = childrenArray.map(item => item.position.x < -obstWidth);
        const trashItem = outOfTheBoard.indexOf(true);
        if (trashItem > 0) {

            Render.destroy(childrenArray[trashItem])
        };
    };

    firstLoop = () => {
        Render.create(createPlayer());
        Render.create(createBird());
        Render.create(createObstacle());
    };

    obstacleLoop = () => {
        Render.create(createObstacle('a'));
    };
    birdLoop = () => {
        Render.create(createBird('b'));
    };
    birdZLoop = () => {
        Render.create(createBirdZ('c'));
    };
    mainLoop = () => {
        const 
        draw = setInterval(Render.changePosition, 10),
        int1 = setInterval(checkPosition, 10),
        int2 = setInterval(checkCollision, 1),
        int3 = setInterval(obstacleLoop, 5000),
        int4 = setInterval(birdLoop, 2000),
        int5 = setInterval(birdZLoop, 8000)
        lev2 = setTimeout(level2, 10000);
        intervals.push(draw, int1, int2, int3, int4, int5);
        timeouts.push(lev2);
    };
    level2 = () => {
        const 
        int6 = setInterval(birdLoop, 500),
        int7 = setInterval(birdZLoop, 2000);
        intervals.push(int6, int7);
    };

    countdown();
    firstLoop();
    
    raf = requestAnimationFrame(mainLoop);
};

checkCollision = () => {
  const playArr = childrenArray[0],
    playX = playArr.position.x,
    playY = playArr.position.y,
    playW = playArr.size.w,
    playH = playArr.size.h,
    obstacleArr = childrenArray.filter(item => item.type !== 'player');
  // console.log(playX,playY, playW, playH)

  obstacleArr.forEach(item => {
    const obstX = item.position.x,
      obstY = item.position.y,
      obstW = item.size.w,
      obstH = item.size.h;
    // console.log(obstX, obstY, obstW, obstH)
    if (
      (playX + playW >= obstX &&
        playX + playW <= obstX + obstW &&
        playY + playH >= obstY &&
        playY + playH <= obstY + obstH) ||
      (playX + playW >= obstX &&
        playX <= obstX + obstW &&
        playY + playH >= obstY &&
        playY + playH <= obstY + obstH) ||
      (playX + playW >= obstX &&
        playX <= obstX + obstW &&
        playY <= obstY + obstH &&
        playY >= obstY)
    ) {
      gameOver();
      return true;
    } else {
      return false;
    }
  });
};

clearAllIntervals = () => {
    intervals.forEach(i => {
        clearInterval(i);
    });
};
gameOver = () => {
    console.log('GAME OVER');
    cancelAnimationFrame(raf);
    clearAllIntervals();

    //TUTAJ JAKIŚ MODAL TRZEBA WYWOŁAĆ JAK SĄDZĘ?
    
    // setTimeout(location.reload(board),5000);
};

class Render {

    static create(el, parent = board.domEl) {
        const parentVar = parent 
        const child = document.createElement('div');

        el.id = id++;
        child.setAttribute('id', `${el.name}${el.id}`);
        child.style.left = el.position.x + 'px';
        child.style.top = el.position.y + 'px';

        if (el.name === 'player') {
            child.style.width = el.size.w + 'px';
            child.style.height = el.size.h + 'px';
            // child.style.backgroundColor = `blue`;
            child.style.backgroundImage = "url('img/player_plane.png')";
            child.style.backgroundRepeat = 'round';
            child.setAttribute('class', `player`);

        } else if (el.name === 'obstacle') {
            child.style.width = el.size.w + 'px';
            child.style.height = el.size.h + 'px';
            child.style.backgroundColor = `grey`;
            child.style.backgroundImage = "url('img/tree3.png')";
            child.style.backgroundRepeat = 'round';
            child.setAttribute('class', `obstacle ${el.name}`);

        } else if (el.name === 'bird') {
            child.style.width = el.size.w + 'px';
            child.style.height = el.size.h + 'px';
            child.style.backgroundColor = `red`;
            child.style.backgroundImage = "url('img/bird_gull.png')";
            child.style.backgroundRepeat = 'round';
            child.setAttribute('class', `bird ${el.name}`);

        } else if (el.name === 'birdz') {
            child.style.width = el.size.w + 'px';
            child.style.height = el.size.h + 'px';
            child.style.backgroundColor = 'white';
            child.style.backgroundImage = "url('img/bird_eagle.png')";
            child.style.backgroundRepeat = 'round';
            child.setAttribute('class', `birdz ${el.name}`);
        } else {
            throw Error('unresolved object name in render create, line 90')
        }

        parentVar.appendChild(child);
        el.domEl = document.getElementById(`${el.name}${el.id}`);
        childrenArray.push(el);
    };

    static changePosition(domEl) {

        childrenArray.forEach((el, i) => {
            let x = el.position.x;
            let y = el.position.y;
            // console.log(`child x= ${x}`);

            if (el.name === 'player') {
                el.domEl.style.left = x + 'px';
                el.domEl.style.top = y + 'px';

            } else if (el.name === 'obstacle'|| el.name === 'bird') {
                el.moveObst();
                el.domEl.style.left = x + 'px';

            } else if (el.name === 'birdz') {
                el.moveBirdZ();
                el.domEl.style.left = x + 'px';
                el.domEl.style.top = y + 'px';
            }
        });
    };

    static KeySupport(domEl, event) {
        childrenArray.forEach((el, i) => {

            if (el.type === 'player') {
                switch (event.code) {
                    case "ArrowLeft":
                        if (el.position.x > boardStart) {
                            el.playerLeft()
                        }
                        break;
                    case "ArrowRight":
                        if (el.position.x + playerWidth < boardWidth) {
                            el.playerRight()
                        }
                        break;
                    case "ArrowUp":
                        if (el.position.y > boardStart) {
                            el.playerUp()
                        }
                        break;
                    case "ArrowDown":
                        if (el.position.y + playerHeight < boardHeight) {
                            el.playerDown()
                        }
                        break;
                    default:
                        return
                }
            }
        });
    };

    static destroy(el) {
        el.domEl.style.transition = 'opacity .1s ease-out';
        el.domEl.style.opacity = '0';
        el.domEl.remove();
        el.position.x = 1000;
        el.position.y = -1000;
        return el = 0;
    }

}

class BoardElement {
    constructor(name, domEl, id, position = {x: '', y: ''}, size = {w: '', h: ''}, speed, type) {
        this.name = name;
        this.domEl = domEl;
        this.id = id;
        this.position = position;
        this.position.x = position.x;
        this.position.y = position.y;
        this.size = size;
        this.size.w = size.w;
        this.size.h = size.h;
        this.speed = speed;
        this.type = type;
    }

    playerLeft() {
        this.position.x -= this.speed / 2;
    }

    playerRight() {
        this.position.x += this.speed;
    }

    playerUp() {
        this.position.y -= this.speed * 4;
    }

    playerDown() {
        this.position.y += this.speed * 4;
    }

    moveObst() {
        this.position.x -= this.speed;
    }

    moveBirdZ() {
        this.position.x -= this.speed;
        this.position.y += this.speed / 4;
    }
}


class Player extends BoardElement {
    constructor(name, domEl, id, position = {x: '', y: ''},  size = {w: '', h: ''}, speed, type) {
        super(domEl, position, size);
        this.name = name;
        this.id = id;
        this.position.x = position.x;
        this.position.y = position.y;
        this.size.w = size.w;
        this.size.h = size.h;
        this.speed = speed;
        this.type = type;
    }
}

class Obstacle extends BoardElement {
    constructor(name, domEl, id, position = {x: '', y: ''}, size = {w: '', h: ''}, speed, type) {

        super(domEl, id, position, size);
        this.name = name;
        this.position.x = position.x;
        this.position.y = position.y;
        this.size.w = size.w;
        this.size.h = size.h;
        this.speed = speed;
        this.type = type;
    }
}

createPlayer = () => {
    return new Player('player', '', id, {x: startLine, y: startLine}, {w: playerWidth, h: playerHeight}, speed, 'player');
};
createObstacle = () => {
    return new Obstacle('obstacle', '', '', {x: creationLine, y: boardHeight-obstHeight}, {w: obstWidth, h: obstHeight}, speedObst, 'obstacle');
};
createBird = () => {
    return new Obstacle('bird', '', '', {x: creationLine, y: generateBirdY()}, {w: birdWidth, h: birdHeight}, speedBird, 'obstacle');
};
createBirdZ = () => {
    return new Obstacle('birdz', '', '', {x: creationLine, y: generateBirdY()},{w: birdWidth, h: birdHeight}, speedBirdZ, 'obstacle');
};

generateBirdY = () => {
    const randPositions = [250, 300, 350, 400, 450, 480, 550, 600];
    const getPosition = Math.round(Math.random() * randPositions.length - 1); //generate random arr index
    const result = randPositions[getPosition] - 250;
    if (result !== undefined) {
        return result;
    } else { 
        return randPositions[0];
    }

};

startBtn.addEventListener('click', startGame);
backBtn.addEventListener('click', backToMenu);

function highScore() {

    const getHighScore = () => localStorage.getItem('highscore') || 0

    const newScoreReceived = (value) => {
        console.log(value, getHighScore())
        if (value > getHighScore()) {
            console.log('new highScore!')
            localStorage.setItem('highscore', value)
        } else {
            console.log('lower')
        }
    };

    const gameStarted = () => {
        displayScore(getHighScore())
    };

    const gameCompleted = (score) => {
        newScoreReceived(score);
        displayScore(score);
    };

    const displayScore = (value) =>
        document.getElementById('highscore').innerText = `Najlepszy wynik to: ${Math.round(value)}`;

    const startGame1 = () => {
        gameStarted();

        setTimeout(() => {
            gameCompleted(Math.random() * 200)
            setTimeout(() => {
                startGame1()
            }, 1000)

        }, 5000)
    };

    startGame1();

}

const startTimer = (duration, display) => {
    let timer = duration, minutes, seconds;
    const intTime = setInterval(function () {
        minutes = parseInt(timer / 60, 10)
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.innerText = minutes + ":" + seconds;

        if (--timer < 0) {
            timer = duration;
        }
    }, 1000);
    intervals.push(intTime);
};

const countdown = () => {
    const twoMinutes = 60 * 2,
        display = document.querySelector('#countdown');
    startTimer(twoMinutes, display);

};