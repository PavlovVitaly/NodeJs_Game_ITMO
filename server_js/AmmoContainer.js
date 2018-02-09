class AmmoContainer{
    constructor(ammoName, location, numOfAmmo, health = 30){
        this.ammoName = ammoName;
        this.location = location;
        this.numOfAmmo = numOfAmmo;
        this.health = health;
    }

    setLocation(location){
        this.location = location;
    }
};

function FillAmmoContainers(){
    let ammoContainers = [];
    ammoContainers.push(new AmmoContainer('Medicine', {X: Math.random()*2000, Y: Math.random()*1000}, 100));
    ammoContainers.push(new AmmoContainer('Bullet', {X: Math.random()*2000, Y: Math.random()*1000}, 20));
    ammoContainers.push(new AmmoContainer('Rocket', {X: Math.random()*2000, Y: Math.random()*1000}, 10));
    ammoContainers.push(new AmmoContainer('Bomb', {X: Math.random()*2000, Y: Math.random()*1000}, 5));
    ammoContainers.push(new AmmoContainer('Plasma', {X: Math.random()*2000, Y: Math.random()*1000}, 5));
    ammoContainers.push(new AmmoContainer('Flame-Thrower', {X: Math.random()*2000, Y: Math.random()*1000}, 30));
    return ammoContainers;
};

var ammoContainers = FillAmmoContainers();

module.exports = ammoContainers;
