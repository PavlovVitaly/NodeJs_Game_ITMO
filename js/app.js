'use strict';

var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.CANVAS, 'gameDiv', { preload: preload, create: create, update: update, render: render });

function preload() {
    game.load.tilemap('map', 'assets/tilemaps/csv/catastrophi_level2.csv', null, Phaser.Tilemap.CSV);
    game.load.image('tiles', 'assets/tilemaps/tiles/catastrophi_tiles_16.png');
    game.load.spritesheet('player', 'assets/sprites/spaceman1.png', 16, 16);
    game.load.spritesheet('bot', 'assets/sprites/spaceman1.png', 16, 16);
    game.load.image('bomb', 'assets/sprites/bullet.png');
    game.load.image('shmup-bullet', 'assets/sprites/shmup-bullet.png');
    game.load.spritesheet('kaboom', 'assets/sprites/explosion.png', 64, 64, 23);
}

class Player{
    constructor(curSpriteName, curGame, phaser){
        this.spriteName = curSpriteName;
        this.game = curGame;
        this.phaser = phaser;
        this.weapon = new Weapon(new Bullet('bomb', 200, 1000, 50), this.game, this.phaser);
        this.cursors = this.game.input.keyboard.createCursorKeys();
        this.player = this.game.add.sprite(48, 48, this.spriteName, 1);
        this.health = 100;

        this.player.animations.add('left', [8,9], 10, true);
        this.player.animations.add('right', [1,2], 10, true);
        this.player.animations.add('up', [11,12,13], 10, true);
        this.player.animations.add('down', [4,5,6], 10, true);

        this.game.physics.enable(this.player, this.phaser.Physics.ARCADE);

        this.player.body.setSize(10, 14, 2, 1);

        this.game.camera.follow(this.player);

        //  Tell the Weapon to track the 'player' Sprite, offset by 14px horizontally, 0 vertically
        this.weapon.getBody().trackSprite(this.player, 9, 9);
    }

    update(){
        this.player.body.velocity.set(0);
        this.weapon.update();

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

    getWeapon(){
        return this.weapon;
    }

    setWeapon(weapon){
        this.weapon = weapon;
        this.weapon.getBody().trackSprite(this.player, 9, 9);
    }

    setDefaultWeapon(){
        this.weapon = new Weapon(new Bullet('bomb', 200, 1000, 50), this.game, this.phaser);
        this.weapon.getBody().trackSprite(this.player, 9, 9);
    }
}

class Bot{
    constructor(curSpriteName, curGame, phaser){
        this.spriteName = curSpriteName;
        this.phaser = phaser;
        this.game = curGame;
        this.health = 100;
        this.bot = this.game.add.sprite(48, 100, this.spriteName, 1);
        this.game.physics.enable(this.bot, this.phaser.Physics.ARCADE);
        this.bot.body.setSize(10, 14, 2, 1);
    }

    update(){
        this.bot.body.velocity.set(0);
    }

    getBody(){
        return this.bot;
    }

    damage(damage){
        this.health = this.health - damage;
        if(this.health <= 0){
            this.bot.kill();
        }
    }

}

class Weapon{
    constructor(bullet, curGame, phaser){
        this.spriteName = bullet.getSprite();
        this.game = curGame;
        this.phaser = phaser;
        this.bullet = bullet;
        this.cursors = this.game.input.keyboard.createCursorKeys();
        //  Creates 1 single bullet, using the 'bullet' graphic
        this.weapon = this.game.plugins.add(this.phaser.Weapon);
        this.weapon.createBullets(100, this.bullet.getSprite());
        //  The bullet will be automatically killed when it leaves the world bounds
        this.weapon.bulletKillType = this.phaser.Weapon.KILL_WORLD_BOUNDS;
        this.weapon.fireRate = this.bullet.getFireRate();
        // this.weapon.bulletCollideWorldBounds = true;
        //  Because our bullet is drawn facing up, we need to offset its rotation:
        this.weapon.bulletAngleOffset = 0;
        //  The speed at which the bullet is fired
        this.weapon.bulletSpeed = this.bullet.getSpeed();
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

    getDamageSize(){
        return this.bullet.getDamage();
    }
}

class Bullet{
    constructor(Sprite, Speed, fireRate, damage){
        this.bulletSprite = Sprite;
        this.bulletSpeed = Speed;
        this.fireRate = fireRate;
        this.damage = damage;
    }

    getSprite(){
        return this.bulletSprite;
    }

    getSpeed(){
        return this.bulletSpeed;
    }

    getFireRate(){
        return this.fireRate;
    }

    getDamage(){
        return this.damage;
    }
}

var map;
var layer;
// var cursors;
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
        bulletHitEnemy (bullet);
        bullet.kill();
    };
}

function hitWall(bullet,wall) {
    bulletHitEnemy (bullet);
    bullet.kill();
}

function bulletHitEnemy (bullet) {
    var explosionAnimation = explosions.getFirstExists(false);
    explosionAnimation.reset(bullet.x, bullet.y);
    explosionAnimation.play('kaboom', 30, false, true);
}