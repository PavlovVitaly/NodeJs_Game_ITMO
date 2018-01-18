
var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.CANVAS, 'gameDiv', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.tilemap('map', 'assets/tilemaps/csv/catastrophi_level2.csv', null, Phaser.Tilemap.CSV);
    game.load.image('tiles', 'assets/tilemaps/tiles/catastrophi_tiles_16.png');
    game.load.spritesheet('player', 'assets/sprites/spaceman1.png', 16, 16);
    game.load.spritesheet('bot', 'assets/sprites/spaceman1.png', 16, 16);

}

var bmd;
var fringe;
var fogCircle;

var map;
var layer;
var cursors;
var player;
var bot;

function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //  Because we're loading CSV map data we have to specify the tile size here or we can't render it
    map = game.add.tilemap('map', 16, 16);

    //  Now add in the tileset
    map.addTilesetImage('tiles');

    //  Create our layer
    layer = map.createLayer(0);

    //  Resize the world
    layer.resizeWorld();

    // //  This isn't totally accurate, but it'll do for now
    map.setCollisionBetween(54, 83);

    //  Un-comment this on to see the collision tiles
    // layer.debug = true;

    //  Player
    player = game.add.sprite(48, 48, 'player', 1);
    player.animations.add('left', [8,9], 10, true);
    player.animations.add('right', [1,2], 10, true);
    player.animations.add('up', [11,12,13], 10, true);
    player.animations.add('down', [4,5,6], 10, true);

    game.physics.enable(player, Phaser.Physics.ARCADE);

    player.body.setSize(10, 14, 2, 1);

    game.camera.follow(player);

    cursors = game.input.keyboard.createCursorKeys();

    var help = game.add.text(16, 16, 'Arrows to move', { font: '14px Arial', fill: '#ffffff' });
    help.fixedToCamera = true;

    bot = game.add.sprite(300, 300, 'bot', 1);
    game.physics.enable(bot, Phaser.Physics.ARCADE);
    bot.body.setSize(10, 14, 2, 1);


    fogCircle = new Phaser.Circle(800, 800, 800);
    fringe = 64;
    //  Create a new bitmap data the same size as our game
    bmd = game.make.bitmapData(800, 600);
    updateFogOfWar();
    var fogSprite = bmd.addToWorld();
    fogSprite.fixedToCamera = true;
    var tween = game.add.tween(player).to({ x: 2000, y: 800 }, 15000, "Linear", true, 0, -1, true);
    tween.onLoop.add(function (sprite, tween) {sprite.scale.x *= -1}, 0, this);
}

function update() {

    // game.physics.arcade.collide(player, layer);

    fogCircle.x = player.x;
    fogCircle.y = player.y;

    game.physics.arcade.collide(player, bot);

    player.body.velocity.set(0);
    bot.body.velocity.set(0);

    if (cursors.left.isDown)
    {
        player.body.velocity.x = -100;
        player.play('left');
    }
    else if (cursors.right.isDown)
    {
        player.body.velocity.x = 100;
        player.play('right');
    }
    else if (cursors.up.isDown)
    {
        player.body.velocity.y = -100;
        player.play('up');
    }
    else if (cursors.down.isDown)
    {
        player.body.velocity.y = 100;
        player.play('down');
    }
    else
    {
        player.animations.stop();
    }

    updateFogOfWar();
}

function render() {

     //game.debug.body(player);

}

function updateFogOfWar ()
{
    var gradient = bmd.context.createRadialGradient(
        fogCircle.x - game.camera.x,
        fogCircle.y - game.camera.y,
        fogCircle.radius,
        fogCircle.x - game.camera.x,
        fogCircle.y - game.camera.y,
        fogCircle.radius - fringe
    );

    gradient.addColorStop(0, 'rgba(0,0,0,0.8');
    gradient.addColorStop(0.4, 'rgba(0,0,0,0.5');
    gradient.addColorStop(1, 'rgba(0,0,0,0');

    bmd.clear();
    bmd.context.fillStyle = gradient;
    bmd.context.fillRect(0, 0, 800, 600);
}