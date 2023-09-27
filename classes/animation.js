class Animation {
    constructor(sprite, w, h, nFrames, xFrames, yFrames, {
        frameBuffer = 3,
        startFrame = 0,
        endFrame = null,
        scale_ = 1,
        xoffset = 0,
        yoffset = 0,
        flipOffsetX = 0,
    } = {}) {

        this.nframes = nFrames;
        this.startFrame = startFrame;
        this.endFrame = endFrame === null ? this.nframes : endFrame;
        console.log(endFrame, this.endFrame);
        this.frameBuffer = frameBuffer;
        this.counter = this.startFrame * this.frameBuffer;
        this.h = h;
        this.w = w;
        this.offset = {x: xoffset, y: yoffset};
        this.flipOffset = {x: flipOffsetX};
        this.scale_ = scale_;
        this.grid = {x: xFrames, y: yFrames};
        this.sprite = sprite;
        this.frame = {w: this.w / this.grid.x, h: this.h / this.grid.y};

    }

    reset() {
        this.counter = 0;
    }

    render(xcenter, ymax, flip = false) {
        let column = Math.floor(this.counter / this.frameBuffer) % this.grid.x;
        let row = Math.floor(Math.floor(this.counter / this.frameBuffer) / this.grid.x);
        if (!flip) {
            image(this.sprite, xcenter - this.scale_ * this.frame.w / 2 + this.offset.x, ymax - this.scale_ * this.frame.h + this.offset.y, this.scale_ * this.frame.w, this.scale_ * this.frame.h, column * this.frame.w,
                row * this.frame.h,
                this.frame.w, this.frame.h, "COVER", "CENTER", "BOTTOM");


        } else {
            push();
            translate(this.frame.w, 0);
            scale(-1, 1);
            image(this.sprite, -xcenter + this.scale_ * this.frame.w / 2 - this.offset.x - this.flipOffset.x, ymax - this.scale_ * this.frame.h + this.offset.y, this.scale_ * this.frame.w, this.scale_ * this.frame.h, column * this.frame.w,
                row * this.frame.h,
                this.frame.w, this.frame.h, "COVER", "CENTER", "BOTTOM");
            pop();
        }
        if (this.counter + 1 === this.endFrame * this.frameBuffer) {
            this.counter = this.startFrame * this.frameBuffer;
        } else {
            this.counter++;
        }

    }

}