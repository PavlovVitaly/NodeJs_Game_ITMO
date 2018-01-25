var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.CANVAS, 'gameDiv', { preload: preload, create: create, update: update, render: render });

function preload() {
    game.load.tilemap('map', 'assets/tilemaps/csv/catastrophi_level2.csv', null, Phaser.Tilemap.CSV);
    game.load.image('tiles', 'assets/tilemaps/tiles/catastrophi_tiles_16.png');
    game.load.spritesheet('player', 'assets/sprites/spaceman1.png', 16, 16);
    game.load.spritesheet('bot', 'assets/sprites/spaceman1.png', 16, 16);
    game.load.image('bomb', 'assets/sprites/bullet.png');
    game.load.image('rocket', 'assets/sprites/shmup-bullet.png');
    game.load.spritesheet('kaboom', 'assets/sprites/explosion.png', 64, 64, 23);
}

var map;
var layer;
var player;
var bot;
var explosions;

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
    //  This isn't totally accurate, but it'll do for now
    map.setCollisionBetween(54, 83);

    //  Un-comment this on to see the collision tiles
    // layer.debug = true;

    player = new Player('player', game, Phaser);
    bot = new Bot('bot', game, Phaser);

    explosions = game.add.group();
    for (var i = 0; i < 10; i++)
    {
        var explosionAnimation = explosions.create(0, 0, 'kaboom', [0], false);
        explosionAnimation.anchor.setTo(0.5, 0.5);
        explosionAnimation.animations.add('kaboom');
    }

    var help = game.add.text(16, 16, 'Arrows to move', { font: '14px Arial', fill: '#ffffff' });
    help.fixedToCamera = true;
}

function update() {

    game.physics.arcade.collide(player.getBody(), layer);
    game.physics.arcade.collide(bot.getBody(), layer);
    game.physics.arcade.collide(player.getWeapon().getBody(), layer);
    game.physics.arcade.collide(player.getBody(), bot.getBody());

    game.physics.arcade.overlap(player.getWeapon().getBody().bullets, bot.getBody(), hitBot(player.getWeapon(), bot));
    game.physics.arcade.collide(player.getWeapon().getBody().bullets, layer, hitWall);

    bot.update();
    player.update();

    game.world.wrap(player.getBody(), 16);
}

function render() {
     //game.debug.body(player);
}


//This is the function that is called when the bullet hits the bot
function hitBot(weapon, bot) {
    /* FUUUUUUUUUUUCK!!!!! >_< If you are checking Group vs. Sprite, when Sprite will always be the first parameter.
    * (http://phaser.io/docs/2.4.4/Phaser.Physics.Arcade.html#overlap) */
    return function (bott, bullet) {
        bot.damage(weapon.getDamageSize());
        // bulletHitEnemy (bullet);
        bullet.kill();
    };
}

function hitWall(bullet,wall) {
    // bulletHitEnemy (bullet);
    bullet.kill();
}

function bulletHitEnemy (bullet) {
    var explosionAnimation = explosions.getFirstExists(false);
    explosionAnimation.reset(bullet.x, bullet.y);
    explosionAnimation.play('kaboom', 30, false, true);
}