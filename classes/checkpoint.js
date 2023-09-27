class Checkpoint extends GameObject {
    constructor(x, y, w, h, respX, respY) {
        super(x, y, w, h);
        this.respawnPoint = new RespawnPoint(respX, respY);
    }

    activate() {
        this.respawnPoint.active = true;
    }

    deactivate() {
        this.respawnPoint.active = false;
    }


    render() {
        super.render();
        this.respawnPoint.render();
    }
}

class RespawnPoint extends GameObject {
    constructor(x, y) {
        super(x, y, 64, 64);
        this.active = false;

    }

    render() {
        super.render();
        push();
        if (this.active) {
            fill(0, 255, 0);
        } else {
            fill(127, 0, 0);
        }
        ellipse(this.xcenter, this.ymax - 8, 12, 12);
        fill(127);
        rect(this.xcenter - 8, this.ymax - 8, 16, 8)
        pop();

    }
}