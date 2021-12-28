import { GameState } from "./game-state.js";

export class Platform {
      visualElement;  
      left;
      
  constructor(newPlatformPosition) {
      this.grid = document.querySelector('.grid');
      this.bottom = newPlatformPosition;
      this.left = Math.random() * 315;
      this.visualElement = document.createElement('div');
      this.setPlatformStyles();
      this.setPlatformImage();
    }

    setPlatformStyles() {
      const visualElement = this.visualElement;
      visualElement.classList.add('platform');
      
      visualElement.style.left = this.left + 'px';
      visualElement.style.bottom = this.bottom + 'px';
      this.grid.appendChild(visualElement);
    }

    setPlatformImage() {
      this.visualElement.style.backgroundImage = `url('./assets/images/platform${GameState.getLevelColorSchemeIndicator()}.png')`;
    }


  }