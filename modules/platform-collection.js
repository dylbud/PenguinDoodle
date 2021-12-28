import { Platform } from "./platform.js";
import { GameState } from "./game-state.js";
import { Penguin } from './penguin.js';

export class PlatformCollection {
    static platforms = [];
    static movePlatformTimerId = 0;
    static createPlatforms() {
        this.platforms = new Array();
        console.log("init", this.platforms);
        let numberOfPlatforms = 5;
        let heightOfViewPort = 600;
        let nudge = 100;
        for (let i = 0; i < numberOfPlatforms; i++) {
          let platformGap = heightOfViewPort / numberOfPlatforms;
          let newPlatformPosition = (i * platformGap) + nudge;
          let newPlatform = new Platform(newPlatformPosition, GameState.level);
          this.platforms.push(newPlatform);
        }
        
    };

    static getLength() {
        return PlatformCollection.platforms.length;
    };

    static getPlatform(index) {
        return PlatformCollection.platforms[index];
    };

    static removeFirstElement() {
        return PlatformCollection.platforms.shift();
    };

    static clearPlatforms() {
        while (PlatformCollection.getLength() > 0) {
            GameState.grid.removeChild(PlatformCollection.getPlatform(0).visualElement);
            this.removeFirstElement();
        }
    };
    
    static movePlatforms() {
        if (Penguin.penguinBottomSpace > 200 || Penguin.isJumping) {
            PlatformCollection.platforms.forEach(platform => {
                platform.bottom -= 2;
                let visualElement = platform.visualElement;
                visualElement.style.bottom = `${platform.bottom}px`;

                if (platform.bottom === 0) {
                    let firstPlatform = PlatformCollection.getPlatform(0).visualElement;
                    firstPlatform.classList.remove('platform');
                    PlatformCollection.removeFirstElement();
                    GameState.score++;
                    if (GameState.score % GameState.platformsPerLevel === 0) {
                    GameState.levelUp();
                    PlatformCollection.setAllPlatformImages();
                    }
                    console.log('level' + GameState.level);
                    let newPlatform = new Platform(600, GameState.level);
                    PlatformCollection.platforms.push(newPlatform);
                }
            });
        }
    };

    static setAllPlatformImages() {
        this.platforms.forEach(platform => {
          platform.setPlatformImage();
        });
    };

}

