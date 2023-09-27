class Enemy extends Character {
    constructor(x, y, w = 64, h = 64, routeXMin = null, routeXMax = null) {
        super(x, y, w, h);
        this.health = 15;
        this.status.isAggroed = false;
        this.velocity = {x: 0, y: 0};
        this.swordDamage = 1;
        this.speed = {x: 2, y: 0};
        this.max_jumps = 0;
        this.route = this.setupRoute(routeXMin, routeXMax);
        this.patrolFrames = 0;
        this.patrolPauseDuration = 60;
        this.patrolDirection = 1;
        this.attackCooldown = 48;
        this.stunnedFrames = 0;
        this.swordHitboxes = {
            left: new WeaponHitbox('left', this, -this.w * 0.9, 0, this.w * 0.8, this.h),
            right: new WeaponHitbox('right', this, this.w * 0.9, 0, this.w * 0.8, this.h),
            up: new WeaponHitbox('up', this, 0, -this.h, this.w * 1.5, this.h * 0.75),
            down: new WeaponHitbox('down', this, 0, 1.25 * this.h, this.w * 2, this.h * 1.25),
        }
    }

    processFall() {
        this.health = 0;
    }

    setupRoute(routeXMin, routeXMax) {
        if (routeXMin != null && routeXMax != null) {
            return {xmin: routeXMin, xmax: routeXMax};
        } else {
            return {xmin: this.xcenter, xmax: this.xcenter};
        }
    }

    behavior(character) {
        if (!this.alive) {
            return -1;
        }
        if (this.stunnedFrames > 0) {
            this.stunnedFrames--;
            this.stop();
            return 0;
        }
        if (!this.status.isAggroed) {
            if (this.xcenter > this.route.xmax || this.xcenter < this.route.xmin) {
                this.returnToPatrol();
            }
            this.patrol();
        } else {
            this.engageCharacter(character);
        }
    }

    patrol() {
        this.speed.x = 2;
        if (this.route.xmin === this.route.xmax) {
            return 0;
        } else {
            if (this.patrolFrames > 0) {
                this.patrolFrames--;
                if (this.patrolFrames === 0) {
                    this.patrolDirection *= -1;
                    this.move();
                }
            } else {
                this.move();
                if (this.xmax > this.route.xmax || this.xmin < this.route.xmin) {
                    this.stop();
                    this.patrolFrames = this.patrolPauseDuration;
                }
            }
        }
    }

    stop() {
        this.status.isRight = false;
        this.status.isLeft = false;
    }

    move() {
        if (this.patrolDirection === 1) {
            this.status.isRight = true;
            this.orientation = "right";
        } else {
            this.status.isLeft = true;
            this.orientation = "left";
        }
    }

    returnToPatrol() {
        if (this.xcenter <= this.route.xmin) {
            this.patrolDirection = 1;
            this.move();
        } else {
            this.patrolDirection = -1;
            this.move();
        }
    }

    engageCharacter(character) {
        this.speed.x = 2;
        if (character.xcenter < this.xcenter) {
            this.status.isRight = false;
            this.status.isLeft = true;
            this.orientation = "left";
        } else {
            this.status.isLeft = false;
            this.status.isRight = true;
            this.orientation = "right";
        }
        if (this.ymin > character.ymax) {
            this.orientation = 'up';
        }
        if (this.dist(character) < 20) {
            this.stop();
        }
        if (this.dist(character) < 100) {
            if (this.attackCooldownFrames === 0) {
                this.attack(character);
            }

        }
    }

    attack(character) {
        this.status.isAttacking = true;
        for (var k in this.swordHitboxes) {  // this is strictly for visualization purposes
            this.swordHitboxes[k].selectionCheck();
        }
        this.attackCooldownFrames = this.attackCooldown;
        enemyAttackSound.play();
        if (this.status.isAttacking && collision(this.currentHitbox, character) && (character.invincibilityFramesLeft === 0)) {
            character.processDamage(this.swordDamage)
            this.attackKnockback(character);
        }
    }

    render() {
        if (!this.alive) {
            return -1;
        }
        if (debugMode) {
            this.renderDebug();
        }

        if (this.attackAnimationFrames > 0) {
            skeletonAttackAnimation.render(this.xcenter, this.ymax, (this.status.isLeft || this.orientation === "left"));

        } else if (this.hurtFrames > 0) {
            skeletonHurtAnimation.render(this.xcenter, this.ymax, (this.status.isLeft || this.orientation === "left"));
        } else if (this.status.isRight) {
            skeletonWalkAnimation.render(this.xcenter, this.ymax);
        } else if (this.status.isLeft) {
            skeletonWalkAnimation.render(this.xcenter, this.ymax, true);
        } else {
            skeletonIdleAnimation.render(this.xcenter, this.ymax, (this.status.isLeft || this.orientation === "left"));
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