
import { PlatformCollection } from './modules/platform-collection.js';
import { GameState } from './modules/game-state.js';
import { Penguin } from './modules/penguin.js';

document.addEventListener('DOMContentLoaded', () => {


  let gameStart = true;


  

  document.addEventListener('keyup', () => {
    if (GameState.isGameOver() || gameStart) {
      document.addEventListener('keyup', control);
      gameStart = false;
      getReadyForNewGame();
      Penguin.jump();
    }
  });

  function getReadyForNewGame() {
    
    clearBanners();
    PlatformCollection.clearPlatforms();
    PlatformCollection.createPlatforms();
    

    Penguin.createPenguin();
   
    GameState.setGameBackgroundImage();
    PlatformCollection.movePlatformTimerId = setInterval(PlatformCollection.movePlatforms, GameState.animationSpeed);

  }

  function clearBanners() {
    document.querySelector('.game-over').style.visibility = 'hidden';
    document.querySelector('.title').style.visibility = 'hidden';
    document.querySelector('.score').innerHTML = '';
  }

  

  function control(event) {
    if (event.key === 'ArrowLeft') {
      Penguin.moveLeft();
    } else if (event.key === 'ArrowRight') {
        Penguin.moveRight();
    } else if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        Penguin.moveStraight();
    }
}




    







});
