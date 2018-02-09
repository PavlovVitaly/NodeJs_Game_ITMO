// import AmmoContainer from 'server_js/AmmoContainer.js';
var ammoContainers = require("./server_js/AmmoContainer.js");

var express = require('express'),
    app = express(app),
    server = require('http').createServer(app);


// serve static files from the current directory
app.use(express.static(__dirname));

//get EurecaServer class
var EurecaServer = require('eureca.io');

//create an instance of EurecaServer
var eurecaServer = new EurecaServer.Server({allow:[
    'setId',
    'spawnEnemy',
    'kill',
    'updateState',
    'makeDamage',
    'updatePlayersKD',
    'respawnPlayer',
    'spawnAmmoContainers',
    'takeAmmoContainer',
    'respawnAmmoContainer',
    'respawnExistAmmoContainers',
    'hitAmmoContainer'
]});

var clients = {};
//attach eureca.io to our http server
eurecaServer.attach(server);

//detect client connection
eurecaServer.onConnect(function (conn) {
    console.log('New Client id=%s ', conn.id, conn.remoteAddress);
    //the getClient method provide a proxy allowing us to call remote client functions
    var remote = eurecaServer.getClient(conn.id);

    //register the client
    clients[conn.id] = {id:conn.id, laststate: null, remote:remote, spawnLocation: {X: 0, Y: 0}}
    clients[conn.id].spawnLocation.X = Math.random()*2000;
    clients[conn.id].spawnLocation.Y = Math.random()*1000;
    //here we call setId (defined in the client side)
    remote.setId(conn.id, clients[conn.id].spawnLocation);
});

//detect client disconnection
eurecaServer.onDisconnect(function (conn) {
    console.log('Client disconnected ', conn.id);

    var removeId = clients[conn.id].id;

    delete clients[conn.id];

    for (var c in clients)
    {
        var remote = clients[c].remote;

        //here we call kill() method defined in the client side
        remote.kill(conn.id);
    }
});

eurecaServer.exports.handshake = function()
{
    for (var c in clients)
    {
        var remote = clients[c].remote;
        for (var cc in clients)
        {
            //send latest known position
            if(!clients[cc].laststate) {
                remote.spawnEnemy(clients[cc].id, clients[cc].spawnLocation.X, clients[cc].spawnLocation.Y);
            }else{
                remote.spawnEnemy(clients[cc].id, clients[cc].laststate.x, clients[cc].laststate.y);
            }
        }
    }
    var conn = this.connection;
    var updatedClient = clients[conn.id];
    updatedClient.remote.spawnAmmoContainers(ammoContainers);
};

eurecaServer.exports.handleKeys = function (keys) {
    var conn = this.connection;
    var updatedClient = clients[conn.id];
    for (var c in clients)
    {
        var remote = clients[c].remote;
        remote.updateState(updatedClient.id, keys);

        //keep last known state so we can send it to new connected clients
        clients[c].laststate = keys;
    }
};

eurecaServer.exports.damage = function(playerId, enemyId, damage)
{
    for (var c in clients)
    {
        var remote = clients[c].remote;
        remote.makeDamage(playerId, enemyId, damage);
    }
};

eurecaServer.exports.updateKillRatio = function(playerId, enemyId)
{
    var spawnLocation = {X: Math.random()*2000, Y: Math.random()*1000};
    for (var c in clients)
    {
        let remote = clients[c].remote;
        remote.updatePlayersKD(playerId, enemyId);
    }
    setTimeout(function(){
        console.log('Respawn Client id=%s ', c);
        for (var c in clients){
            var remote = clients[c].remote;
            remote.respawnPlayer(enemyId, spawnLocation);
        }
    }, 2000);
};

eurecaServer.exports.takeAmmo = function(playerId, containerId){
    for (var c in clients)
    {
        let remote = clients[c].remote;
        remote.takeAmmoContainer(playerId, containerId);
    }
};

eurecaServer.exports.hitAmmo = function(playerId, containerId, damage){
    ammoContainers[containerId].damage(damage);
    for (var c in clients)
    {
        let remote = clients[c].remote;
        remote.hitAmmoContainer(playerId, containerId, damage);
    }
};

eurecaServer.exports.respawnAmmoContainer = function(containerId){
    var spawnLocation = {X: Math.random()*2000, Y: Math.random()*1000};
    ammoContainers[containerId].setLocation(spawnLocation);
    ammoContainers[containerId].health = 0;
    setTimeout(function(){
        console.log('Respawn ammo container: ' + ammoContainers[containerId].getName());
        for (var c in clients)        {
            var remote = clients[c].remote;
            ammoContainers[containerId].setDefaultHealth();
            remote.respawnAmmoContainer(containerId, spawnLocation);
        }
    }, 30000);
};

setInterval(function(){
    ammoContainers.forEach(function(item, i, containers){
        if(containers[i].health > 0) {
            containers[i].setDefaultHealth();
            containers[i].setLocation({X: Math.random() * 2000, Y: Math.random() * 1000});
        }
    }, this);
    for (let c in clients){
        let remote = clients[c].remote;
        remote.respawnExistAmmoContainers(ammoContainers);
    }
    console.log('Respawn all ammo containers');
}, 60000);

server.listen(8000);
