var express = require('express'),
    app = express(app),
    server = require('http').createServer(app);


// serve static files from the current directory
app.use(express.static(__dirname));

//get EurecaServer class
var EurecaServer = require('eureca.io');

//create an instance of EurecaServer
var eurecaServer = new EurecaServer.Server({allow:['setId', 'spawnEnemy', 'kill', 'updateState', 'makeDamage', 'updatePlayersKD', 'respawn']});
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
    clients[conn.id].spawnLocation.X = Math.random()*1000;
    clients[conn.id].spawnLocation.Y = Math.random()*800;
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
    var spawnLocation = {X: Math.random()*1000, Y: Math.random()*800};
    for (var c in clients)
    {
        let remote = clients[c].remote;
        remote.updatePlayersKD(playerId, enemyId);
    }
    setTimeout(function(){
        for (var c in clients)
        {
            console.log("respawn");
            var remote = clients[c].remote;
            remote.respawn(enemyId, spawnLocation);
        }
    }, 2000);
};

server.listen(8000);
