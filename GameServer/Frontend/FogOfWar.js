export default class FogOfWarr{
    constructor(player, game, phaser){
        this.game = game;
        this.phaser = phaser;
        this.player = player;
        this.diametrOfFogCircle = 400;
        this.fogCircle = new this.phaser.Circle(800, 800, this.diametrOfFogCircle);
        this.fringe = 64;
        //  Create a new bitmap data the same size as our game
        this.bmd = this.game.make.bitmapData(window.innerWidth, window.innerHeight);
        this.update();
        this.fogSprite = this.bmd.addToWorld();
        this.fogSprite.fixedToCamera = true;
    }

    isInFog(x, y){
        let sqLength = Math.pow((x - this.fogCircle.x), 2) + Math.pow((y - this.fogCircle.y), 2);
        return sqLength > Math.pow(this.diametrOfFogCircle/2, 2);
    }



    update(){
        this.fogCircle.x = this.player.getBody().x;
        this.fogCircle.y = this.player.getBody().y;
        let gradient = this.bmd.context.createRadialGradient(
            this.fogCircle.x - this.game.camera.x,
            this.fogCircle.y - this.game.camera.y,
            this.fogCircle.radius,
            this.fogCircle.x - this.game.camera.x,
            this.fogCircle.y - this.game.camera.y,
            this.fogCircle.radius - this.fringe
        );

        gradient.addColorStop(0, 'rgba(0,0,0,0.8');
        gradient.addColorStop(0.4, 'rgba(0,0,0,0.5');
        gradient.addColorStop(1, 'rgba(0,0,0,0');

        this.bmd.clear();
        this.bmd.context.fillStyle = gradient;
        this.bmd.context.fillRect(0, 0, window.innerWidth, window.innerHeight);
    }
}