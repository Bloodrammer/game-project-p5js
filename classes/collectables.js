class Collectable extends GameObject {
    constructor(x, y, w = 32, h = 32) {
        super(x, y, w, h);
        this.active = true;
    }

    render() {
        super.render();
        if (this.active) {
            fill(140, 30, 180);
            rect(this.xmin, this.ymin, this.w, this.h);
        }
    }
}

class UpgradeCollectable extends Collectable {
    constructor(x, y, w = 32, h = 32) {
        super(x, y, w, h);
        this.timer = 0;
        this.active = true;
    }

    render() {
        super.render();
        if (this.active) {
            if (this.timer > 14) {
                fill(0, 150, 150);
            } else {
                fill(150, 150, 0);
            }
            rect(this.xmin, this.ymin, this.w, this.h);
            this.timer++;
            this.timer = this.timer % 30;
        }

    }
}