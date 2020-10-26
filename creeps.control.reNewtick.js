var sayCreep    = require('creeps.say');

var reNewCreep = {
    
    monitor: function(creep) {
        
        if(creep.room.name !== creep.memory.creepRoom) {
            return false;
        }
        
        if (creep.ticksToLive < 200 || creep.memory.reNew == true) {
            creep.memory.reNew = true;
            if (creep.ticksToLive > 1300){
                creep.memory.reNew = false;
                return false;
            }
            
            sayCreep.sendMsg(creep, '⌛', true)
            return true;
        }
    },
    
    action: function(creep) {
        let spawn = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (structure) => {
                return ( structure.structureType == STRUCTURE_SPAWN );
            }   
        }, 'dijkstra');
        creep.moveTo(spawn);
    }
};

module.exports = reNewCreep;