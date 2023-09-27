class Character extends GameObject {
    constructor(x, y, w = 44, h = 62) {
        super(x, y, w, h);
        this.health = 5;
        this.max_jumps = 1;
        this.current_jumps = 0;
        this.velocity = {x: 0, y: 0};
        this.momentum = {x: 0, y: 0};  // vertical momentum turned out to be unnecessary
        this.speed = {x: 5, y: 10};
        this.friction = 2;
        this.knockbackValue = 20;
        this.status = {
            isLeft: false,
            isRight: false,
            isJumping: false,
            isFalling: false,
            isAttacking: false,
            isFallingPrev: false,
            isHurt: false
        };
        this.orientation = "right";
        this.invincibilityFramesLeft = 0;
        this.attackCooldownFrames = 0;
        this.attackCooldown = 15;
        this.swordDamage = 5;
        this.walkSoundCooldown = 0;
        this.currentCheckpoint = -1;
        this.steadyBody = false;
        this.jumpFrames = 0;
        this.landFrames = 0;
        this.hurtFrames = 0;
        this.attackAnimationFrames = 0;
        this.currentAttackAnimation = -1;
        this.currentAttackOrientation = -1;

        this.swordHitboxes = {
            left: new WeaponHitbox('left', this, -this.w * 1.25, 0, this.w * 1.5, this.h),
            right: new WeaponHitbox('right', this, this.w * 1.25, 0, this.w * 1.5, this.h),
            up: new WeaponHitbox('up', this, 0, -this.h, this.w * 2.5, this.h * 0.75),
            down: new WeaponHitbox('down', this, 0, 1.25 * this.h, this.w * 2, this.h * 1.25),
        }

    }

    get alive() {
        return this.health > 0;
    }

    render() {
        super.render();
        if (this.attackAnimationFrames > 0) {
            if (this.currentAttackAnimation === 0) {
                attackDownAnimation.render(this.xcenter, this.ymax, (this.status.isLeft || this.orientation === "left"));
            } else {
                console.log(this.currentAttackAnimation, this.currentAttackOrientation)
                attackAnimations[this.currentAttackAnimation][this.currentAttackOrientation].render(this.xcenter, this.ymax);
            }
        } else if (this.hurtFrames > 0) {
            hurtAnimation.render(this.xcenter, this.ymax, (this.status.isLeft || this.orientation === "left"));
        } else if (this.jumpFrames > 0) {
            jumpAnimation.render(this.xcenter, this.ymax, (this.status.isLeft || this.orientation === "left"));
        } else if (this.landFrames > 0) {
            landAnimation.render(this.xcenter, this.ymax, (this.status.isLeft || this.orientation === "left"));
        } else if (this.status.isFalling) {
            fallAnimation.render(this.xcenter, this.ymax, (this.status.isLeft || this.orientation === "left"));
        } else if (this.status.isRight) {
            runAnimation.render(this.xcenter, this.ymax);
        } else if (this.status.isLeft) {
            runAnimation.render(this.xcenter, this.ymax, true);
        } else {
            idleAnimation.render(this.xcenter, this.ymax, (this.status.isLeft || this.orientation === "left"));
        }

        if (this.invincibilityFramesLeft > 0 && (Math.floor(this.invincibilityFramesLeft / 5) % 2)) {
            push();
            noStroke();
            fill(255, 0, 0, 40);
            rect(this.xmin, this.ymin, this.w, this.h);
            pop();
        }

        // this section is hard-coded, I didn't figure out how to to it better without resorting to proper animation
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
        if ((abs(this.velocity.x) > 0) && (!this.status.isFalling) && (this.walkSoundCooldown === 0)) {
            walkSound.setVolume((600 - this.dist(character)) / 600)
            walkSound.play();
            this.walkSoundCooldown = Math.floor(80 / this.speed.x);

        }
        if ((this.status.isFalling === false) && (this.status.isFallingPrev === true)) {
            landSound.play();
        }
    }

    renderDebug() {
        super.renderDebug();
        this.swordHitboxes.left.renderDebug();
        this.swordHitboxes.right.renderDebug();
        this.swordHitboxes.up.renderDebug();
        this.swordHitboxes.down.renderDebug();
    }

    moveToCheckpoint() {
        this.x = checkpoints[this.currentCheckpoint].respawnPoint.x;
        this.y = checkpoints[this.currentCheckpoint].respawnPoint.y;
    }

    checkCheckpoints(checkpoints) {
        for (var i = 0; i < checkpoints.length; i++) {
            if (collision(this, checkpoints[i]) && this.currentCheckpoint != i) {
                for (var j = 0; j < checkpoints.length; j++) {
                    checkpoints[j].deactivate();
                }
                checkpoints[i].activate();
                this.currentCheckpoint = i;
                if (i == 4) {
                    spikesDeactivationSound.play();
                    for (var k = 0; k < 16; k++) {
                        spikes[12 + k].deactivate();
                    }
                }
                break;
            }
        }
    }

    updatePosition(platforms) {
        if (this.status.isLeft) {
            this.velocity.x = this.momentum.x - this.speed.x;
            this.momentum.x = max(this.momentum.x - this.speed.x, 0);
        } else if (this.status.isRight) {
            this.velocity.x = this.momentum.x + this.speed.x;
            this.momentum.x = min(this.momentum.x + this.speed.x, 0);
        } else {
            this.velocity.x = this.momentum.x;
        }
        this.x += this.velocity.x;
        if (!this.isFalling) {
            this.momentum.x = max(abs(this.momentum.x) - this.friction, 0) * Math.sign(this.momentum.x);
        }
        var collisionStatus;

        for (var i = 0; i < platforms.length; i++) {
            collisionStatus = platforms[i].checkCollision(this);
            if (collisionStatus) {
                if (this.velocity.x > 0) {
                    this.velocity.x = 0;
                    this.momentum.x = 0;
                    this.x = platforms[i].xmin - this.w / 2 - 0.01;
                    break;
                }
                if (this.velocity.x < 0) {
                    this.velocity.x = 0;
                    this.momentum.x = 0;
                    this.x = platforms[i].xmax + this.w / 2 + 0.01;
                    break;
                }
            }
        }
        this.updateGravity();
        for (var i = 0; i < platforms.length; i++) {
            collisionStatus = platforms[i].checkCollision(this);
            if (collisionStatus) {
                if (this.velocity.y > 0) {
                    this.velocity.y = 0;
                    this.momentum.y = 0;
                    this.y = platforms[i].ymin - 0.01;
                    this.current_jumps = 0;
                    break;
                }
                if (this.velocity.y < 0) {
                    this.velocity.y = 0;
                    this.momentum.y = 0;
                    this.y = platforms[i].ymax + this.h + 0.01;
                    break;
                }
            }
        }
        this.status.isFallingPrev = this.status.isFalling;
        this.status.isFalling = !!this.velocity.y;
        // freeze movement if plummeting below the floor level
        if (this.ymin > height) {
            this.processFall();
        }

        if (this.invincibilityFramesLeft > 0) {
            this.invincibilityFramesLeft--;
        }
        if (this.attackCooldownFrames > 0) {
            this.attackCooldownFrames--;
        }
        if (this.walkSoundCooldown > 0) {
            this.walkSoundCooldown--;
        }
        if (this.jumpFrames > 0) {
            this.jumpFrames--;
        }
        if (this.jumpFrames > 0) {
            this.jumpFrames--;
        }
        if (this.landFrames > 0) {
            this.landFrames--;
        }
        if (this.attackAnimationFrames > 0) {
            this.attackAnimationFrames--;
        }
        if (this.hurtFrames > 0) {
            this.hurtFrames--;
        }
        if (this.status.isJumping) {
            this.jumpFrames = (jumpAnimation.endFrame - jumpAnimation.startFrame) * jumpAnimation.frameBuffer;
        }
        if ((this.status.isFalling === false) && (this.status.isFallingPrev === true)) {
            this.landFrames = (landAnimation.endFrame - landAnimation.startFrame) * landAnimation.frameBuffer;
        }
        if (this.status.isAttacking) {
            if (this.orientation === 'down') {
                this.currentAttackAnimation = 0;
                this.attackAnimationFrames = (attackDownAnimation.endFrame -
                    attackDownAnimation.startFrame) * attackDownAnimation.frameBuffer;
            } else {
                this.currentAttackAnimation = int(random(1, 5));
                this.currentAttackOrientation = this.orientation != 'up' ? this.orientation : 'right';
                let endFrame = attackAnimations[this.currentAttackAnimation].right.endFrame;
                let startFrame = attackAnimations[this.currentAttackAnimation].right.startFrame;
                let frameBuffer = attackAnimations[this.currentAttackAnimation].right.frameBuffer;
                this.attackAnimationFrames = (endFrame - startFrame) * frameBuffer;
            }
        }
    }

    processDamage(damage) {
        this.health -= damage;
        this.invincibilityFramesLeft = 60;
        this.hurtFrames = (hurtAnimation.endFrame - hurtAnimation.startFrame) * hurtAnimation.frameBuffer;
        damageSound.play();
    }

    stun(object) {
        object.stunnedFrames = 18;
    }

    processFall() {
        this.velocity.x = 0;
        this.momentum.x = 0;
        this.health--;
        deathSound.play();
        if (this.health > 0) {

            this.moveToCheckpoint();


        } else {
            gameState = 2;
        }
    }


    updateGravity() {
        this.velocity.y += gravity;
        this.y = this.y + this.velocity.y;
    }

    checkUpgradeable(upgradeable) {
        if (upgradeable.active && collision(this, upgradeable)) {
            upgradeable.active = false;
            upgradeableCollectSound.play();
            this.max_jumps += 1;

        }
    }

    checkCollectables(collectables) {
        for (var i = 0; i < collectables.length; i++) {
            if (collectables[i].active && collision(this, collectables[i])) {
                collectables[i].active = false;
                collectSound.play();

            }

        }

    }

    checkFlag(flag) {
        if (collision(this, flag)) {
            gameState = 3;
            soundtrack.stop();

        }
    }

    get currentHitbox() {
        return this.swordHitboxes[this.orientation];
    }

    checkEnemies(enemies) {
        var pogoStatus = false;
        var steadyBodyStatus = false;
        for (var k in this.swordHitboxes) {  // this is strictly for visualization purposes
            this.swordHitboxes[k].selectionCheck();
        }
        for (var i = 0; i < enemies.length; i++) {
            if (!enemies[i].alive || dist(this.xcenter, this.ycenter, enemies[i].xcenter, enemies[i].ycenter) > 600) {
                continue;
            }
            // check aggro
            if (
                (dist(this.xcenter, this.ycenter, enemies[i].xcenter, enemies[i].ycenter) < 300)
                && (abs(this.ycenter - enemies[i].ycenter) < 100)
            ) {
                enemies[i].status.isAggroed = true;
            } else if (enemies[i].status.isAggroed &&
                dist(this.xcenter, this.ycenter, enemies[i].xcenter, enemies[i].ycenter) > 400) {
                enemies[i].status.isAggroed = false;
            }
            // check collision
            if (collision(this, enemies[i])) {
                if (!this.invincibilityFramesLeft) {
                    this.health--;
                    enemies[i].health -= 3;
                    this.invincibilityFramesLeft = 60;
                    this.knockback(character, enemies[i]);
                    this.stun(enemies[i]);
                }
            }
            // damage enemy

            if (this.status.isAttacking && collision(this.currentHitbox, enemies[i])) {
                enemies[i].health -= this.swordDamage;
                damageSound.play();
                if (!enemies[i].alive) {
                    enemyDeathSound.play();
                }
                this.attackKnockback(enemies[i]);
                this.stun(enemies[i]);
                if (!steadyBodyStatus) {
                    this.steadyBodyCheck();
                    steadyBodyStatus = true;
                }
                //pogo
                if (this.ymin > enemies[i].ymax && !pogoStatus) {
                    pogoStatus = true;
                    this.velocity.y -= 10;
                }
            }
        }

    }


    knockback(object1, object2) {
        object1.velocity.y -= 5;
        object2.velocity.y -= 5;
        if ((object1.velocity.x + object2.velocity.x) > 0) {
            object1.momentum.x -= this.knockbackValue;
            object2.momentum.x += this.knockbackValue;
        } else {
            object1.momentum.x += this.knockbackValue;
            object2.momentum.x -= this.knockbackValue;
        }
    }

    steadyBodyCheck() {
        if (!this.steadyBody) {
            if (this.orientation === 'right') {
                this.momentum.x -= 10;
            } else if (this.orientation === "left") {
                this.momentum.x += 10;
            }
        }
    }

    attackKnockback(object) {
        if (object.xcenter < this.xcenter) {
            object.momentum.x -= this.knockbackValue;
        } else {
            object.momentum.x += this.knockbackValue;
        }
    }

    checkSpikes(spikes) {
        for (var k in this.swordHitboxes) {  // this is strictly for visualization purposes
            this.swordHitboxes[k].selectionCheck();
        }
        for (var i = 0; i < spikes.length; i++) {
            if (!spikes[i].active) {
                continue;
            }
            if (dist(this.xcenter, this.ycenter, spikes[i].xcenter, spikes[i].ycenter) > 300) {
                continue;
            }
            // check collision
            if (collision(this, spikes[i])) {
                this.processFall();
                break;
            }

            // pogo
            if (this.status.isAttacking && collision(this.currentHitbox, spikes[i])) {
                this.velocity.y -= 10;
                pogoSpikeSound.play();
                break;
            }
        }

    }
}