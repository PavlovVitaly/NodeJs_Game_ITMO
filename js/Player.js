class Player{
    constructor(id, spawnLocation, spriteName, game, phaser, server){
        this.id = id;
        this.spriteName = spriteName;
        this.game = game;
        this.phaser = phaser;
        this.server = server;
        this.weaponArr = [
            new Weapon(new BulletType('Saw', 100, 10, 1, 0, 0, this.phaser.Weapon.KILL_DISTANCE), 1, this.game, this.phaser),
            new Weapon(new BulletType('Bullet', 300, 200, 5, 500, 0, this.phaser.Weapon.KILL_DISTANCE), 500, this.game, this.phaser),
            new Weapon(new BulletType('Rocket', 300, 500, 20, 700, 0, this.phaser.Weapon.KILL_DISTANCE, 0, new Explosion('rocket_kaboom', this.game, this.phaser)), 100, this.game, this.phaser),
            new Weapon(new BulletType('Bomb', 150, 1000, 70, 300, 0, this.phaser.Weapon.KILL_DISTANCE, 90, new Explosion('bomb_kaboom', this.game, this.phaser)), 50, this.game, this.phaser),
            new Weapon(new BulletType('Plazma', 800, 1000, 50, 1500, 0, this.phaser.Weapon.KILL_DISTANCE, 90), 20, this.game, this.phaser),
            new Weapon(new BulletType('Flame-Thrower', 100, 20, 5, 200, 10, this.phaser.Weapon.KILL_DISTANCE, 0), 300, this.game, this.phaser)];
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

        this.player = this.game.add.sprite(spawnLocation.X, spawnLocation.Y, this.spriteName, 1);//48,48
        this.health = 100;
        this.numFrags = 0;
        this.numDeaths = 0;

        this.player.animations.add('left', [8,9], 10, true);
        this.player.animations.add('right', [1,2], 10, true);
        this.player.animations.add('up', [11,12,13], 10, true);
        this.player.animations.add('down', [4,5,6], 10, true);

        this.game.physics.enable(this.player, this.phaser.Physics.ARCADE);

        this.player.body.setSize(10, 14, 2, 1);

        //  Tell the Weapon to track the 'player' Sprite, offset by 14px horizontally, 0 vertically
        this.weapon.getBody().trackSprite(this.player, 9, 9);


        this.cursor = {
            left:false,
            right:false,
            up:false,
            down:false,
            fire:false,
            weapon1:false,
            weapon2:false,
            weapon3:false,
            weapon4:false,
            weapon5:false,
            weaponQ:false,
            x:0,
            y:0
        };

        this.input = {
            left:false,
            right:false,
            up:false,
            down:false,
            fire:false,
            weapon1:false,
            weapon2:false,
            weapon3:false,
            weapon4:false,
            weapon5:false,
            weaponQ:false,
            x:0,
            y:0
        };
    }

    update(){
        if(this.health <= 0 || !this.player.body) return;
        this.player.body.velocity.set(0);

        this.input.left = this.cursors.left.isDown;
        this.input.right = this.cursors.right.isDown;
        this.input.up = this.cursors.up.isDown;
        this.input.down = this.cursors.down.isDown;
        this.input.fire = this.fireButton.isDown;
        this.input.weapon1 = this.weaponSelector[1].isDown;
        this.input.weapon2 = this.weaponSelector[2].isDown;
        this.input.weapon3 = this.weaponSelector[3].isDown;
        this.input.weapon4 = this.weaponSelector[4].isDown;
        this.input.weapon5 = this.weaponSelector[5].isDown;
        this.input.weaponQ = this.weaponSelector[0].isDown;
        // this.player.input.fire = this.game.input.activePointer.isDown;
        // this.input.tx = this.game.input.x+ this.game.camera.x;
        // this.input.ty = this.game.input.y+ this.game.camera.y;

        var inputChanged = (
            this.cursor.left != this.input.left ||
            this.cursor.right != this.input.right ||
            this.cursor.up != this.input.up ||
            this.cursor.down != this.input.down ||
            this.cursor.fire != this.input.fire ||
            this.cursor.weapon1 != this.input.weapon1 ||
            this.cursor.weapon2 != this.input.weapon2 ||
            this.cursor.weapon3 != this.input.weapon3 ||
            this.cursor.weapon4 != this.input.weapon4 ||
            this.cursor.weapon5 != this.input.weapon5 ||
            this.cursor.weaponQ != this.input.weaponQ
        );
        if (inputChanged)
        {
            //Handle input change here
            //send new values to the server
            if (this.id === myId)
            {
                // send latest valid state to the server
                this.input.x = this.player.x;
                this.input.y = this.player.y;
                this.server.handleKeys(this.input);
            }
        }

        this.weaponArr.forEach(function(weapon, i, arr){
            weapon.updateBulletCounter();
        }, this);

        if (this.cursor.fire)
        {
            this.weapon.getBody().fire();
            this.weaponArr[0].reload();
        }

        if(this.cursor.weaponQ){
            this.numCurWeapon = 0;
            this.setWeapon(this.weaponArr[0], this.numCurWeapon);
        }
        else if(this.cursor.weapon1){
            this.numCurWeapon = 1;
            this.setWeapon(this.weaponArr[1], this.numCurWeapon);
        }
        else if(this.cursor.weapon2){
            this.numCurWeapon = 2;
            this.setWeapon(this.weaponArr[2], this.numCurWeapon);
        }
        else if(this.cursor.weapon3){
            this.numCurWeapon = 3;
            this.setWeapon(this.weaponArr[3], this.numCurWeapon);
        }
        else if(this.cursor.weapon4){
            this.numCurWeapon = 4;
            this.setWeapon(this.weaponArr[4], this.numCurWeapon);
        }
        else if(this.cursor.weapon5){
            this.numCurWeapon = 5;
            this.setWeapon(this.weaponArr[5], this.numCurWeapon);
        }

        if (this.cursor.left)
        {
            this.player.body.velocity.x = -100;
            this.weapon.getBody().fireAngle = this.phaser.ANGLE_LEFT;
            this.player.play('left');
            this.weapon.getBody().trackSprite(this.player,
                this.offsetWeaponSprite[this.numCurWeapon][3][0], this.offsetWeaponSprite[this.numCurWeapon][3][1]);
        }
        else if (this.cursor.right)
        {
            this.player.body.velocity.x = 100;
            this.weapon.getBody().fireAngle = this.phaser.ANGLE_RIGHT;
            this.player.play('right');
            this.weapon.getBody().trackSprite(this.player,
                this.offsetWeaponSprite[this.numCurWeapon][1][0], this.offsetWeaponSprite[this.numCurWeapon][1][1]);
        }
        else if (this.cursor.up)
        {
            this.player.body.velocity.y = -100;
            this.weapon.getBody().fireAngle = this.phaser.ANGLE_UP;
            this.player.play('up');
            this.weapon.getBody().trackSprite(this.player,
                this.offsetWeaponSprite[this.numCurWeapon][0][0], this.offsetWeaponSprite[this.numCurWeapon][0][1]);
        }
        else if (this.cursor.down)
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
            this.player.body.velocity.y = 0;
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
        let fireAngle = this.weapon.getBody().fireAngle;
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

    damage(shooter, damage, mainPlayerId){
        this.health = this.health - damage;
        if(this.health <= 0){
            this.kill();
            if(this.id === mainPlayerId) {
                this.server.updateKillRatio(shooter, this.id);
            }
        }
    }

    kill(){
        this.player.kill();
    }

    respawn(location){
        this.player.reset(location.X, location.Y)
        this.weapon = this.weaponArr[1];
        this.numCurWeapon = 1;
        this.weapon.getBody().trackSprite(this.player, 9, 9);

        this.weaponArr.forEach(function(weapon, ind, arr){
            weapon.reload();
        });

        this.cursor = {
            left:false,
            right:false,
            up:false,
            down:false,
            fire:false,
            weapon1:false,
            weapon2:false,
            weapon3:false,
            weapon4:false,
            weapon5:false,
            weaponQ:false,
            x:0,
            y:0
        };

        this.input = {
            left:false,
            right:false,
            up:false,
            down:false,
            fire:false,
            weapon1:false,
            weapon2:false,
            weapon3:false,
            weapon4:false,
            weapon5:false,
            weaponQ:false,
            x:0,
            y:0
        };

        this.health = 100;
    }
}