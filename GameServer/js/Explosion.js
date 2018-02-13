class Explosion {
    constructor(spriteName, game, phaser) {
        this.spriteName = spriteName;
        this.game = game;
        this.phaser = phaser;
        this.explosion = game.add.group();
        this.explosion.createMultiple(30, this.spriteName);

        this.explosion.forEach(function(invader) {
            invader.anchor.x = 0.5;
            invader.anchor.y = 0.5;
            invader.animations.add(this.spriteName);
        }, this);
    }

    explode(bullet) {
        var explosion = this.explosion.getFirstExists(false);
        explosion.reset(bullet.x, bullet.y);
        explosion.play(this.spriteName, 30, false, true);
    }


}