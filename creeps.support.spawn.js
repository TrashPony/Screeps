var findFirstStructure  = require('creeps.find.structure');
var sayCreep    = require('creeps.say');

var pourSpawn = {
    monitor: function(creep) {
        var avaibaleEnergy = Game.rooms[creep.room.name].energyAvailable;
        var totalEnergy = Game.rooms[creep.room.name].energyCapacityAvailable;
        
        if(totalEnergy > avaibaleEnergy){
            return true;
        } else {
            return false;
        }
    },
    
    action: function(creep) {
        sayCreep.sendMsg(creep, '⛲', true)
        findFirstStructure.run(creep,'Spawn');
    }
};

module.exports = pourSpawn;