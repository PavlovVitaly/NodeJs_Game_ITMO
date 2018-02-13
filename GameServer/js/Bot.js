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