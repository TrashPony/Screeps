var mineralTransfer = {
    action: function(creep) {
        var findStorage = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_STORAGE);
            }   
        }, 'dijkstra');
        
        var minerals = [RESOURCE_ENERGY, RESOURCE_HYDROGEN, RESOURCE_OXYGEN, RESOURCE_UTRIUM, RESOURCE_LEMERGIUM, RESOURCE_KEANIUM, RESOURCE_ZYNTHIUM, RESOURCE_CATALYST, RESOURCE_GHODIUM,
        RESOURCE_HYDROXIDE, RESOURCE_ZYNTHIUM_KEANITE, RESOURCE_UTRIUM_LEMERGITE, RESOURCE_UTRIUM_HYDRIDE, RESOURCE_UTRIUM_OXIDE, RESOURCE_KEANIUM_HYDRIDE, RESOURCE_KEANIUM_OXIDE, 
        RESOURCE_LEMERGIUM_HYDRIDE, RESOURCE_LEMERGIUM_OXIDE, RESOURCE_ZYNTHIUM_HYDRIDE, RESOURCE_ZYNTHIUM_OXIDE, RESOURCE_GHODIUM_HYDRIDE, RESOURCE_GHODIUM_OXIDE];
            
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

module.exports = mineralTransfer;