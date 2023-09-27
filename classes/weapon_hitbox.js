class WeaponHitbox extends GameObject {
    constructor(name, parent_object, x_offset, y_offset, w, h) {
        super(parent_object.x + x_offset, parent_object.y + y_offset, w, h);
        this.name = name;
        this.parent = parent_object;
        this.x_offset = x_offset;
        this.y_offset = y_offset;
        this.readiness = 0;
        this.animationLifetime = 0;
    }

    selectionCheck() {
        if (this.name === this.parent.orientation) {
            if (this.parent.status.isAttacking) {
                this.attack();
            } else {
                this.select();
            }

        } else {
            this.deselect();
        }
    }

    renderDebug() {
        switch (this.readiness) {
            case 0:
                fill(240, 240, 240, 90);
                break;
            case 1:
                fill(240, 240, 240, 120);
                break;
            case 2:
                fill(240, 100, 100, 150);
                break;
        }
        rect(this.xmin, this.ymin, this.w, this.h);

    }

    deselect() {
        this.readiness = 0;
    }

    select() {
        this.readiness = 1;
    }

    attack() {
        this.readiness = 2;
        this.animationLifetime = 3;
    }

    get x() {
        return this.parent.x + this.x_offset;
    }

    set x(value) {
        return value;
    }

    get y() {
        return this.parent.y + this.y_offset;
    }

    set y(value) {
        return value;
    }
}