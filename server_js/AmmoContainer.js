class AmmoContainer{
    constructor(ammoName, location, health = 30){
        this.ammoName = ammoName;
        this.location = location;
        this.health = health;
    }
};

function FillAmmoContainers(){
    let ammoContainers = [];
    ammoContainers.push(new AmmoContainer('Medicine', {X: Math.random()*2000, Y: Math.random()*1000}));
    ammoContainers.push(new AmmoContainer('Bullet', {X: Math.random()*2000, Y: Math.random()*1000}));
    ammoContainers.push(new AmmoContainer('Rocket', {X: Math.random()*2000, Y: Math.random()*1000}));
    ammoContainers.push(new AmmoContainer('Bomb', {X: Math.random()*2000, Y: Math.random()*1000}));
    ammoContainers.push(new AmmoContainer('Plasma', {X: Math.random()*2000, Y: Math.random()*1000}));
    ammoContainers.push(new AmmoContainer('Flame-Thrower', {X: Math.random()*2000, Y: Math.random()*1000}));
    return ammoContainers;
};

var ammoContainers = FillAmmoContainers();

module.exports = ammoContainers;
