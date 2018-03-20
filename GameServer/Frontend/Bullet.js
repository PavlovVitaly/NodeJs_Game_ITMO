export default class BulletType{
    constructor(Sprite, Speed, fireRate, damage, distance, dispersion, killType, spriteAngle = 0, explosion = null ){
        this.bulletSprite = Sprite;
        this.bulletSpeed = Speed;
        this.fireRate = fireRate;
        this.damage = damage;
        this.distance = distance;
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

    getDistance(){
        return this.distance;
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
