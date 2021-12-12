document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.grid');
  const penguin = document.createElement('div');
  let startPoint;
  let penguinBottomSpace;
  let isGameOver = true;
  let platforms = [];
  let upTimerId;
  let downTimerId;
  let isJumping;
  let isGoingLeft;
  let isGoingRight;
  let leftTimerId;
  let rightTimerId;
  let score;
  let level;
  let movePlatformTimerId;
  let platformsPerLevel = 16;
  let animationSpeed = 16;
  

  document.addEventListener('keyup', () => {
    if (isGameOver) {
      getReadyForNewGame();
      jump();
    }
  });

  function getReadyForNewGame() {
    clearBanners();
    clearPlatforms();
    SetValuesForNewGame();
    createGameComponents();
  }

  function clearBanners() {
    document.querySelector('.game-over').style.visibility = 'hidden';
    document.querySelector('.title').style.visibility = 'hidden';
    document.querySelector('.score').innerHTML = '';
  }

  function clearPlatforms() {
    while (platforms.length > 0) {
      grid.removeChild(platforms[0].visualElement);
      platforms.shift();
    }
  }

  function SetValuesForNewGame() {
    isGameOver = false;
    penguinLeftSpace = 50;
    startPoint = 150;
    penguinBottomSpace = startPoint;
    isJumping = true;
    isGoingLeft = false;
    isGoingRight = false;
    score = 0;
    level = 1;
  }

  function createGameComponents() {
    createPlatforms();
    createPenguin();
    setGameBackgroundImage();
    movePlatformTimerId = setInterval(movePlatforms, animationSpeed);
  }

  function createPlatforms() {
    let numberOfPlatforms = 5;
    let heightOfViewPort = 600;
    let nudge = 100;
    for (let i = 0; i < numberOfPlatforms; i++) {
      let platformGap = heightOfViewPort / numberOfPlatforms;
      let newPlatformPosition = (i * platformGap) + nudge;
      let newPlatform = new Platform(newPlatformPosition);
      platforms.push(newPlatform);
    }
  }

  class Platform {
    constructor(newPlatformPosition) {
      this.bottom = newPlatformPosition;
      this.left = Math.random() * 315;
      this.visualElement = document.createElement('div');
      this.setPlatformStyles();
    }

    setPlatformStyles() {
      const visualElement = this.visualElement;
      visualElement.classList.add('platform');
      setPlatformImage(visualElement);
      visualElement.style.left = this.left + 'px';
      visualElement.style.bottom = this.bottom + 'px';
      grid.appendChild(visualElement);
    }
  }

  function createPenguin() {
    grid.appendChild(penguin);
    penguin.classList.add('penguin');
    setPenguinAspect();
    penguinLeftSpace = platforms[0].left + 12.5;
    penguin.style.left = `${penguinLeftSpace}px`;
    penguin.style.bottom = `${penguinBottomSpace}px`;
    document.addEventListener('keyup', control);
  }

  function setGameBackgroundImage() {
    grid.style.backgroundImage = `url('./assets/images/grid${getLevelColorSchemeIndicator()}.png')`;
  }

  function setPlatformImage(platform) {
    platform.style.backgroundImage = `url('./assets/images/platform${getLevelColorSchemeIndicator()}.png')`;
  }

  function setAllPlatformImages() {
    platforms.forEach(platform => {
      let visualElement = platform.visualElement;
      setPlatformImage(visualElement);
    });
  }


  function movePlatforms() {
    if (penguinBottomSpace > 200 || isJumping) {
      platforms.forEach(platform => {
        platform.bottom -= 2;
        let visualElement = platform.visualElement;
        visualElement.style.bottom = `${platform.bottom}px`;

        if (platform.bottom === 0) {
          let firstPlatform = platforms[0].visualElement;
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

  function getLevelColorSchemeIndicator() {
    let numberOfLevelColorSchemes = 5;
    let colorSchemeIndicator = level % numberOfLevelColorSchemes === 0
      ? numberOfLevelColorSchemes
      : level % numberOfLevelColorSchemes;
    return colorSchemeIndicator;
  }

  function levelUp() {
    level++;
    setAllPlatformImages();
    setGameBackgroundImage();
    increaseAnimationSpeed();
  }

  function increaseAnimationSpeed() {
    animationSpeed = animationSpeed * 0.95;
    clearInterval(movePlatformTimerId);
    movePlatformTimerId = setInterval(movePlatforms, animationSpeed);
  }

  function fall() {
    clearInterval(upTimerId);
    isJumping = false;
    downTimerId = setInterval(function () {
      penguinBottomSpace -= 2.5;
      penguin.style.bottom = `${penguinBottomSpace}px`;
      if (penguinBottomSpace <= 0) {
        gameOver();
      }
      platforms.forEach(platform => {
        if (
          penguinBottomSpace >= platform.bottom + 23 &&
          penguinBottomSpace <= platform.bottom + 40 &&
          penguinLeftSpace + 44 >= platform.left &&
          penguinLeftSpace <= platform.left + 85 &&
          !isJumping
        ) {
          startPoint = penguinBottomSpace;
          jump();
        }
      });
    }, animationSpeed);
    setPenguinAspect();
  }

  function 

  function jump() {
    clearInterval(downTimerId);
    isJumping = true;
    upTimerId = setInterval(function () {
      penguinBottomSpace += 10;
      penguin.style.bottom = `${penguinBottomSpace}px`;
      if (penguinBottomSpace > startPoint + 204) {
        console.log(penguinBottomSpace, startPoint);
        fall();
      }
    }, animationSpeed);
    setPenguinAspect();
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
        if (penguinLeftSpace >= 0) {
          penguinLeftSpace -= 2.5;
          penguin.style.left = `${penguinLeftSpace}px`;
        } else {
          moveRight();
        }
      }, animationSpeed);
      setPenguinAspect();
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
        if (penguinLeftSpace <= 340) {
          penguinLeftSpace += 2.5;
          penguin.style.left = `${penguinLeftSpace}px`;
        } else {
          moveLeft();
        }
      }, animationSpeed);
      setPenguinAspect();
    }
  }

  function move(direction) {
    if (!isGameOver) {
      if (isGoingLeft) {
        clearInterval(leftTimerId);
        isGoingLeft = false;
        moveStraight();
      }
      isGoingRight = true;
      clearInterval(rightTimerId);
      rightTimerId = setInterval(function () {
        if (penguinLeftSpace <= 340) {
          penguinLeftSpace += 2.5;
          penguin.style.left = `${penguinLeftSpace}px`;
        } else {
          moveLeft();
        }
      }, animationSpeed);
      setPenguinAspect();
    }
  }


  function clearPenguinAspect() {
    penguin.classList.remove('penguin-down-left');
    penguin.classList.remove('penguin-down-right');
    penguin.classList.remove('penguin-up-left');
    penguin.classList.remove('penguin-up-right');
  }
  
  function setPenguinAspect() {
    clearPenguinAspect();

    if (isGoingLeft) {
      if (isJumping) {
        penguin.classList.add('penguin-up-left');
      } else {
        penguin.classList.add('penguin-down-left');
      }
    } else {
      if (isJumping) {
        penguin.classList.add('penguin-up-right');
      } else {
        penguin.classList.add('penguin-down-right');
      }
    }
  }

  function moveStraight() {
    clearInterval(leftTimerId);
    clearInterval(rightTimerId);
  }

  function gameOver() {
    console.log('game over');
    isGameOver = true;

    document.querySelector('.game-over').style.visibility = 'visible';
    document.querySelector('.score').innerHTML =
      score === 1 ? `${score} berg!` : `${score} bergs!`;
    let fourthPlatform = platforms[3].visualElement;
    fourthPlatform.classList.remove('platform');
    clearInterval(upTimerId);
    clearInterval(downTimerId);
    clearInterval(rightTimerId);
    clearInterval(leftTimerId);
    clearInterval(movePlatformTimerId);
  }

});
