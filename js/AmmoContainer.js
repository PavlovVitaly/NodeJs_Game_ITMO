class AmmoContainer{
    constructor(ammoName, spriteName, location, game, phaser, health = 30){
        this.ammoName = ammoName;
        this.spriteName = spriteName;
        this.location = location;
        this.game = game;
        this.phaser = phaser;
        this.defaultHealth = health;
        this.health = health;
        this.container = this.game.add.sprite(location.X, location.Y, this.spriteName, 1);
        console.log('Container is created');
    }

    damage(shooter, damage){
        this.health -= damage;
        if(this.health <= 0){
            this.kill();
        }
    }

    kill(){
        this.container.kill();
    }

    respawn(location){
        this.container.reset(location.X, location.Y);
        this.health = this.defaultHealth;
    }
}