'use strict';

var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.CANVAS, 'gameDiv', { preload: preload, create: create, update: update, render: render });

function preload() {
    game.load.tilemap('map', 'assets/tilemaps/csv/catastrophi_level2.csv', null, Phaser.Tilemap.CSV);
    game.load.image('tiles', 'assets/tilemaps/tiles/catastrophi_tiles_16.png');
    game.load.spritesheet('player', 'assets/sprites/spaceman1.png', 16, 16);
    game.load.spritesheet('bot', 'assets/sprites/spaceman1.png', 16, 16);
    game.load.image('bullet', 'assets/sprites/bullet.png');
}

class Player{
    constructor(curSpriteName, curGame, phaser){
        this.spriteName = curSpriteName;
        this.game = curGame;
        this.phaser = phaser;
        this.cursors = this.game.input.keyboard.createCursorKeys();
        this.player = this.game.add.sprite(48, 48, this.spriteName, 1);

        this.player.animations.add('left', [8,9], 10, true);
        this.player.animations.add('right', [1,2], 10, true);
        this.player.animations.add('up', [11,12,13], 10, true);
        this.player.animations.add('down', [4,5,6], 10, true);

        this.game.physics.enable(this.player, this.phaser.Physics.ARCADE);

        this.player.body.setSize(10, 14, 2, 1);

        this.game.camera.follow(this.player);
    }

    update(){
        this.player.body.velocity.set(0);

        if (this.cursors.left.isDown)
        {
            this.player.body.velocity.x = -100;
            this.player.play('left');
        }
        else if (this.cursors.right.isDown)
        {
            this.player.body.velocity.x = 100;
            this.player.play('right');
        }
        else if (this.cursors.up.isDown)
        {
            this.player.body.velocity.y = -100;
            this.player.play('up');
        }
        else if (this.cursors.down.isDown)
        {
            this.player.body.velocity.y = 100;
            this.player.play('down');
        }
        else
        {
            this.player.animations.stop();
        }
    }

    getBody(){
        return this.player;
    }
}

class Bot{
    constructor(curSpriteName, curGame, phaser){
        this.spriteName = curSpriteName;
        this.phaser = phaser;
        this.game = curGame;
        this.bot = this.game.add.sprite(300, 320, this.spriteName, 1);
        this.game.physics.enable(this.bot, this.phaser.Physics.ARCADE);
        this.bot.body.setSize(10, 14, 2, 1);
    }

    update(){
        this.bot.body.velocity.set(0);
    }

    getBody(){
        return this.bot;
    }
}

class Weapon{
    constructor(curSpriteName, curGame, phaser){
        this.spriteName = curSpriteName;
        this.game = curGame;
        this.phaser = phaser;
        this.cursors = this.game.input.keyboard.createCursorKeys();
        //  Creates 1 single bullet, using the 'bullet' graphic
        this.weapon = this.game.plugins.add(this.phaser.Weapon);
        this.weapon.createBullets(100, 'bullet');
        //  The bullet will be automatically killed when it leaves the world bounds
        this.weapon.bulletKillType = this.phaser.Weapon.KILL_WORLD_BOUNDS;
        // this.weapon.bulletCollideWorldBounds = true;
        //  Because our bullet is drawn facing up, we need to offset its rotation:
        this.weapon.bulletAngleOffset = -90;
        //  The speed at which the bullet is fired
        this.weapon.bulletSpeed = 400;
        //  Tell the Weapon to track the 'player' Sprite, offset by 14px horizontally, 0 vertically
        this.fireButton = this.game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
    }

    update(){
        if (this.fireButton.isDown)
        {
            this.weapon.fire();
        }
        if (this.cursors.left.isDown)
        {
            this.weapon.fireAngle = this.phaser.ANGLE_LEFT;
        }
        else if (this.cursors.right.isDown)
        {
            this.weapon.fireAngle = this.phaser.ANGLE_RIGHT;
        }
        else if (this.cursors.up.isDown)
        {
            this.weapon.fireAngle = this.phaser.ANGLE_UP;
        }
        else if (this.cursors.down.isDown)
        {
            this.weapon.fireAngle = this.phaser.ANGLE_DOWN;
        }
    }

    getBody(){
        return this.weapon;
    }
}

var map;
var layer;
// var cursors;
var player;
var bot;
var weapon;

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
    weapon = new Weapon('bullet', game, Phaser);

    //  Tell the Weapon to track the 'player' Sprite, offset by 14px horizontally, 0 vertically
    weapon.getBody().trackSprite(player.getBody(), 9, 9);

    var help = game.add.text(16, 16, 'Arrows to move', { font: '14px Arial', fill: '#ffffff' });
    help.fixedToCamera = true;
}

function update() {

    game.physics.arcade.collide(player.getBody(), layer);
    game.physics.arcade.collide(bot.getBody(), layer);
    game.physics.arcade.collide(weapon.getBody(), layer);
    game.physics.arcade.collide(player.getBody(), bot.getBody());

    game.physics.arcade.overlap(weapon.getBody().bullets, bot.getBody(), killBot);
    game.physics.arcade.collide(weapon.getBody().bullets, layer, hitWall);

    bot.update();
    player.update();
    weapon.update();

    game.world.wrap(player.getBody(), 16);
}

function render() {
     //game.debug.body(player);
}


//This is the function that is called when the bullet hits the meteor
function killBot(bullet,bot) {
    bot.kill();
    bullet.kill();
}

function hitWall(bullet,wall) {
    bullet.kill();
}
