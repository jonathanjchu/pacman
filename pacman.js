var loopTimer = 400;
var loop;

const mapping = {
    0: "empty",
    1: "coin",
    2: "brick",
    3: "cherry",
    4: "warp"
};

const direction = {
    UP: 0,
    DOWN: 1,
    LEFT: 2,
    RIGHT: 3
}

var world, pacman, ghosts;
var score = 0;

var isLifeResetLocked = false;
var path = [];

var config = {
    type: Phaser.AUTO,
    width: 1024,
    height: 660,
    physics: {
        default: "arcade",
        arcade: {
            gravity: {
                y: 0
            }
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

var enemies = [];
var pacman;
var keyMove;
var layer;
var dots;

function preload() {
    // this.load.image("pacman", "img/pacman.gif");
    this.load.spritesheet('pacman', 'img/pacman.png', { frameWidth: 30, frameHeight: 30 });

    this.load.image('pac_tiles', 'img/pac_world.png');

    this.load.image("dot", "img/coin.png");
    this.load.image("cherry", "img/cherry.png");
    this.load.image("clyde", "img/clyde.png");
    this.load.image("blinky", "img/blinky.png");
    this.load.image("inky", "img/inky.png");
    this.load.image("pinky", "img/pinky.png");
    this.load.image("death", "img/boom.gif");
}

function create() {


    world = [
        [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
        [2, 0, 1, 1, 1, 1, 1, 2, 1, 3, 1, 1, 1, 1, 1, 2, 1, 3, 1, 1, 1, 2, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
        [2, 1, 2, 2, 2, 2, 1, 1, 1, 2, 1, 2, 2, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 2, 1, 2, 2, 2, 2, 1, 2, 1, 2],
        [2, 1, 1, 1, 2, 2, 1, 2, 1, 2, 1, 1, 2, 1, 1, 2, 1, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 3, 1, 1, 2, 1, 2],
        [2, 1, 2, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 2, 2, 2, 2, 1, 2, 1, 2, 2, 1, 2],
        [2, 1, 2, 1, 1, 1, 2, 2, 2, 2, 1, 2, 2, 2, 2, 1, 2, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2],
        [2, 1, 1, 1, 2, 1, 1, 2, 3, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 2, 1, 2, 2, 2, 1, 2, 1, 2, 2, 2, 2],
        [2, 1, 2, 2, 2, 2, 1, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
        [2, 1, 3, 1, 1, 1, 1, 3, 1, 2, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 2, 2, 1, 2, 2, 3, 2, 2, 2, 2, 2, 3, 2],
        [2, 2, 2, 2, 1, 2, 1, 2, 1, 2, 2, 2, 1, 2, 2, 2, 3, 2, 2, 2, 0, 2, 2, 1, 2, 1, 1, 1, 2, 2, 1, 1, 1, 2],
        [2, 1, 3, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 2, 2, 1, 2, 3, 2, 0, 0, 2, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1, 2],
        [2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 1, 1, 1, 1, 1, 1, 2, 0, 0, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2],
        [2, 1, 1, 3, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 2],
        [2, 1, 2, 1, 1, 1, 2, 1, 2, 2, 1, 2, 1, 2, 2, 3, 1, 1, 2, 1, 1, 1, 3, 1, 2, 1, 2, 1, 2, 1, 1, 1, 1, 2],
        [2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 2, 2, 1, 3, 1, 2, 2, 1, 2, 2, 1, 2, 2, 2, 1, 2, 1, 2, 2],
        [2, 1, 2, 1, 2, 1, 2, 2, 1, 2, 2, 2, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 2, 3, 2, 2],
        [2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 2, 2, 1, 2, 2, 2, 2, 1, 1, 1, 2, 1, 2, 1, 2, 1, 1, 3, 1, 1, 2],
        [2, 1, 2, 1, 1, 1, 1, 3, 2, 2, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 2, 3, 1, 1, 2, 1, 2, 1, 2, 2, 2, 1, 2],
        [2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 1, 2, 2, 1, 2, 1, 2, 2, 1, 2, 1, 2, 2, 2, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2],
        [2, 1, 3, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 3, 2, 2, 1, 2, 2],
        [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2]
    ];

    const map = this.make.tilemap({
        data: world,
        tileWidth: 30,
        tileHeight: 30
    });
    const tiles = map.addTilesetImage('pac_tiles');
    layer = map.createStaticLayer(0, tiles, 0, 0);
    layer.setCollision(2);


    createPacman(this);

    dots = this.physics.add.group({
        key: 'dot'
    });

    enemies.push(
        this.add.sprite(400, 400, 'clyde')
    );
    enemies[0].scaleX = 0.1;
    enemies[0].scaleY = 0.1;

    keyMove = this.input.keyboard.createCursorKeys();
}

function update() {

    playerControls();
}

function createPacman(g) {
    pacman = g.physics.add.sprite(45, 45, 'pacman');
    pacman.scaleX = 0.9;
    pacman.scaleY = pacman.scaleX;

    g.physics.add.collider(pacman, layer);

    g.anims.create({
        key: 'pac_right',
        frames: g.anims.generateFrameNumbers('pacman', { start: 0, end: 5}),
        frameRate: 10,
        repeat: -1
    });
    g.anims.create({
        key: 'pac_left',
        frames: g.anims.generateFrameNumbers('pacman', { start: 6, end: 11}),
        frameRate: 10,
        repeat: -1
    });
    g.anims.create({
        key: 'pac_up',
        frames: g.anims.generateFrameNumbers('pacman', { start: 12, end: 17}),
        frameRate: 10,
        repeat: -1
    });
    g.anims.create({
        key: 'pac_down',
        frames: g.anims.generateFrameNumbers('pacman', { start: 18, end: 23}),
        frameRate: 10,
        repeat: -1
    });
}

function createGhosts(g) {
    
}

function playerControls() {
    var moveSpeed = 120;
    pacman.body.setVelocity(0);

    if (keyMove.left.isDown) {
        // pacman.x -= moveSpeed;
        pacman.body.setVelocityX(-1 * moveSpeed);
        pacman.anims.play('pac_left', true);
    }
    else if (keyMove.right.isDown) {
        // pacman.x += moveSpeed;
        pacman.body.setVelocityX(moveSpeed);
        pacman.anims.play('pac_right', true);
    }
    else if (keyMove.down.isDown) {
        // pacman.y += moveSpeed;
        pacman.body.setVelocityY(moveSpeed);
        pacman.anims.play('pac_down', true);
    }
    else if (keyMove.up.isDown) {
        // pacman.y -= moveSpeed;
        pacman.body.setVelocityY(-1 * moveSpeed);
        pacman.anims.play('pac_up', true);
    }
    else {
        pacman.anims.stop();
    }

    // playerControls.body.velocity.normalize()
}





















