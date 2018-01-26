class Weapon{
    constructor(bullet, curGame, phaser){
        this.spriteName = bullet.getSprite();
        this.game = curGame;
        this.phaser = phaser;
        this.bullet = bullet;
        this.cursors = this.game.input.keyboard.createCursorKeys();
        //  Creates 1 single bullet, using the 'bullet' graphic
        this.weapon = this.game.plugins.add(this.phaser.Weapon);
        this.weapon.createBullets(1000, this.bullet.getSprite());
        // this.weapon.fireLimit = 3;//////////////////////////////////////////////////////////////////////////LOOK AT ME!!!
        // this.weapon.bulletKillDistance = 0;//////////////////////////////////////////////////////////////////////////LOOK AT ME!!!
        //  The bullet will be automatically killed when it leaves the world bounds
        this.weapon.bulletKillType = this.bullet.getKillType();
        this.weapon.fireRate = this.bullet.getFireRate();
        this.weapon.fireAngle = this.phaser.ANGLE_RIGHT;
        //  Add a variance to the bullet angle by +- this value
        this.weapon.bulletAngleVariance = this.bullet.getDispersion();
        // this.weapon.bulletCollideWorldBounds = true;
        //  Because our bullet is drawn facing up, we need to offset its rotation:
        this.weapon.bulletAngleOffset = this.bullet.getSpriteAngle();
        //  The speed at which the bullet is fired
        this.weapon.bulletSpeed = this.bullet.getSpeed();
        //  Tell the Weapon to track the 'player' Sprite, offset by 14px horizontally, 0 vertically
    }

    getBody(){
        return this.weapon;
    }

    getDamageSize(){
        return this.bullet.getDamage();
    }

    explodeBullet(bullet){
        this.bullet.explode(bullet);
    }
}
