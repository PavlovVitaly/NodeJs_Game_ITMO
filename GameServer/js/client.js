var myId=0;
var playerList = {};
var ammoContainers = [];
var idList = [];
var player;
var ready = false;
var eurecaServer;
var fogOfWar;

//this function will handle client communication with the server
var eurecaClientSetup = function() {
    //create an instance of eureca.io client
    // var eurecaClient = new Eureca.Client({ uri: 'http://192.168.7.101:8000/' });    // Change on your server ip.
    var eurecaClient = new Eureca.Client({ uri: 'http://10.136.20.146:8000/' });    // Change on your server ip.

    eurecaClient.ready(function (proxy) {
        eurecaServer = proxy;
    });

    //methods defined under "exports" namespace become available in the server side
    eurecaClient.exports.setId = function(id, playerLocation)
    {
        //create() is moved here to make sure nothing is created before uniq id assignation
        myId = id;
        create();
        player = new Player(myId, playerLocation, 'player', game, Phaser, eurecaServer);
        playerList[myId] = player;
        game.camera.follow(player.player);
        fogOfWar = new FogOfWarr(player, game, Phaser);
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
            playerList[enemyId].damage(playerId, damage, player.id);
        }
    };

    eurecaClient.exports.updatePlayersKD = function(playerId, enemyId){
        playerList[playerId].numFrags++;
        playerList[enemyId].numDeaths++;
    };

    eurecaClient.exports.respawnPlayer = function(playerId, location){
        playerList[playerId].respawn(location);
        console.log('respawn: ' + playerId)
    };

    eurecaClient.exports.spawnAmmoContainers =  function(aContainers){
        aContainers.forEach(function(container, i, arr){
            if(container.health > 0){
                ammoContainers.push(new AmmoContainer(container.ammoName, container.ammoName + 'Container', container.location, container.numOfAmmo, game, Phaser, container.health));
            }
        }, this);
    };

    eurecaClient.exports.takeAmmoContainer = function(playerId, containerId){
        if(playerList[playerId].reloadAmmo(ammoContainers[containerId])){
            ammoContainers[containerId].kill();
            eurecaServer.respawnAmmoContainer(containerId);
        }
    };

    eurecaClient.exports.hitAmmoContainer = function(playerId, containerId, damage){
        ammoContainers[containerId].damage(damage);
        if(ammoContainers[containerId].getHealth() <= 0){
            eurecaServer.respawnAmmoContainer(containerId);
        }
    };

    eurecaClient.exports.respawnAmmoContainer = function(containerId, location){
        ammoContainers[containerId].respawn(location);
    };

    eurecaClient.exports.respawnExistAmmoContainers = function(aContainers){
        aContainers.forEach(function(container, i, arr){
            if(container.health > 0){
                ammoContainers[i].kill();
                ammoContainers[i].respawn(container.location);
            }
        }, this);
    };
};

var config = {
    type: Phaser.CANVAS,
    width: window.innerWidth - 15,
    height: window.innerHeight - 15,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};


var game = new Phaser.Game(config);     //'gameDiv'

function preload() {
    this.load.tilemap('map', 'assets/tilemaps/csv/catastrophi_level2.csv', null, Phaser.Tilemap.CSV);
    this.load.image('tiles', 'assets/tilemaps/tiles/catastrophi_tiles_16.png');

    this.load.spritesheet('player', 'assets/sprites/Players/spaceman.png', { frameWidth: 16, frameHeight: 16 });
    this.load.spritesheet('bot', 'assets/sprites/Players/spaceman1.png', { frameWidth: 16, frameHeight: 16 });

    this.load.image('Saw', 'assets/sprites/Bullets/saw1.png');
    this.load.image('Bomb', 'assets/sprites/Bullets/Bomb.png');
    this.load.image('Bullet', 'assets/sprites/Bullets/Bullet.png');
    this.load.image('Rocket', 'assets/sprites/Bullets/Rocket.png');
    this.load.image('Plasma', 'assets/sprites/Bullets/Plasma.png');
    this.load.image('Flame-Thrower', 'assets/sprites/Bullets/Flame-Thrower.png');

    this.load.spritesheet('rocket_kaboom', 'assets/sprites/Explosions/explosion.png', { frameWidth: 128, frameHeight: 128 }, 23);
    this.load.spritesheet('bomb_kaboom', 'assets/sprites/Explosions/explode.png', { frameWidth: 128, frameHeight: 128 });

    this.load.image('MedicineContainer', 'assets/sprites/AmmoContainers/MedicineContainer.png');
    this.load.image('BulletContainer', 'assets/sprites/AmmoContainers/BulletContainer.png');
    this.load.image('RocketContainer', 'assets/sprites/AmmoContainers/RocketContainer.png');
    this.load.image('BombContainer', 'assets/sprites/AmmoContainers/BombContainer.png');
    this.load.image('PlasmaContainer', 'assets/sprites/AmmoContainers/PlasmaContainer.png');
    this.load.image('Flame-ThrowerContainer', 'assets/sprites/AmmoContainers/Flame-ThrowerContainer.png');
}

var map;
var layer;
var bot;
var help;

function create() {
    this.physics.startSystem(Phaser.Physics.ARCADE);

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

    help = game.add.text(16, 16, 'Arrows to move\nSpace to shoot', { font: '14px Arial', fill: '#ffffff' });
    help.inputEnabled = true;
    help.fixedToCamera = true;
}

function update() {
    //do not update if client not ready
    if (!ready) return;
    fogOfWar.update();

    help.text = 'Health: ' + player.getHealth() +
        '\nFrags: ' + player.numFrags +
        '\nDeaths: ' + player.numDeaths +
        '\nWeapon: ' + player.weapon.bullet.getSprite() +
        '\nBullets: ' + player.getCurNumBullets();

    ammoContainers.forEach(function(container, i, containers){
        game.physics.arcade.overlap(player.getBody(), container.getBody(), touchAmmoContainer(player, i));
        if(container.getHealth() > 0) {
            containers[i].getBody().visible = !fogOfWar.isInFog(container.getBody().x, container.getBody().y);
        }
    }, this);

    for (let i in playerList)
    {
        if (!playerList[i]) continue;
        if(i !== player.id){
            playerList[i].getBody().visible = !fogOfWar.isInFog(playerList[i].getBody().x, playerList[i].getBody().y);
        }
        game.physics.arcade.collide(playerList[i].getBody(), layer);
        game.physics.arcade.collide(playerList[i].getWeapon().getBody(), layer);
        // if(player !== playerList[i])
        //     game.physics.arcade.collide(player.getBody(), playerList[i].getBody());

        playerList[i].getWeapons().forEach(function(weapon, ind, arr){
            for(let j in playerList){
                if(!playerList[j] || j === i) continue;
                game.physics.arcade.overlap(weapon.getBody().bullets, playerList[j].getBody(), hitEnemy(playerList[i], playerList[j], weapon));

                // if(fogOfWar.isInFog(weapon.getBody().bullets.x, weapon.getBody().bullets.y)){
                //     weapon.getBody().bullets.visible = false;
                // }
                // else{
                //     weapon.getBody().bullets.visible = true;
                // }

            }
            ammoContainers.forEach(function(container, ind, containers) {
                game.physics.arcade.overlap(weapon.getBody().bullets, container.getBody(), hitAmmoContainer( playerList[i], ind, weapon));
            }, this);
            game.physics.arcade.collide(weapon.getBody().bullets, layer, hitWall(weapon));
        }, this);

        playerList[i].update();
    }
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

function hitAmmoContainer(shooter, containerId, weapon){
    return function(containerBody, bullet){
        weapon.explodeBullet(bullet);
        bullet.kill();
        if(player.id === shooter.id) {
            eurecaServer.hitAmmo(player.id, containerId, weapon.getDamageSize());
        }
    }
}

function touchAmmoContainer(player, containerId){
    return function(playerBody, containerBody){
        eurecaServer.takeAmmo(player.id, containerId);
    }
}
