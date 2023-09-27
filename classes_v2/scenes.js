class Scene{
    constructor() {
    }

    update(){

    }
}

// this should probably be just an object, but let's make it a class for the time being
class MainMenu extends Scene{
    update() {
        super.update();
        background(127);
        stopSoundButton.hide();
        startButton.show();
        push();
        textAlign(CENTER);
        textSize(72);
        text("Jumpy bubbalah", width / 2, height / 2 - 100);
        pop();
        textAlign(CENTER);
        textSize(20);
        text('Get to the flag, collect all the tokens', width / 2, height / 2 - 50);
        text('Controls: Arrows - Move/direct attack, Z - Jump, X - Sword attack', width / 2, height / 2 - 25);
        text('You can attack in all directions and pogo off the spikes by attacking downwards', width / 2, height / 2);
    }
}

class GameScene extends Scene{  
    update(){
        super.update();
    }
}

// tbh it may not be necessary for it to be a separate scene
class GameOverScene extends Scene{
    update(){
        super.update();
    }
}
// tbh it may not be necessary for it to be a separate scene
class VictoryScene extends Scene{
    update(){
        super.update();
    }
}