import { GameState } from "./game-state.js";
import { PlatformCollection } from "./platform-collection.js";

// Object literal syntax is used as alternative to custom built singleton
export let Penguin = {
    element: document.createElement('div'),
    penguinLeftSpace: 50,
    startPoint: 150,
    penguinBottomSpace: 150,
    isJumping: true,
    isGoingLeft: false,
    isGoingRight: false,
    createPenguin() {
        GameState.grid.appendChild(Penguin.element);
        Penguin.element.classList.add('penguin');
        Penguin.setPenguinAspect();
        Penguin.penguinLeftSpace = PlatformCollection.getPlatform(0).left + 12.5;
        Penguin.element.style.left = `${Penguin.penguinLeftSpace}px`;
        Penguin.element.style.bottom = `${Penguin.penguinBottomSpace}px`;
        document.addEventListener('keyup', Penguin.control);
    },

    clearPenguinAspect() {
        Penguin.element.classList.remove('penguin-down-left');
        Penguin.element.classList.remove('penguin-down-right');
        Penguin.element.classList.remove('penguin-up-left');
        Penguin.element.classList.remove('penguin-up-right');
    },
      
    setPenguinAspect() {
        Penguin.clearPenguinAspect();

        if (Penguin.isGoingLeft) {
            if (Penguin.isJumping) {
                Penguin.element.classList.add('penguin-up-left');
            } else {
                Penguin.element.classList.add('penguin-down-left');
            }
        } else {
            if (Penguin.isJumping) {
                Penguin.element.classList.add('penguin-up-right');
            } else {
                Penguin.element.classList.add('penguin-down-right');
            }
        }
    },

    control(event) {
        if (event.key === 'ArrowLeft') {
          Penguin.moveLeft();
        } else if (event.key === 'ArrowRight') {
            Penguin.moveRight();
        } else if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
            Penguin.moveStraight();
        }
    },

    jump() {
        clearInterval(Penguin.downTimerId);
        Penguin.isJumping = true;
        Penguin.upTimerId = setInterval(function () {
            Penguin.penguinBottomSpace += 10;
            Penguin.element.style.bottom = `${Penguin.penguinBottomSpace}px`;
          if (Penguin.penguinBottomSpace > Penguin.startPoint + 204) {
            Penguin.fall();
          }
        }, GameState.animationSpeed);
        Penguin.setPenguinAspect();
    },

    moveLeft() {
        if (!GameState.isGameOver()) {
          if (Penguin.isGoingRight) {
            clearInterval(Penguin.rightTimerId);
            Penguin.isGoingRight = false;
            Penguin.moveStraight();
          }
          Penguin.sGoingLeft = true;
          clearInterval(Penguin.leftTimerId);
          Penguin.leftTimerId = setInterval(function () {
            if (Penguin.penguinLeftSpace >= 0) {
                Penguin.penguinLeftSpace -= 2.5;
              Penguin.element.style.left = `${Penguin.penguinLeftSpace}px`;
            } else {
                Penguin.moveRight();
            }
          }, GameState.animationSpeed);
          Penguin.setPenguinAspect();
        }
    },
    
    moveRight() {
        if (!GameState.isGameOver()) {
          if (Penguin.isGoingLeft) {
            clearInterval(Penguin.leftTimerId);
            Penguin.isGoingLeft = false;
            Penguin.moveStraight();
          }
          Penguin.isGoingRight = true;
          clearInterval(Penguin.rightTimerId);
          Penguin.rightTimerId = setInterval(function () {
            if (Penguin.penguinLeftSpace <= 340) {
                Penguin.penguinLeftSpace += 2.5;
                Penguin.element.style.left = `${Penguin.penguinLeftSpace}px`;
            } else {
                Penguin.moveLeft();
            }
          }, GameState.animationSpeed);
          Penguin.setPenguinAspect();
        }
    },

    
    moveStraight() {
        clearInterval(Penguin.leftTimerId);
        clearInterval(Penguin.rightTimerId);
    }, 

    fall() {
        clearInterval(Penguin.upTimerId);
        Penguin.isJumping = false;
        Penguin.downTimerId = setInterval(function () {
            Penguin.penguinBottomSpace -= 2.5;
            Penguin.element.style.bottom = `${Penguin.penguinBottomSpace}px`;
          if (GameState.isGameOver()) {
            GameState.gameOver();
          }
          PlatformCollection.platforms.forEach(platform => {
            if (
                Penguin.penguinBottomSpace >= platform.bottom + 23 &&
                Penguin.penguinBottomSpace <= platform.bottom + 40 &&
                Penguin.penguinLeftSpace + 44 >= platform.left &&
                Penguin.penguinLeftSpace <= platform.left + 85 &&
              !Penguin.isJumping
            ) {
                Penguin.startPoint = Penguin.penguinBottomSpace;
                Penguin.jump();
            }
          });
        }, GameState.animationSpeed);
        Penguin.setPenguinAspect();
      }
}