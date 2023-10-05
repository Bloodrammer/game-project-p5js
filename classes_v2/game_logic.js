class GameLogic{
    constructor() {
        this.scenes = [];
        this.currentSceneId = -1;
    }

    initialize() {
        //    debugMode = false;
        //    debugView = false;
        createCanvas(1024, 576);
        initializeButtons();
        this.addScene(new MainMenu());
        this.currentSceneId = 0;
        this.addScene(new GameScene(levelOneData));
        // draw background
        // game lifetime
        // character
        // collectables
        // flag
        // enemies
        // checkpoints
        // platforms
        // spikes
        // HUD
        // upgradeable
        // loop and stop soundtrack

        //    // loop sound
        //    soundtrack.loop();
        //    soundtrack2.loop();
        //    // stop sound to prevent it from playing automatically
        //    soundtrack.stop();
        //    soundtrack2.stop();
    }



    addScene(scene){
        this.scenes.push(scene);
    }

    getCurrentScene(){
        return this.scenes[this.currentSceneId];
    }
}

// TODO create a button manager or something?

function startGame(){
    restartButton.hide();
    startButton.hide();
    gameLogic.currentSceneId = 1;
    //        this.initialize();
    //        playsound();
}

function restartGame() {
    restartButton.hide();
    gameLogic.currentSceneId = 0;

}

function initializeButtons(){
    restartButton = createButton('Go to main menu');
    restartButton.position(width / 2 - 50, height / 2 + 50);
    restartButton.mousePressed(restartGame);
    restartButton.hide();
    startButton = createButton('Start game');
    startButton.position(width / 2 - 50, height / 2 + 50);
    startButton.mousePressed(startGame);
    startButton.hide();
    // stop button
    stopSoundButton = createButton('Soundtrack on/off');
    stopSoundButton.position(5, 100);
//    stopSoundButton.mousePressed(stopsound);
    stopSoundButton.hide();
}