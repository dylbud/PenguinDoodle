document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.grid');
  const doodler = document.createElement('div');
  let doodlerLeftSpace = 50;
  let startPoint = 150;
  let doodlerBottomSpace = startPoint;
  let isGameOver = true;
  let platformCount;
  let platforms = [];
  let upTimerId;
  let downTimerId;
  let isJumping = true;
  let isGoingLeft = false;
  let isGoingRight = false;
  let leftTimerId;
  let rightTimerId;
  let score = 0;
  let level = 1;
  let movePlatformTimerId;
  let numberOfLevelColorSchemes = 5;
  let platformsPerLevel = 10;
  let platformImagePartialUrl = './assets/images/platform';
  let gridImagePartialUrl = './assets/images/grid';
  let animationSpeed;

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
      visual.style.backgroundImage = `url('${platformImagePartialUrl}${levelStyleMarker()}.png')`;
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
          if (score % platformsPerLevel === 0) {
            levelUp();
          }
          console.log('level' + level);
          let newPlatform = new Platform(600);
          platforms.push(newPlatform);
        }
      });
    }
  }

  function levelStyleMarker() {
    return level % numberOfLevelColorSchemes === 0
      ? numberOfLevelColorSchemes
      : level % numberOfLevelColorSchemes;
  }

  function levelUp() {
    movePlatforms();
    platforms.forEach(platform => {
      let visual = platform.visual;
      visual.style.backgroundImage = `url('${platformImagePartialUrl}${levelStyleMarker()}.png')`;
    });

    grid.style.backgroundImage = `url('${gridImagePartialUrl}${levelStyleMarker()}.png')`;

    level++;

    platforms.forEach(platform => {
      let visual = platform.visual;
      visual.style.backgroundImage = `url('${platformImagePartialUrl}${levelStyleMarker()}.png')`;
    });

    grid.style.backgroundImage = `url('${gridImagePartialUrl}${levelStyleMarker()}.png')`;
    animationSpeed = animationSpeed - 1;
    clearInterval(movePlatformTimerId);
    movePlatformTimerId = setInterval(movePlatforms, animationSpeed);
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
    }, animationSpeed);
    addClass();
  }

  function gameOver() {
    console.log('game over');
    isGameOver = true;

    document.querySelector('.game-over').style.visibility = 'visible';
    document.querySelector('.score').innerHTML =
      score === 1 ? `${score} berg!` : `${score} bergs!`;
    let fourthPlatform = platforms[3].visual;
    fourthPlatform.classList.remove('platform');
    clearInterval(upTimerId);
    clearInterval(downTimerId);
    clearInterval(rightTimerId);
    clearInterval(leftTimerId);
    clearInterval(movePlatformTimerId);
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
    }, animationSpeed);
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
      }, animationSpeed);
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
      }, animationSpeed);
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
    isGameOver = false;
    document.querySelector('.game-over').style.visibility = 'hidden';
    document.querySelector('.title').style.visibility = 'hidden';
    document.querySelector('.score').innerHTML = '';
    while (platforms.length > 0) {
      grid.removeChild(platforms[0].visual);
      platforms.shift();
    }
    doodlerLeftSpace = 50;
    startPoint = 150;
    doodlerBottomSpace = startPoint;
    platformCount = 5;
    platforms = [];
    isJumping = true;
    isGoingLeft = false;
    isGoingRight = false;
    score = 0;
    level = 1;
    animationSpeed = 16;
    createPlatforms();
    createDoodler();
    grid.style.backgroundImage = `url('${gridImagePartialUrl}${levelStyleMarker()}.png')`;
    movePlatformTimerId = setInterval(movePlatforms, animationSpeed);
    document.addEventListener('keyup', control);
    jump();
  }

  document.addEventListener('keyup', () => {
    if (isGameOver) {
      start();
    }
  });
});
