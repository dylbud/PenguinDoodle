document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.grid');
  const doodler = document.createElement('div');
  let doodlerLeftSpace = 50;
  let startPoint = 150;
  let doodlerBottomSpace = startPoint;
  let isGameOver = false;
  let platformCount = 5;
  let platforms = [];
  let upTimerId;
  let downTimerId;
  let isJumping = true;
  let isGoingLeft = false;
  let isGoingRight = false;
  let leftTimerId;
  let rightTimerId;
  let score = 0;

  function createDoodler() {
    grid.appendChild(doodler);
    doodler.classList.add('doodler');
    addClass();
    doodlerLeftSpace = platforms[0].left + 12.5;
    doodler.style.left = `${doodlerLeftSpace}px`;
    doodler.style.bottom = `${doodlerBottomSpace}px`;
  }

  class Platform {
    constructor(newPlatBottom) {
      this.bottom = newPlatBottom;
      this.left = Math.random() * 315;
      this.visual = document.createElement('div');

      const visual = this.visual;
      visual.classList.add('platform');
      visual.style.left = this.left + 'px';
      visual.style.bottom = this.bottom + 'px';
      grid.appendChild(visual);
    }
  }

  function createPlatforms() {
    for (let i = 0; i < platformCount; i++) {
      let platGap = 600 / platformCount;
      let newPlatBottom = 100 + i * platGap;
      let newPlatform = new Platform(newPlatBottom);
      platforms.push(newPlatform);
    }
  }

  function movePlatforms() {
    if (doodlerBottomSpace > 200) {
      platforms.forEach(platform => {
        platform.bottom -= 2;
        let visual = platform.visual;
        visual.style.bottom = `${platform.bottom}px`;

        if (platform.bottom === 0) {
          let firstPlatform = platforms[0].visual;
          firstPlatform.classList.remove('platform');
          platforms.shift();
          score++;
          let newPlatform = new Platform(600);
          platforms.push(newPlatform);
        }
      });
    }
  }

  function fall() {
    clearInterval(upTimerId);
    isJumping = false;
    downTimerId = setInterval(function () {
      doodlerBottomSpace -= 2.5;
      doodler.style.bottom = `${doodlerBottomSpace}px`;
      if (doodlerBottomSpace <= 0) {
        gameOver();
      }
      platforms.forEach(platform => {
        if (
          doodlerBottomSpace >= platform.bottom + 23 &&
          doodlerBottomSpace <= platform.bottom + 40 &&
          doodlerLeftSpace + 44 >= platform.left &&
          doodlerLeftSpace <= platform.left + 85 &&
          !isJumping
        ) {
          startPoint = doodlerBottomSpace;
          jump();
        }
      });
    }, 15);
    addClass();
  }

  function gameOver() {
    console.log('game over');
    isGameOver = true;
    // while (grid.firstChild) {
    //   grid.removeChild(grid.firstChild);
    // }
    gameOverElement = document.querySelector('.game-over').style.visibility =
      'visible';
    gameOverElement = document.querySelector('.score').innerHTML +=
      score === 1 ? `${score} berg!` : `${score} bergs!`;
    let fourthPlatform = platforms[3].visual;
    fourthPlatform.classList.remove('platform');
    clearInterval(upTimerId);
    clearInterval(downTimerId);
    clearInterval(rightTimerId);
    clearInterval(leftTimerId);
  }

  function jump() {
    clearInterval(downTimerId);
    isJumping = true;
    upTimerId = setInterval(function () {
      doodlerBottomSpace += 10;
      doodler.style.bottom = `${doodlerBottomSpace}px`;
      if (doodlerBottomSpace > startPoint + 200) {
        fall();
      }
    }, 15);
    addClass();
  }

  function control(event) {
    if (event.key === 'ArrowLeft') {
      moveLeft();
    } else if (event.key === 'ArrowRight') {
      moveRight();
    } else if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      moveStraight();
    }
  }

  function moveLeft() {
    if (!isGameOver) {
      if (isGoingRight) {
        clearInterval(rightTimerId);
        isGoingRight = false;
        moveStraight();
      }
      isGoingLeft = true;
      clearInterval(leftTimerId);
      leftTimerId = setInterval(function () {
        if (doodlerLeftSpace >= 0) {
          doodlerLeftSpace -= 2.5;
          doodler.style.left = `${doodlerLeftSpace}px`;
        } else {
          moveRight();
        }
      }, 15);
      addClass();
    }
  }

  function moveRight() {
    if (!isGameOver) {
      if (isGoingLeft) {
        clearInterval(leftTimerId);
        isGoingLeft = false;
        moveStraight();
      }
      isGoingRight = true;
      clearInterval(rightTimerId);
      rightTimerId = setInterval(function () {
        if (doodlerLeftSpace <= 340) {
          doodlerLeftSpace += 2.5;
          doodler.style.left = `${doodlerLeftSpace}px`;
        } else {
          moveLeft();
        }
      }, 15);
      addClass();
    }
  }

  function addClass() {
    doodler.classList.remove('doodler-down-left');
    doodler.classList.remove('doodler-down-right');
    doodler.classList.remove('doodler-up-left');
    doodler.classList.remove('doodler-up-right');

    if (isGoingLeft) {
      if (isJumping) {
        doodler.classList.add('doodler-up-left');
      } else {
        doodler.classList.add('doodler-down-left');
      }
    } else {
      if (isJumping) {
        doodler.classList.add('doodler-up-right');
      } else {
        doodler.classList.add('doodler-down-right');
      }
    }
  }

  function moveStraight() {
    isGoingRight = false;
    isGoingLeft = false;
    clearInterval(leftTimerId);
    clearInterval(rightTimerId);
  }

  function start() {
    if (!isGameOver) {
      createPlatforms();
      createDoodler();
      setInterval(movePlatforms, 15);
      document.addEventListener('keyup', control);
      jump();
    }
  }
  //attach to button
  start();
});
