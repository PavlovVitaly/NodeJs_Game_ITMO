var myId=0;
var playerList = {};
var idList = [];
var player;
var ready = false;
var eurecaServer;
//this function will handle client communication with the server
var eurecaClientSetup = function() {
    //create an instance of eureca.io client
    var eurecaClient = new Eureca.Client({ uri: 'http://192.168.7.101:8000/' });    // Change on your server ip.

    eurecaClient.ready(function (proxy) {
        eurecaServer = proxy;
    });

    //methods defined under "exports" namespace become available in the server side
    eurecaClient.exports.setId = function(id, playerLocation)
    {
        //create() is moved here to make sure nothing is created before uniq id assignation
        myId = id;
        idList.push(myId);
        create();
        player = new Player(myId, playerLocation, 'player', game, Phaser, eurecaServer);
        playerList[myId] = player;
        game.camera.follow(player.player);
        eurecaServer.handshake();
        ready = true;
    };

    eurecaClient.exports.kill = function(id)
    {
        if (playerList[id]) {
            playerList[id].kill();
            console.log('killing ', id, playerList[id]);
        }
    };

    eurecaClient.exports.spawnEnemy = function(i, x, y)
    {
        if (i === myId || playerList[i]) return; //this is me

        console.log('SPAWN');
        var player = new Player(i, {X: x, Y: y}, 'player', game, Phaser, eurecaServer);
        playerList[i] = player;
    };

    eurecaClient.exports.updateState = function(id, state)
    {
        if (playerList[id])  {
            playerList[id].cursor = state;
            playerList[id].player.x = state.x;
            playerList[id].player.y = state.y;
            playerList[id].update();
        }
    };

    eurecaClient.exports.makeDamage = function(playerId, enemyId, damage)
    {
        if (playerList[enemyId])  {
            playerList[enemyId].damage(playerId, damage);
        }
    };
};



var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.CANVAS, 'gameDiv', { preload: preload, create: eurecaClientSetup, update: update, render: render });

function preload() {
    game.load.tilemap('map', 'assets/tilemaps/csv/catastrophi_level2.csv', null, Phaser.Tilemap.CSV);
    game.load.image('tiles', 'assets/tilemaps/tiles/catastrophi_tiles_16.png');
    game.load.spritesheet('player', 'assets/sprites/spaceman.png', 16, 16);
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
    // player = new Player(myId, {X: Math.random()*100, Y: Math.random()*10}, 'player', game, Phaser, eurecaServer);
    // playerList[myId] = player;
    // game.camera.follow(player.player);
    // bot = new Bot('bot', game, Phaser);

    // help = game.add.text(16, 16, 'Arrows to move\nSpace to shoot\nHealth: ' + bot.health, { font: '14px Arial', fill: '#ffffff' }); // todo: change bot on player after debug.
    help = game.add.text(16, 16, 'Arrows to move\nSpace to shoot', { font: '14px Arial', fill: '#ffffff' }); // todo: change bot on player after debug.
    help.inputEnabled = true;
    help.fixedToCamera = true;
}

function update() {
    //do not update if client not ready
    if (!ready) return;
    help.text = 'Health: ' + player.getHealth() + '\nWeapon: ' + player.weapon.bullet.getSprite() +'\nBullets: ' + player.getCurNumBullets();    // todo: delete bot health after debug.

    // game.physics.arcade.collide(bot.getBody(), layer);
    // game.physics.arcade.collide(player.getBody(), bot.getBody());
    // bot.update();

    for (var i in playerList)
    {
        if (!playerList[i]) continue;
        game.physics.arcade.collide(playerList[i].getBody(), layer);
        game.physics.arcade.collide(playerList[i].getWeapon().getBody(), layer);
        // if(player !== playerList[i])
        //     game.physics.arcade.collide(player.getBody(), playerList[i].getBody());
        playerList[i].getWeapons().forEach(function(weapon, ind, arr){
            for(var j in playerList){
                if(!playerList[j] || j === i) continue;
                game.physics.arcade.overlap(weapon.getBody().bullets, playerList[j].getBody(), hitEnemy(playerList[i], playerList[j], weapon));
            }
            game.physics.arcade.collide(weapon.getBody().bullets, layer, hitWall(weapon));
        }, this);
        playerList[i].update();
    };
    game.world.wrap(player.getBody(), 16);
}

function render() {
     //game.debug.body(player);
}


//This is the function that is called when the bullet hits the bot
function hitEnemy(playerWhoShoot, enemy, weapon) {
    /* FUUUUUUUUUUUCK!!!!! >_< If you are checking Group vs. Sprite, when Sprite will always be the first parameter.
    * (http://phaser.io/docs/2.4.4/Phaser.Physics.Arcade.html#overlap) */
    return function (playerR, bullet) {
        if(player.id === enemy.id) {
            eurecaServer.damage(playerWhoShoot.id, enemy.id, weapon.getDamageSize());
        }
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
