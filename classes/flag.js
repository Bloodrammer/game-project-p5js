class Flag extends GameObject {
    constructor(x, y, w = 16, h = 192) {
        super(x, y, w, h);
    }

    render() {
        super.render();
        fill(150, 111, 51);
        rect(this.xmin, this.ymin, this.w, this.h - 16);
        rect(this.xmin - 8, this.ymax - 16, this.w + 16, 16);

        fill(100, 200, 100);
        rect(this.xmin - 64, this.ymin + 16, 64, 32);
    }
}