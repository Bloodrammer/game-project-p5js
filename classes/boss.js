class Boss extends Enemy {
    constructor(x, y, w, h, routeXMin = null, routeXMax = null) {
        super(x, y, w, h, routeXMin, routeXMax);
        this.health = 50;
    }

    render() {
        if (!this.alive) {
            return -1;
        }
        if (debugMode) {
            this.renderDebug();
        }

        if (this.attackAnimationFrames > 0) {
            bossAttackAnimation.render(this.xcenter, this.ymax, (!(this.status.isLeft || this.orientation === "left")));
        } else if (this.hurtFrames > 0) {
            bossHurtAnimation.render(this.xcenter, this.ymax, (!(this.status.isLeft || this.orientation === "left")));
        } else if (this.status.isRight) {
            bossWalkAnimation.render(this.xcenter, this.ymax, true);
        } else if (this.status.isLeft) {
            bossWalkAnimation.render(this.xcenter, this.ymax);
        } else {
            bossIdleAnimation.render(this.xcenter, this.ymax, (!(this.status.isLeft || this.orientation === "left")));
        }


        fill(240, 100, 100, 120);
        if (this.swordHitboxes.left.animationLifetime > 0) {
            arc(this.xmin, this.ycenter, this.swordHitboxes.left.w * 2, this.swordHitboxes.left.h, 3 / 4 * PI, 5 / 4 * PI);
            this.swordHitboxes.left.animationLifetime--;
        } else if (this.swordHitboxes.right.animationLifetime > 0) {
            arc(this.xmax, this.ycenter, this.swordHitboxes.right.w * 2, this.swordHitboxes.right.h, -PI / 4, PI / 4);
            this.swordHitboxes.right.animationLifetime--;
        } else if (this.swordHitboxes.up.animationLifetime > 0) {
            arc(this.xcenter, this.ymin, this.swordHitboxes.up.w, this.swordHitboxes.up.h * 2, PI * 7 / 6, -PI / 6);
            this.swordHitboxes.up.animationLifetime--;
        } else if (this.swordHitboxes.down.animationLifetime > 0) {
            arc(this.xcenter, this.ymax, this.swordHitboxes.down.w, this.swordHitboxes.down.h * 2, PI / 6, PI * 5 / 6);
            this.swordHitboxes.down.animationLifetime--;
        }
        if ((abs(this.velocity.x) > 0) && !this.status.isFalling && (this.walkSoundCooldown === 0) && this.dist(character) < 600) {
            walkSound.setVolume(0.5 * (600 - this.dist(character)) / 600)
            walkSound.play();
            this.walkSoundCooldown = Math.floor(80 / this.speed.x);

        }
    }
}