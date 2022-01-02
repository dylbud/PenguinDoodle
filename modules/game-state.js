import { PlatformCollection } from "./platform-collection.js";
import { Penguin } from "./penguin.js";

export class GameState {
    static grid = document.querySelector('.grid');
    static score = 0;
    static level = 1;
    static platformsPerLevel = 16;
    static animationSpeed = 16;


    static levelUp() {
        GameState.level++;
        GameState.setGameBackgroundImage();
        GameState.increaseAnimationSpeed();
      }

    static setGameBackgroundImage() {
        GameState.grid.style.backgroundImage = `url('./assets/images/grid${this.getLevelColorSchemeIndicator()}.png')`;
    }

    static increaseAnimationSpeed() {
        GameState.animationSpeed = GameState.animationSpeed * 0.95;
        clearInterval(PlatformCollection.movePlatformTimerId);
        PlatformCollection.movePlatformTimerId = setInterval(PlatformCollection.movePlatforms, this.animationSpeed);
    }

    static getLevelColorSchemeIndicator() {
        let numberOfLevelColorSchemes = 5;
        let colorSchemeIndicator = GameState.level % numberOfLevelColorSchemes === 0
            ? numberOfLevelColorSchemes
            : GameState.level % numberOfLevelColorSchemes;
        return colorSchemeIndicator;
    }
    static isGameOver() {
        return Penguin.penguinBottomSpace <= 0;
    }
    
    static gameOver() {
        console.log('game over', Penguin.penguinBottomSpace);
        GameState.animationSpeed = 16;
        document.querySelector('.game-over').style.visibility = 'visible';
        document.querySelector('.score').innerHTML =
          GameState.score === 1 ? `${GameState.score} berg!` : `${GameState.score} bergs!`;
        let fourthPlatform = PlatformCollection.getPlatform(3).visualElement;
        fourthPlatform.classList.remove('platform');
        GameState.level = 1;
        clearInterval(Penguin.upTimerId);
        clearInterval(Penguin.downTimerId);
        clearInterval(Penguin.rightTimerId);
        clearInterval(Penguin.leftTimerId);
        clearInterval(PlatformCollection.movePlatformTimerId);
        
        
      }

}