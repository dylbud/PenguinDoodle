import { PlatformCollection } from "./platform-collection.js";
import { Penguin } from "./penguin.js";

export class GameState {
    static grid = document.querySelector('.grid');
    static score = 0;
    static level = 1;
    static platformsPerLevel = 6;
    static animationSpeed = 16;


    static levelUp() {
        this.level++;
        this.setGameBackgroundImage();
        this.increaseAnimationSpeed();
      }

    static setGameBackgroundImage() {
        this.grid.style.backgroundImage = `url('./assets/images/grid${this.getLevelColorSchemeIndicator()}.png')`;
    }

    static increaseAnimationSpeed() {
        this.animationSpeed = this.animationSpeed * 0.95;
        clearInterval(PlatformCollection.movePlatformTimerId);
        PlatformCollection.movePlatformTimerId = setInterval(PlatformCollection.movePlatforms, this.animationSpeed);
    }

    static getLevelColorSchemeIndicator() {
        let numberOfLevelColorSchemes = 5;
        let colorSchemeIndicator = this.level % numberOfLevelColorSchemes === 0
            ? numberOfLevelColorSchemes
            : this.level % numberOfLevelColorSchemes;
        return colorSchemeIndicator;
    }
    static isGameOver() {
        return Penguin.penguinBottomSpace <= 0;
    }
    
    static gameOver() {
        console.log('game over');
    
        document.querySelector('.game-over').style.visibility = 'visible';
        document.querySelector('.score').innerHTML =
          GameState.score === 1 ? `${GameState.score} berg!` : `${GameState.score} bergs!`;
        let fourthPlatform = PlatformCollection.getPlatform(3).visualElement;
        fourthPlatform.classList.remove('platform');
        clearInterval(Penguin.upTimerId);
        clearInterval(Penguin.downTimerId);
        clearInterval(Penguin.rightTimerId);
        clearInterval(Penguin.leftTimerId);
        clearInterval(PlatformCollection.movePlatformTimerId);
        
      }

}