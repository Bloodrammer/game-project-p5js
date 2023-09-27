/*

I decided to rewrite the entire game project from ground up. Even though I already used classes and a base class GameObject,
which everybody else inherited from, I hated the concept of canyons and having a floor level, so I decided to rewrite everything
using collision detection logic. Sources of inspiration for this project include previuos experience with Unity and numerous YouTube tutorials on how to emulate mechanics from Celeste, Hollow Knight and Terraria so that movement is fun and the game is not wonky.

*/
var character;

var debugMode;
var debugView;
const gravity = 9.81 / 30;
var cameraPosX = 0;
var cameraPosY = 0;
var upgradeable;
var collectables;

var jumpSound;
var collectSound;
var deathSound;
var landSound;
var attackSound;
var soundtrack;
var soundtrack2;
var walkSound;
var pogoSpikeSound;
var enemyAttackSound;
var enemyDeathSound;
var damageSound;
var secondJumpSound;
var upgradeableCollectSound;
var spikesDeactivationSound;

var charIdle;
var charRun;
var charAttack;
var charDeath;
var charJump;
var charHurt;
var charAirAttack;

var hud;

var platformInputs;
var platforms;
var spikes;

var gameState = 0;
var gameLifetime = 0.;
var bestLifetime = 100000000;
var flag;

var enemies;

var restartButton;
var startButton;
var stopSoundButton;

var idleAnimation;
var jumpAnimation;
var fallAnimation;
var landAnimation;
var runAnimation;
var attackAnimations;
var attackDownAnimation;
var hurtAnimation;

var skeletonSprite;
var skeletonIdleAnimation;
var skeletonWalkAnimation;
var skeletonAttackAnimation;
var skeletonHurtAnimation;
var skeletonDeathAnimation;

var bossSprite;
var bossIdleAnimation;
var bossAttackAnimation;
var bossWalkAnimation;
var bossHurtAnimation;
var bossDeathAnimation;


var bgImage1;
var bgImage2;
var bgImage3;
var bgImage4;
var bgMountains1;
var bgMountains2;

var bgImageLogic1;
var bgImageLogic2;
var bgImageLogic3;
var bgImageLogic4;
var bgMountainsLogic1;
var bgMountainsLogic2;

var checkpoints;


function preload() {
    // load sounds
    soundtrack = loadSound('assets/soundtracks/Dark Ambient 5.mp3');
    soundtrack.setVolume(0.7);
    soundtrack2 = loadSound('assets/soundtracks/Light Ambience 2.mp3');
    soundtrack2.setVolume(0.3);
    jumpSound = loadSound('assets/sfx/30_Jump_03.wav');
    jumpSound.setVolume(0.5);
    walkSound = loadSound('assets/sfx/12_Step_wood_03.wav');
    walkSound.setVolume(0.5);
    landSound = loadSound('assets/sfx/45_Landing_01.wav')
    landSound.setVolume(0.3);
    collectSound = loadSound('assets/sfx/Retro PickUp Coin 04.wav');
    collectSound.setVolume(0.5);
    upgradeableCollectSound = loadSound('assets/sfx/Retro Magic 34.wav');
    upgradeableCollectSound.setVolume(0.5);
    deathSound = loadSound("assets/sfx/Retro Negative Short 23.wav");
    deathSound.setVolume(0.5);
    attackSound = loadSound("assets/sfx/03_Claw_03.wav")
    attackSound.setVolume(0.5);
    enemyAttackSound = loadSound("assets/sfx/22_Slash_04.wav")
    enemyAttackSound.setVolume(0.5);
    enemyDeathSound = loadSound("assets/sfx/69_Enemy_death_01.wav")
    enemyDeathSound.setVolume(0.5);
    damageSound = loadSound("assets/sfx/15_Impact_flesh_02.wav")
    damageSound.setVolume(0.5);
    pogoSpikeSound = loadSound("assets/sfx/39_Block_03.wav")
    pogoSpikeSound.setVolume(0.5);
    secondJumpSound = loadSound("assets/sfx/04_Fire_explosion_04_medium.wav")
    secondJumpSound.setVolume(0.5);
    spikesDeactivationSound = loadSound("assets/sfx/Retro Turn Off 12.wav");
    spikesDeactivationSound.setVolume(0.5);
    // load sprites

    bgImage1 = loadImage("assets/sprites/Clouds 3/1.png");
    bgImage2 = loadImage("assets/sprites/Clouds 3/2.png");
    bgImage3 = loadImage("assets/sprites/Clouds 3/3.png");
    bgImage4 = loadImage("assets/sprites/Clouds 3/4.png");

    bgMountains1 = loadImage("assets/sprites/Mountains_updated/6.png");
    bgMountains2 = loadImage("assets/sprites/Mountains_updated/7.png");

    charIdle = loadImage('assets/sprites/knight/Idle.png');
    charRun = loadImage('assets/sprites/knight/Run.png');
    charAttack = loadImage('assets/sprites/knight/Attacks.png');
    charAirAttack = loadImage('assets/sprites/knight/attack_from_air.png');
    charDeath = loadImage('assets/sprites/knight/Death.png');
    charJump = loadImage('assets/sprites/knight/Jump.png');
    charHurt = loadImage('assets/sprites/knight/Hurt.png');

    skeletonSprite = loadImage('assets/sprites/Skeleton enemy/Skeleton enemy.png')

    idleAnimation = new Animation(charIdle, 256, 256, 8, 2, 4, {scale_: 1.2, flipOffsetX: 26});
    runAnimation = new Animation(charRun, 256, 256, 8, 2, 4, {scale_: 1.2, flipOffsetX: 26});
    jumpAnimation = new Animation(charJump, 256, 256, 8, 2, 4, {
        frameBuffer: 4,
        startFrame: 0,
        endFrame: 3,
        flipOffsetX: 26,
        scale_: 1.2
    });
    fallAnimation = new Animation(charJump, 256, 256, 8, 2, 4, {
        frameBuffer: 12,
        startFrame: 3,
        endFrame: 5,
        scale_: 1.2,
        flipOffsetX: 26
    });
    landAnimation = new Animation(charJump, 256, 256, 8, 2, 4, {
        frameBuffer: 4,
        startFrame: 5,
        endFrame: 8,
        scale_: 1.2,
        flipOffsetX: 26
    });
    attackAnimations = {
        1: {
            right: new Animation(charAttack, 1024, 320, 40, 8, 5, {
                frameBuffer: 3,
                startFrame: 0,
                endFrame: 6,
                scale_: 1.2,
                flipOffsetX: 26
            }),
            left: new Animation(charAttack, 1024, 320, 40, 8, 5, {
                frameBuffer: 3,
                startFrame: 20,
                endFrame: 26,
                scale_: 1.2,
                flipOffsetX: 26
            })
        },
        2: {
            right: new Animation(charAttack, 1024, 320, 40, 8, 5, {
                frameBuffer: 3,
                startFrame: 6,
                endFrame: 10,
                scale_: 1.2,
                flipOffsetX: 26
            }),
            left: new Animation(charAttack, 1024, 320, 40, 8, 5, {
                frameBuffer: 3,
                startFrame: 26,
                endFrame: 30,
                scale_: 1.2,
                flipOffsetX: 26
            })
        },
        3: {
            right: new Animation(charAttack, 1024, 320, 40, 8, 5, {
                frameBuffer: 3,
                startFrame: 10,
                endFrame: 15,
                scale_: 1.2,
                flipOffsetX: 26
            }),
            left: new Animation(charAttack, 1024, 320, 40, 8, 5, {
                frameBuffer: 3,
                startFrame: 30,
                endFrame: 35,
                scale_: 1.2,
                flipOffsetX: 26
            })
        },
        4: {
            right: new Animation(charAttack, 1024, 320, 40, 8, 5, {
                frameBuffer: 3,
                startFrame: 14,
                endFrame: 20,
                scale_: 1.2,
                flipOffsetX: 26
            }),
            left: new Animation(charAttack, 1024, 320, 40, 8, 5, {
                frameBuffer: 3,
                startFrame: 34,
                endFrame: 40,
                scale_: 1.2,
                flipOffsetX: 26
            })
        },
    }
    attackDownAnimation = new Animation(charAirAttack, 256, 256, 7, 2, 4, {frameBuffer: 4, startFrame: 0, endFrame: 3});
    hurtAnimation = new Animation(charHurt, 256, 128, 3, 2, 2, {frameBuffer: 4});

    skeletonAttackAnimation = new Animation(skeletonSprite, 832, 320, 65, 13, 5, {
        frameBuffer: 4,
        startFrame: 0, endFrame: 13, scale_: 1.5, xoffset: 0, yoffset: 25, flipOffsetX: 26
    });
    skeletonDeathAnimation = new Animation(skeletonSprite, 832, 320, 65, 13, 5, {
        frameBuffer: 4,
        startFrame: 13,
        endFrame: 26,
        scale_: 1.5,
        xoffset: 0,
        yoffset: 25,
        flipOffsetX: 26
    });
    skeletonWalkAnimation = new Animation(skeletonSprite, 832, 320, 65, 13, 5, {
        frameBuffer: 4,
        startFrame: 26,
        endFrame: 38,
        scale_: 1.5,
        xoffset: 0,
        yoffset: 25,
        flipOffsetX: 26
    });
    skeletonIdleAnimation = new Animation(skeletonSprite, 832, 320, 65, 13, 5, {
        frameBuffer: 32,
        startFrame: 39,
        endFrame: 43,
        scale_: 1.5,
        xoffset: 0,
        yoffset: 25,
        flipOffsetX: 26
    });
    skeletonHurtAnimation = new Animation(skeletonSprite, 832, 320, 65, 13, 5, {
        frameBuffer: 6,
        startFrame: 52,
        endFrame: 55,
        scale_: 1.5,
        xoffset: 0,
        yoffset: 25,
        flipOffsetX: 26
    });

    bossSprite = loadImage("assets/sprites/Bringer-Of-Death/SpriteSheet/Bringer-of-Death-SpritSheet.png")

    bossAttackAnimation = new Animation(bossSprite, 1120, 744, 64, 8, 8, {
        frameBuffer: 4,
        startFrame: 16,
        endFrame: 26
    });
    bossDeathAnimation = new Animation(bossSprite, 1120, 744, 64, 8, 8, {frameBuffer: 4, startFrame: 29, endFrame: 39});
    bossWalkAnimation = new Animation(bossSprite, 1120, 744, 64, 8, 8, {frameBuffer: 4, startFrame: 8, endFrame: 16});
    bossIdleAnimation = new Animation(bossSprite, 1120, 744, 64, 8, 85, {frameBuffer: 4, startFrame: 0, endFrame: 8});
    bossHurtAnimation = new Animation(bossSprite, 1120, 744, 64, 8, 8, {frameBuffer: 4, startFrame: 26, endFrame: 29});


}

function setup() {
    initializeGame();
    restartButton = createButton('Go to main menu');
    restartButton.position(width / 2 - 50, height / 2 + 50);
    restartButton.mousePressed(restartGame);
    restartButton.hide();
    startButton = createButton('Start game');
    startButton.position(width / 2 - 50, height / 2 + 50);
    startButton.mousePressed(startGame);
    startButton.hide();
    // stop button
    stopSoundButton = createButton('Soundtrack on/off');
    stopSoundButton.position(5, 100);
    stopSoundButton.mousePressed(stopsound);
    stopSoundButton.hide();


}

function initializeGame() {
    debugMode = false;
    debugView = false;
    createCanvas(1024, 576);

    bgImageLogic1 = new Background(bgImage1);
    bgImageLogic2 = new Background(bgImage2);
    bgImageLogic3 = new Background(bgImage3);
    bgImageLogic4 = new Background(bgImage4);
    bgMountainsLogic1 = new Background(bgMountains1);
    bgMountainsLogic2 = new Background(bgMountains2);

    gameLifetime = 0;
    character = new Character(width / 2 - 96, height / 2);
    collectables = [new Collectable(width - 32, height - 64),
        new Collectable(width - 32, -128),
        new Collectable(width + 1024, height - 256),
        new Collectable(width + 6144 + 128, height - 256),
        new Collectable(width + 5128 + 256, -896),
        new Collectable(width + 5128 + 256 + 512, -896),]
    flag = new Flag(0, 192);

    var enemiesInputs = [[width / 2, height - 64, 64, 64, width / 3, width], [width + 256 * 8, height - 64],

        [width + 7168 - 256, -784],
        [width + 7168, -784],
        [width + 7168 + 256, -784]]
    enemies = [];
    for (var i = 0; i < enemiesInputs.length; i++) {
        enemies.push(new Enemy(...enemiesInputs[i]));
    }

    checkpoints = [new Checkpoint(width / 2, height, width, height, width / 2, height / 2),
        new Checkpoint(width + 384, height, 256, 1536, width + 384, height - 128),
        new Checkpoint(width + 256 * 16, height - 128 * 6 - 64, 256, 512, width + 256 * 16, height - 128 * 6 - 64),
        new Checkpoint(width + 256 * 16.5 + 192 + 64 * 9, height - 128 * 6 + 64 * 8, 256, 512, width + 256 * 16.5 + 192 + 64 * 9, height - 128 * 6 + 64 * 8),
        new Checkpoint(width + 256 * 16.5 + 192 + 64 * 9 + 1280, height - 128 * 6 + 64 * 9, 256, 512, width + 256 * 16.5 + 192 + 64 * 9 + 1280, height - 128 * 6 + 64 * 9),
        new Checkpoint(width + 256 * 16.5 + 192 + 64 * 9 + 2688, -768, 256, 512, width + 256 * 16.5 + 192 + 64 * 9 + 2688, -768)

    ];

    platformInputs = [[width / 2, height, width, 64],


        [-448, height + 192, 1024, height],
        [-1400, 200, 1024, height],
        [width - 32, height - 256, 64, height - 128],
        [width / 2, height / 2 + 64, 256, 64],
        [width / 4, height / 2 + 128, 256, 64],

        [width + 256 + 128, height, 256, 128],
        [width + 256 + 512 + 256, height, 1024, 64],
        [width + 4608 + 256 + 512 + 256, height - 192 + 2048, 1536, 2048],
        [width + 4608 + 256 + 512 + 256 + 1536, height - 192 + 2048, 1536, 2048 + 1152],
        [width + 8192, height - 192, 512, 2048],
        [width + 256 + 1280 + 64, height, 128, 128],
        [width + 6144 - 384, height - 128 - 800, 1280, 64],


        [width + 256 * 7, height - 128 * 0, 256, 64],
        [width + 256 * 8, height - 128 * 0, 256, 64],
        [width + 256 * 9, height - 128 * 1, 256, 64],
        [width + 256 * 10, height - 128 * 2, 256, 64],
        [width + 256 * 11, height - 128 * 3, 256, 64],
        [width + 256 * 12, height - 128 * 4, 256, 64],
        [width + 256 * 13, height - 128 * 5, 256, 64],
        [width + 256 * 14, height - 128 * 6, 256, 64],
        [width + 256 * 15.5, height - 128 * 6 - 64 + 2048, 512, 2048],
        [width + 256 * 16.5 + 32, height - 128 * 6 + 2048, 64, 2048],
        [width + 256 * 16.5 + 32 + 64 * 1, height - 128 * 6 + 2048 + 64 * 1, 64, 2048],
        [width + 256 * 16.5 + 32 + 64 * 2, height - 128 * 6 + 2048 + 64 * 2, 64, 2048],
        [width + 256 * 16.5 + 32 + 64 * 3, height - 128 * 6 + 2048 + 64 * 3, 64, 2048],
        [width + 256 * 16.5 + 32 + 64 * 4, height - 128 * 6 + 2048 + 64 * 4, 64, 2048],
        [width + 256 * 16.5 + 32 + 64 * 5, height - 128 * 6 + 2048 + 64 * 5, 64, 2048],
        [width + 256 * 16.5 + 32 + 64 * 6, height - 128 * 6 + 2048 + 64 * 6, 64, 2048],
        [width + 256 * 16.5 + 32 + 64 * 7, height - 128 * 6 + 2048 + 64 * 7, 64, 2048],
        [width + 256 * 16.5 + 32 + 64 * 8, height - 128 * 6 + 2048 + 64 * 8, 704, 2048],
        [width + 256 * 16.5 + 32 + 64 * 9, height - 128 * 6 + 2048 + 64 * 9, 512, 2048],

        [width + 256 * 17, height - 128 * 7.25, 256, 32],
        [width + 256 * 18, height - 128 * 8.25, 256, 32],
        [width + 256 * 19, height - 128 * 9.25, 256, 32],
        [width + 256 * 20, height - 128 * 10.25, 256, 32],
        [width + 256 * 22, height - 128 * 10.25, 256, 32],
        [width + 256 * 24, height - 128 * 10.25, 256, 32],


    ]
    platforms = [];
    spikes = [];
    for (var i = 0; i < 16; i++) {
        if ((Math.floor(i / 2) % 3) !== 2) {
            spikes.push(new Spikes(width + 32 + +256 + 256 + 64 * i, height - 64, 64, 64));
        } else {
            platforms.push(new Platform(width + 32 + +256 + 256 + 64 * i, height - 64, 64, 64));
        }

    }
    for (var i = 0; i < 16; i++) {
        spikes.push(new Spikes(width + 4608 + 32 + +256 + 256 + 64 * i, height - 64 - 128, 64, 64));
    }
    for (var i = 0; i < 20; i++) {
        spikes.push(new Spikes(width + 4608 + 32 + +256 + 256 + 64 * i, height - 64 - 128 - 800, 64, 64));
    }


    for (var i = 0; i < platformInputs.length; i++) {
        platforms.push(new Platform(...platformInputs[i]));
    }

    hud = new HUD(64, 128, 128, 128);

    upgradeable = new UpgradeCollectable(width + 7168 + 512, -784);

    // loop sound
    soundtrack.loop();
    soundtrack2.loop();
    // stop sound to prevent it from playing automatically
    soundtrack.stop();
    soundtrack2.stop();
}

function draw() {
    if (gameState === 0) {
        gameStateZeroUpdate();
    } else if (gameState === 1) {
        gameStateOneUpdate()
    } else if (gameState === 2) {
        gameStateTwoUpdate()
    } else if (gameState === 3) {
        gameStateThreeUpdate()
    }


}

function gameStateTwoUpdate() {
    soundtrack.stop();
    soundtrack2.stop();
    background(180, 40, 40);
    push();
    textAlign(CENTER);
    textSize(72);
    stroke(255);
    strokeWeight(2);
    text("GAME OVER", width / 2, height / 2);
    pop();
    restartButton.show();


}

function gameStateZeroUpdate() {
    background(127);
    stopSoundButton.hide();
    startButton.show();
    push();
    textAlign(CENTER);
    textSize(72);
    text("Jumpy bubbalah", width / 2, height / 2 - 100);
    pop();
    textAlign(CENTER);
    textSize(20);
    text('Get to the flag, collect all the tokens', width / 2, height / 2 - 50);
    text('Controls: Arrows - Move/direct attack, Z - Jump, X - Sword attack', width / 2, height / 2 - 25);
    text('You can attack in all directions and pogo off the spikes by attacking downwards', width / 2, height / 2);

}

function gameStateThreeUpdate() {
    stopSoundButton.hide();
    soundtrack.stop();
    soundtrack2.stop();
    background(40, 180, 40);
    push();
    textAlign(CENTER);
    textSize(72);
    stroke(255);
    strokeWeight(2);
    text("YOU WON!", width / 2, height / 2 - 100);
    pop();
    let collected = 0;
    for (var i = 0; i < collectables.length; i++) {
        collected += 1 - collectables[i].active;
    }
    textAlign(CENTER);
    stroke(255);
    strokeWeight(2);
    textSize(24);
    if (gameLifetime < bestLifetime) {
        bestLifetime = gameLifetime;
    }
    if (collected < collectables.length) {
        text('Good job, but there are still ' + (collectables.length - collected) + " collectables left. Try again and catch them all!", width / 2, height / 2 - 50)
    } else {
        text('Good job collecting all tokens, your best time is ' + bestLifetime.toFixed(2) + ' seconds. Can you do it faster?', width / 2, height / 2 - 50)
    }


    restartButton.show();
}

function playsound() {
    if (soundtrack.isPlaying() == false) {
        soundtrack.play();
        soundtrack2.play();
    }
}

function stopsound() {
    if (soundtrack.isPlaying() == true) {
        soundtrack.pause();
        soundtrack2.pause();
    } else {
        soundtrack.play();
        soundtrack2.play();
    }
}

function startGame() {
    restartButton.hide();
    startButton.hide();
    gameState = 1;
    initializeGame();
    playsound();
}

function restartGame() {
    restartButton.hide();
    gameState = 0;

}

function gameStateOneUpdate() {
    background(70);

    push();
    if (debugView) {
        scale(0.1, 0.1);
        translate(1000, 2000);
    }


    image(bgImage1, 0, 0, 1024, 576);

    push();
    translate(-cameraPosX * 0.02, 0);
    image(bgImage2, 0, 0, 1024, 576);
    pop();
    push();
    translate(-cameraPosX * 0.4, -cameraPosY * 0.03);
    bgImageLogic3.render(-cameraPosX * 0.4, -cameraPosY * 0.03);
    pop();
    push();
    translate(-cameraPosX * 0.45, -cameraPosY * 0.04);
    bgMountainsLogic2.render(-cameraPosX * 0.45, -cameraPosY * 0.04);
    pop();
    push();
    translate(-cameraPosX * 0.50, -cameraPosY * 0.045);
    bgMountainsLogic1.render(-cameraPosX * 0.5, -cameraPosY * 0.045);
    pop();
    push();
    translate(-cameraPosX * 0.6, -cameraPosY * 0.05);
    bgImageLogic4.render(-cameraPosX * 0.6, -cameraPosY * 0.05);
    pop();


    stopSoundButton.show();
    character.updatePosition(platforms);
    character.checkCheckpoints(checkpoints);
    character.checkCollectables(collectables);
    character.checkUpgradeable(upgradeable);
    character.checkFlag(flag);
    character.checkEnemies(enemies);
    character.checkSpikes(spikes);

    for (var i = 0; i < enemies.length; i++) {
        enemies[i].behavior(character);
        enemies[i].updatePosition(platforms);
    }
    character.status.isAttacking = false; // there's probably a more elegant way to do it
    character.status.isJumping = false;
    character.status.isHurt = false;
    for (var i = 0; i < enemies.length; i++) {
        enemies[i].status.isAttacking = false;
    }

    push()
    translate(-cameraPosX, -cameraPosY);
    cameraPosX = character.x - width / 2;
    cameraPosY = min(0, character.y - height / 2);
    for (var i = 0; i < platforms.length; i++) {
        platforms[i].render();
    }
    flag.render();

    for (var i = 0; i < enemies.length; i++) {
        enemies[i].render();
    }
    for (var i = 0; i < spikes.length; i++) {
        spikes[i].render();
    }
    for (var i = 0; i < checkpoints.length; i++) {
        checkpoints[i].render();
    }
    character.render();
    for (var i = 0; i < collectables.length; i++) {
        collectables[i].render();
    }
    upgradeable.render();


    textAlign(CENTER);
    textSize(24);
    fill(0);
    text("Find the double jump", width / 2, height / 2 + 40);
    pop();

    hud.render();
    gameLifetime += deltaTime / 1000;

    if (!character.alive) {
        gameState = 2;
    }
    pop();
}


function keyPressed() {
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


function keyReleased() {
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