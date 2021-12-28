
import { PlatformCollection } from './modules/platform-collection.js';
import { GameState } from './modules/game-state.js';
import { Penguin } from './modules/penguin.js';

document.addEventListener('DOMContentLoaded', () => {


  let gameStart = true;


  

  document.addEventListener('DOMContentLoaded', () => {
    if (GameState.isGameOver() || gameStart) {
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






    







});
