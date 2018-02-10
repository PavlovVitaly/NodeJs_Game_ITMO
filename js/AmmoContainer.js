class AmmoContainer{
    constructor(ammoName, spriteName, location, numOfAmmo, game, phaser, health = 30){
        this.ammoName = ammoName;
        this.spriteName = spriteName;
        this.location = location;
        this.numOfAmmo = numOfAmmo;
        this.game = game;
        this.phaser = phaser;
        this.defaultHealth = health;
        this.health = health;
        this.container = this.game.add.sprite(location.X, location.Y, this.spriteName, 1);
        this.game.physics.enable(this.container, this.phaser.Physics.ARCADE);
    }

    getBody(){
        return this.container;
    }

    getAmmo(){
        return Math.round(this.numOfAmmo * (this.health / this.defaultHealth));
    }

    getName(){
        return this.ammoName;
    }

    getHealth(){
        return this.health;
    }

    getLocation(){
        return this.location();
    }

    damage(damage){
        this.health -= damage;
        if(this.health <= 0){
            this.kill();
        }
    }

    kill(){
        this.health = 0;
        this.container.kill();
    }

    respawn(location){
        this.location = location;
        this.health = this.defaultHealth;
        this.container.reset(location.X, location.Y);
    }
}