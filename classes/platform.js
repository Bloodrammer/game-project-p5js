function collision(object1, object2) {
    return (object1.xmin < object2.xmax &&
        object1.xmax > object2.xmin &&
        object1.ymin < object2.ymax &&
        object1.ymax > object2.ymin)

}

class Platform extends GameObject {
    constructor(x, y, w, h) {
        super(x, y, w, h);
    }

    render() {
        super.render();
        push();
        noStroke();
        fill(130, 108, 120);
        rect(this.xmin, this.ymin, this.w, this.h);
        pop();
    }

    checkCollision(character) {
        return collision(character, this);
    }
}