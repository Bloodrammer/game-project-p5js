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
    constructor(level_data) {
        super();
        this.level_data = level_data
        this.level_objects = {}
        this.setup()
    }

    setup(){
        this.level_objects['platforms'] = [];
        for (var i = 0; i < this.level_data.platforms.length; i++) {
            this.level_objects['platforms'].push(new Platform(...this.level_data.platforms[i]));
        }
        for (var i = 0; i < this.level_data.enemies.length; i++) {
            console.log(this.level_data.enemies[i])
            this.level_objects['enemies'].push(new Enemy(...this.level_data.enemies[i]));
        }

    }
    update(){
        super.update();
        background(70);
        for (var i = 0; i < this.level_objects['platforms'].length; i++) {
            this.level_objects['platforms'][i].render();
        }
        for (var i = 0; i < this.level_objects['enemies'].length; i++) {
            this.level_objects['enemies'][i].render();
        }
        for (var i = 0; i < this.level_objects['spikes'].length; i++) {
            this.level_objects['spikes'][i].render();
        }
        for (var i = 0; i < this.level_objects['checkpoints'].length; i++) {
            this.level_objects['checkpoints'][i].render();
        }
        character.render();
        for (var i = 0; i < this.level_objects['collectables'].length; i++) {
            this.level_objects['collectables'][i].render();
        }
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