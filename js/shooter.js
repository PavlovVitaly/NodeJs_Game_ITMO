var myId=0;
var playerList = [];
var player;
var ready = false;
var eurecaServer;
//this function will handle client communication with the server
var eurecaClientSetup = function() {
    //create an instance of eureca.io client
    var eurecaClient = new Eureca.Client();

    eurecaClient.ready(function (proxy) {
        eurecaServer = proxy;
    });

    //methods defined under "exports" namespace become available in the server side
    eurecaClient.exports.setId = function(id)
    {
        //create() is moved here to make sure nothing is created before uniq id assignation
        myId = id;
        create();
        eurecaServer.handshake();
        ready = true;
    }

    eurecaClient.exports.kill = function(id)
    {
        if (playerList[id]) {
            playerList[id].kill();
            console.log('killing ', id, playerList[id]);
        }
    }

    eurecaClient.exports.spawnEnemy = function(i, x, y)
    {
        if (i == myId) return; //this is me

        console.log('SPAWN');
        var player = new Player(i, 'player', game, Phaser);
        playerList[i] = player;
    }
};



var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.CANVAS, 'gameDiv', { preload: preload, create: eurecaClientSetup, update: update, render: render });

function preload() {
    game.load.tilemap('map', 'assets/tilemaps/csv/catastrophi_level2.csv', null, Phaser.Tilemap.CSV);
    game.load.image('tiles', 'assets/tilemaps/tiles/catastrophi_tiles_16.png');
    game.load.spritesheet('player', 'assets/sprites/spaceman1.png', 16, 16);
    game.load.spritesheet('bot', 'assets/sprites/spaceman1.png', 16, 16);
    game.load.image('Saw', 'assets/sprites/saw1.png');
    game.load.image('Bomb', 'assets/sprites/bullet.png');
    game.load.image('Bullet', 'assets/sprites/bubble.png');
    game.load.image('Rocket', 'assets/sprites/shmup-bullet.png');
    game.load.image('Plazma', 'assets/sprites/plazma.png');
    game.load.image('Flame-Thrower', 'assets/sprites/fire.png');
    game.load.spritesheet('rocket_kaboom', 'assets/sprites/explosion.png', 64, 64, 23);
    game.load.spritesheet('bomb_kaboom', 'assets/sprites/explode.png', 128, 128);
}

var map;
var layer;
var bot;
var help;

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
    player = new Player(myId, 'player', game, Phaser);
    playerList[myId] = player;
    bot = new Bot('bot', game, Phaser);

    help = game.add.text(16, 16, 'Arrows to move\nSpace to shoot\nHealth: ' + bot.health, { font: '14px Arial', fill: '#ffffff' }); // todo: change bot on player after debug.
    help.inputEnabled = true;
    help.fixedToCamera = true;
}

function update() {
    //do not update if client not ready
    if (!ready) return;
    help.text = 'Bot health: ' + bot.health + '\nHealth: ' + player.getHealth() + '\nWeapon: ' + player.weapon.bullet.getSprite() +'\nBullets: ' + player.getCurNumBullets();    // todo: delete bot health after debug.
    game.physics.arcade.collide(player.getBody(), layer);
    game.physics.arcade.collide(bot.getBody(), layer);
    game.physics.arcade.collide(player.getWeapon().getBody(), layer);
    game.physics.arcade.collide(player.getBody(), bot.getBody());


    player.getWeapons().forEach(function(weapon, i, arr){
        if(weapon === null) return;
        game.physics.arcade.overlap(weapon.getBody().bullets, bot.getBody(), hitBot(weapon, bot));
        game.physics.arcade.collide(weapon.getBody().bullets, layer, hitWall(weapon));
    }, this);

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
        weapon.explodeBullet(bullet);
        bullet.kill();
    };
}

function hitWall(weapon)
{
    return function (bullet, wall) {
        weapon.explodeBullet(bullet);
        bullet.kill();
    }
}