var sayCreep    = require('creeps.say');

var supportContainer = {
    monitor: function(creep) {
        
        if (Game.getObjectById(creep.memory.helpContainerid)) {
            
            if((!creep.memory.helpContainerid || _.sum(Game.getObjectById(creep.memory.helpContainerid).store) == 0) && _.sum(creep.carry) == 0){
                creep.memory.helpContainer = 0;
            }
            
            if(creep.memory.helpContainer == 1){
                sayCreep.sendMsg(creep, '📦', true)
                return true;
            } else {
                return false;
            }
            
        } else {
            creep.memory.helpContainerid = null;
        }
    },
    
    get: function(creep) {
        var container = Game.getObjectById(creep.memory.helpContainerid)
        var minerals = [RESOURCE_ENERGY, RESOURCE_HYDROGEN, RESOURCE_OXYGEN, RESOURCE_UTRIUM, RESOURCE_LEMERGIUM, RESOURCE_KEANIUM, RESOURCE_ZYNTHIUM, RESOURCE_CATALYST, RESOURCE_GHODIUM];
        
        for(var i = 0; i < minerals.length; i++) {
            var mineral = minerals[i];
            
            if (mineral in container.store) {
                if(container.store[mineral] > 0) {
                    if(creep.withdraw(container, mineral) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(container);
                    }
                }
            }
        }
    },
    
    toStorage: function(creep) {
        var findStorage = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (structure) => {
                //todo return((structure.structureType === STRUCTURE_CONTAINER || structure.structureType === STRUCTURE_STORAGE) && structure.store[RESOURCE_ENERGY] < structure.getCapacity());;
                 return(structure.structureType === STRUCTURE_STORAGE);
            }   
        }, 'dijkstra');
        
        var minerals = [RESOURCE_ENERGY, RESOURCE_HYDROGEN, RESOURCE_OXYGEN, RESOURCE_UTRIUM, RESOURCE_LEMERGIUM, RESOURCE_KEANIUM, RESOURCE_ZYNTHIUM, RESOURCE_CATALYST, RESOURCE_GHODIUM];
            
        for(var i = 0; i < minerals.length; i++) {
            var mineral = minerals[i];
            
            if (mineral in creep.carry) {
                if(creep.carry[mineral] > 0) {
                    if(creep.transfer(findStorage, mineral) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(findStorage);
                    }
                }
            }
        }
    }
};

module.exports = supportContainer;