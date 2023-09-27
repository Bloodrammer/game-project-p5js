class HUD extends GameObject {
    constructor(x, y, w, h) {
        super(x, y, w, h);
    }

    render() {
        let collected = 0;
        for (var i = 0; i < collectables.length; i++) {
            collected += 1 - collectables[i].active;
        }
        push();
        fill(127, 127, 127, 30);
        rect(this.xmin, this.ymin, this.w, this.h);
        textAlign(LEFT);
        stroke(0);
        strokeWeight(2);
        fill(255);
        textSize(16);
        text("FPS: " + frameRate().toFixed(0), 20, 20);
        text("Lives: " + character.health, 20, 40);
        text('Timer: ' + gameLifetime.toFixed(2), 20, 60);
        text('Tokens: ' + collected + '/' + collectables.length, 20, 80);
        pop();
    }
}