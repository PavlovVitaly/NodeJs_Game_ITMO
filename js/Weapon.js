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
        this.weapon.fireAngle = this.phaser.ANGLE_RIGHT
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
