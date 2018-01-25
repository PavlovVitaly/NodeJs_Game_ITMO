class Player{
    constructor(spriteName, game, phaser){
        this.spriteName = spriteName;
        this.game = game;
        this.phaser = phaser;
        this.weaponArr = [null,
            new Weapon(new BulletType('saw', 100, 10, 1, this.phaser.Weapon.KILL_DISTANCE), this.game, this.phaser),
            new Weapon(new BulletType('rocket', 300, 500, 20, this.phaser.Weapon.KILL_WORLD_BOUNDS, 0, new Explosion('rocket_kaboom', this.game, this.phaser)), this.game, this.phaser),
            new Weapon(new BulletType('bomb', 150, 1000, 70, this.phaser.Weapon.KILL_WORLD_BOUNDS, 0, new Explosion('bomb_kaboom', this.game, this.phaser)), this.game, this.phaser),
            new Weapon(new BulletType('plazma', 800, 1000, 30, this.phaser.Weapon.KILL_WORLD_BOUNDS, 90), this.game, this.phaser)];
        this.weapon = this.weaponArr[1];

        this.cursors = this.game.input.keyboard.createCursorKeys();
        this.weaponSelector = [null,
            this.game.input.keyboard.addKey(this.phaser.Keyboard.ONE),
            this.game.input.keyboard.addKey(this.phaser.Keyboard.TWO),
            this.game.input.keyboard.addKey(this.phaser.Keyboard.THREE),
            this.game.input.keyboard.addKey(this.phaser.Keyboard.FOUR),
            this.game.input.keyboard.addKey(this.phaser.Keyboard.FIVE)
        ];
        this.fireButton = this.game.input.keyboard.addKey(this.phaser.KeyCode.SPACEBAR);

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

        if (this.fireButton.isDown)
        {
            this.weapon.getBody().fire();
        }

        if(this.weaponSelector[1].isDown){
            this.setWeapon(this.weaponArr[1]);
        }
        else if(this.weaponSelector[2].isDown){
            this.setWeapon(this.weaponArr[2]);
        }
        else if(this.weaponSelector[3].isDown){
            this.setWeapon(this.weaponArr[3]);
        }
        else if(this.weaponSelector[4].isDown){
            this.setWeapon(this.weaponArr[4]);
        }

        if (this.cursors.left.isDown)
        {
            this.player.body.velocity.x = -100;
            this.weapon.getBody().fireAngle = this.phaser.ANGLE_LEFT;
            this.player.play('left');
        }
        else if (this.cursors.right.isDown)
        {
            this.player.body.velocity.x = 100;
            this.weapon.getBody().fireAngle = this.phaser.ANGLE_RIGHT;
            this.player.play('right');
        }
        else if (this.cursors.up.isDown)
        {
            this.player.body.velocity.y = -100;
            this.weapon.getBody().fireAngle = this.phaser.ANGLE_UP;
            this.player.play('up');
        }
        else if (this.cursors.down.isDown)
        {
            this.player.body.velocity.y = 100;
            this.weapon.getBody().fireAngle = this.phaser.ANGLE_DOWN;
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

    getWeapons(){
        return this.weaponArr;
    }

    setWeapon(weapon){
        var fireAngle = this.weapon.getBody().fireAngle;
        this.weapon = weapon;
        this.weapon.getBody().trackSprite(this.player, 9, 9);
        this.weapon.getBody().fireAngle = fireAngle;
    }
}