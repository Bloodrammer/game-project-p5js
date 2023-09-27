class Background extends GameObject {
    constructor(img) {
        super(512, 576, 1024, 576);
        this.image = img;
    }

    render(xOffset, yOffset) {
        super.render();
        image(this.image, 0, 0, 1024, 576);
        image(this.image, 1024, 0, 1024, 576);
        image(this.image, 2048, 0, 1024, 576);
        image(this.image, -1024, 0, 1024, 576);
        image(this.image, -2048, 0, 1024, 576);
        image(this.image, 3072, 0, 1024, 576);
        image(this.image, 4096, 0, 1024, 576);
        image(this.image, 5128, 0, 1024, 576);
    }
}