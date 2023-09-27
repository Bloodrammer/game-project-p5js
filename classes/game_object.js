class GameObject {
    constructor(x, y, w, h) {
        // posX, posY refer to the bottom center point of the object
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    dist(other) {
        if (this.xcenter > other.xcenter) {  // left
            return dist(this.xmin, this.ycenter, other.xmax, other.ycenter)
        } else if (this.xcenter < other.xcenter) { // right
            return dist(this.xmax, this.ycenter, other.xmin, other.ycenter)
        } else if (this.ymin > other.ymax) { // top
            return dist(this.xcenter, this.ymin, other.xcenter, other.ymax)
        } else if (this.ymax < other.ymin) { // bottom
            return dist(this.xcenter, this.ymax, other.xcenter, other.ymin)
        } else {
            return -1;
        }
    }

    get xmin() {
        return this.x - this.w / 2;
    }

    get xmax() {
        return this.x + this.w / 2;
    }

    get ymin() {
        return this.y - this.h;
    }

    get ymax() {
        return this.y;
    }

    get xcenter() {
        return this.x;
    }

    get ycenter() {
        return this.y - this.h / 2;
    }


    get tl() {
        // return top left coordinates of the object box
        return [this.xmin, this.ymin];
    }

    get br() {
        // return top right coordinates of the object box
        return [this.xmax, this.ymax];
    }

    get center() {
        // return center coordinates of the object box
        return [this.xcenter, this.ycenter];
    }

    render() {
        if (debugMode) {
            this.renderDebug();
        }
    }

    renderDebug() {
        fill(127, 127, 127, 100);
        rect(this.xmin, this.ymin, this.w, this.h);
        fill(255, 100, 100, 100);
        ellipse(this.xcenter, this.ymax, 28, 28);
    }

}