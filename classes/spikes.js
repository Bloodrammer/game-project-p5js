class Spikes extends GameObject {
    constructor(x, y, w, h) {
        super(x, y, w, h);
        this.spike_width = 8;
        this.active = true;
    }

    deactivate() {
        this.active = false;
    }

    render() {
        super.render();
        if (this.active) {
            for (var i = 0; i < this.w / this.spike_width; i++) {
                fill(192);
                triangle(this.xmin + this.spike_width * i, this.ymax, this.xmin + this.spike_width * (i + 1), this.ymax, this.xmin + this.spike_width * (i + 0.5), this.ymin);

            }
        }


    }
}