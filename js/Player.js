class Player{
    constructor(curSpriteName, curGame, phaser){
        this.spriteName = curSpriteName;
        this.game = curGame;
        this.phaser = phaser;
        this.weaponArr = [null,
            new Weapon(new Bullet('rocket', 300, 300, 20), this.game, this.phaser),
            new Weapon(new Bullet('bomb', 200, 1000, 50), this.game, this.phaser)];
        this.weapon = this.weaponArr[1];

        this.cursors = this.game.input.keyboard.createCursorKeys();
        this.weaponSelector = [null,
            this.game.input.keyboard.addKey(this.phaser.Keyboard.ONE),
            this.game.input.keyboard.addKey(this.phaser.Keyboard.TWO),
            this.game.input.keyboard.addKey(this.phaser.Keyboard.THREE)];

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

        if(this.weaponSelector[1].isDown){
            this.setWeapon(this.weaponArr[1]);
        }
        if(this.weaponSelector[2].isDown){
            this.setWeapon(this.weaponArr[2]);
        }
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
        var fireAngle = this.weapon.getBody().fireAngle;
        this.weapon = weapon;
        this.weapon.getBody().trackSprite(this.player, 9, 9);
        this.weapon.getBody().fireAngle = fireAngle;
    }

    setDefaultWeapon(){
        this.weapon = new Weapon(new Bullet('bomb', 200, 1000, 50), this.game, this.phaser);
        this.weapon.getBody().trackSprite(this.player, 9, 9);
    }
}