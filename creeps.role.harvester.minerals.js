var mineralBaseTransfer = {
    monitor: function(creep) {   
        var minerals = [RESOURCE_HYDROGEN, RESOURCE_OXYGEN, RESOURCE_UTRIUM, RESOURCE_LEMERGIUM, RESOURCE_KEANIUM, RESOURCE_ZYNTHIUM, RESOURCE_CATALYST, RESOURCE_GHODIUM];
        
        for(var i = 0; i < minerals.length; i++) {
            
            var mineral = minerals[i];
            
            if (mineral in creep.carry) {
                if(creep.carry[mineral] > 0) {
                    return mineral;
                }
            }
        }
        return false;
    },
    
    action: function(creep, mineral) {
        var findStorage = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE)
            }
        });
        
        if(creep.transfer(findStorage, mineral) === ERR_NOT_IN_RANGE) {
            creep.moveTo(findStorage);
        }
    }
};

module.exports = mineralBaseTransfer;