// This file will implement the command pattern for user input instead of hard-coded commands in keyPressed and keyReleased

class Command{
    constructor(unit) {
        this.unit = unit;
    }
    
    execute(){}
}

class JumpCommand extends Command{
    constructor(unit) {
        super(unit);
    }
    
    execute() {
        super.execute();
    }
}

class MoveLeftCommand extends Command{
    constructor(unit) {
        super(unit);
    }

    execute() {
        super.execute();
    }
}

class MoveRightCommand extends Command{
    constructor(unit) {
        super(unit);
    }

    execute() {
        super.execute();
    }
}

class MoveUpCommand extends Command{
    constructor(unit) {
        super(unit);
    }

    execute() {
        super.execute();
    }
}

class MoveDownCommand extends Command{
    constructor(unit) {
        super(unit);
    }

    execute() {
        super.execute();
    }
}

class AttackCommand extends Command{
    constructor(unit) {
        super(unit);
    }

    execute() {
        super.execute();
    }
}




function __keyPressed() {
    console.log("keyPressed: " + key);
    console.log("keyPressed: " + keyCode);
    if (keyCode == 39) {
        character.status.isRight = true;
        character.orientation = 'right';
    } else if (keyCode == 37) {
        character.status.isLeft = true;
        character.orientation = 'left';

    } else if (keyCode == 38) {
        character.orientation = 'up';

    } else if (keyCode == 40) {
        character.orientation = 'down';

    } else if (keyCode == 90) {
        if ((character.current_jumps < character.max_jumps) && !(character.status.isFalling && character.max_jumps == 1)) {
            if (character.current_jumps === 0) {
                jumpSound.play();
            } else {
                secondJumpSound.play();
            }
            character.velocity.y -= 10;
            character.current_jumps += 1;
            character.status.isJumping = true;
        }

    } else if (keyCode == 88) {
        if (character.attackCooldownFrames == 0) {
            character.status.isAttacking = true;
            character.attackCooldownFrames = character.attackCooldown;
            attackSound.play();
        }
    }
}


function __keyReleased() {
    // if statements to control the animation of the character when
    // keys are released.

    console.log("keyReleased: " + key);
    console.log("keyReleased: " + keyCode);
    if (keyCode == 39) {
        character.status.isRight = false;
    } else if (keyCode == 37) {
        character.status.isLeft = false;
    } else if (keyCode == 38) {
        character.orientation = 'right';

    } else if (keyCode == 40) {
        character.orientation = 'right';
    }
}