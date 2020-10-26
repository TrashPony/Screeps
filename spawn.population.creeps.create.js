var tech    = require('spawn.population.tech');

var createCreeps = {
    run: function (role, spawnName) { 
        
        var spawn = Game.spawns[spawnName];
       
        var avaibaleEnergy = spawn.room.energyAvailable;
        var creepId = (spawn.name + "-" + Game.time);
        
        var body = tech.available(role, avaibaleEnergy);
        if (body.length > 0){
            spawn.spawnCreep(body, creepId, {
                memory: { role: role, tech: body.length, creepRoom: spawn.room.name, iSay: 0, spawnName: spawnName}
            });
        }
    }
};

module.exports = createCreeps;