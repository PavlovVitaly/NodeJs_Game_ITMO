class Player{
    constructor(spriteName, game, phaser){
        this.spriteName = spriteName;
        this.game = game;
        this.phaser = phaser;
        this.weaponArr = [
            new Weapon(new BulletType('saw', 100, 10, 1, 0, 0, this.phaser.Weapon.KILL_DISTANCE), 1000000000000, this.game, this.phaser),
            new Weapon(new BulletType('bullet', 300, 200, 5, 500, 0, this.phaser.Weapon.KILL_DISTANCE), 500, this.game, this.phaser),
            new Weapon(new BulletType('rocket', 300, 500, 20, 700, 0, this.phaser.Weapon.KILL_DISTANCE, 0, new Explosion('rocket_kaboom', this.game, this.phaser)), 100, this.game, this.phaser),
            new Weapon(new BulletType('bomb', 150, 1000, 70, 300, 0, this.phaser.Weapon.KILL_DISTANCE, 90, new Explosion('bomb_kaboom', this.game, this.phaser)), 50, this.game, this.phaser),
            new Weapon(new BulletType('plazma', 800, 1000, 50, 1500, 0, this.phaser.Weapon.KILL_DISTANCE, 90), 20, this.game, this.phaser),
            new Weapon(new BulletType('flame_thrower', 100, 20, 5, 200, 10, this.phaser.Weapon.KILL_DISTANCE, 0), 300, this.game, this.phaser)];
        this.weapon = this.weaponArr[1];
        this.numCurWeapon = 1;
        this.offsetWeaponSprite = [
            [[9, 9], [9, 9], [9, 9], [9, 9]],
            [[9, 9], [9, 9], [9, 9], [9, 9]],
            [[9, 9], [9, 9], [9, 9], [9, 9]],
            [[9, 9], [9, 9], [9, 9], [9, 9]],
            [[9, -15], [38, 9], [9, 40], [-20, 9]],
            [[9, -15], [38, 9], [9, 40], [-20, 9]]];

        this.cursors = this.game.input.keyboard.createCursorKeys();
        this.weaponSelector = [
            this.game.input.keyboard.addKey(this.phaser.Keyboard.Q),
            this.game.input.keyboard.addKey(this.phaser.Keyboard.ONE),
            this.game.input.keyboard.addKey(this.phaser.Keyboard.TWO),
            this.game.input.keyboard.addKey(this.phaser.Keyboard.THREE),
            this.game.input.keyboard.addKey(this.phaser.Keyboard.FOUR),
            this.game.input.keyboard.addKey(this.phaser.Keyboard.FIVE),
            this.game.input.keyboard.addKey(this.phaser.Keyboard.SIX)
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

        this.weaponArr.forEach(function(weapon, i, arr){
            weapon.updateBulletCounter();
        }, this);

        if (this.fireButton.isDown)
        {
            this.weapon.getBody().fire();
        }

        if(this.weaponSelector[0].isDown){
            // this.weapon.getBody().resetShots(10);//////////////////////////////////////////////////////////////////////////LOOK AT ME!!!
            this.numCurWeapon = 0;
            this.setWeapon(this.weaponArr[0], this.numCurWeapon);
        }
        else if(this.weaponSelector[1].isDown){
            this.numCurWeapon = 1;
            this.setWeapon(this.weaponArr[1], this.numCurWeapon);
        }
        else if(this.weaponSelector[2].isDown){
            this.numCurWeapon = 2;
            this.setWeapon(this.weaponArr[2], this.numCurWeapon);
        }
        else if(this.weaponSelector[3].isDown){
            this.numCurWeapon = 3;
            this.setWeapon(this.weaponArr[3], this.numCurWeapon);
        }
        else if(this.weaponSelector[4].isDown){
            this.numCurWeapon = 4;
            this.setWeapon(this.weaponArr[4], this.numCurWeapon);
        }
        else if(this.weaponSelector[5].isDown){
            this.numCurWeapon = 5;
            this.setWeapon(this.weaponArr[5], this.numCurWeapon);
        }

        if (this.cursors.left.isDown)
        {
            this.player.body.velocity.x = -100;
            this.weapon.getBody().fireAngle = this.phaser.ANGLE_LEFT;
            this.player.play('left');
            this.weapon.getBody().trackSprite(this.player,
                this.offsetWeaponSprite[this.numCurWeapon][3][0], this.offsetWeaponSprite[this.numCurWeapon][3][1]);
        }
        else if (this.cursors.right.isDown)
        {
            this.player.body.velocity.x = 100;
            this.weapon.getBody().fireAngle = this.phaser.ANGLE_RIGHT;
            this.player.play('right');
            this.weapon.getBody().trackSprite(this.player,
                this.offsetWeaponSprite[this.numCurWeapon][1][0], this.offsetWeaponSprite[this.numCurWeapon][1][1]);
        }
        else if (this.cursors.up.isDown)
        {
            this.player.body.velocity.y = -100;
            this.weapon.getBody().fireAngle = this.phaser.ANGLE_UP;
            this.player.play('up');
            this.weapon.getBody().trackSprite(this.player,
                this.offsetWeaponSprite[this.numCurWeapon][0][0], this.offsetWeaponSprite[this.numCurWeapon][0][1]);
        }
        else if (this.cursors.down.isDown)
        {
            this.player.body.velocity.y = 100;
            this.weapon.getBody().fireAngle = this.phaser.ANGLE_DOWN;
            this.player.play('down');
            this.weapon.getBody().trackSprite(this.player,
                this.offsetWeaponSprite[this.numCurWeapon][2][0], this.offsetWeaponSprite[this.numCurWeapon][2][1]);
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

    setWeapon(weapon, nextNumOfWeapon){
        var fireAngle = this.weapon.getBody().fireAngle;
        this.weapon = weapon;
        this.weapon.getBody().fireAngle = fireAngle;
        this.weapon.getBody().trackSprite(this.player, 9, 9);
        switch(fireAngle){
            case this.phaser.ANGLE_LEFT:
                this.weapon.getBody().trackSprite(this.player,
                    this.offsetWeaponSprite[nextNumOfWeapon][3][0], this.offsetWeaponSprite[this.numCurWeapon][3][1]);
                break;
            case this.phaser.ANGLE_RIGHT:
                this.weapon.getBody().trackSprite(this.player,
                    this.offsetWeaponSprite[nextNumOfWeapon][1][0], this.offsetWeaponSprite[this.numCurWeapon][1][1]);
                break;
            case this.phaser.ANGLE_UP:
                this.weapon.getBody().trackSprite(this.player,
                    this.offsetWeaponSprite[nextNumOfWeapon][0][0], this.offsetWeaponSprite[this.numCurWeapon][0][1]);
                break;
            case this.phaser.ANGLE_DOWN:
                this.weapon.getBody().trackSprite(this.player,
                    this.offsetWeaponSprite[nextNumOfWeapon][2][0], this.offsetWeaponSprite[this.numCurWeapon][2][1]);
                break;
        }
    }

    getHealth(){
        return this.health;
    }

    getCurNumBullets(){
        return this.weapon.getNumBullets();
    }

    reloadWeapon(){

    }
}