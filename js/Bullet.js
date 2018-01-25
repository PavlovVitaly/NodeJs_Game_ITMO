
class Bullet{
    constructor(Sprite, Speed, fireRate, damage){
        this.bulletSprite = Sprite;
        this.bulletSpeed = Speed;
        this.fireRate = fireRate;
        this.damage = damage;
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
}
