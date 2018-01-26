
class BulletType{
    constructor(Sprite, Speed, fireRate, damage, dispersion, killType, spriteAngle = 0, explosion = null ){
        this.bulletSprite = Sprite;
        this.bulletSpeed = Speed;
        this.fireRate = fireRate;
        this.damage = damage;
        this.dispersion = dispersion;
        this.spriteAngle = spriteAngle;
        this.explosion = explosion;
        this.killType = killType;
    }

    getSprite(){
        return this.bulletSprite;
    }

    getSpeed(){
        return this.bulletSpeed;
    }

    getFireRate(){
        return this.fireRate;
    }

    getDamage(){
        return this.damage;
    }

    getDispersion(){
        return this.dispersion;
    }

    getSpriteAngle(){
        return this.spriteAngle;
    }

    getKillType(){
        return this.killType;
    }

    explode(bullet){
        if(this.explosion === null) return;
        this.explosion.explode(bullet);
    }
}
