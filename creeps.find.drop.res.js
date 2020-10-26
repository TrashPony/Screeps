var findDrop = {
    run: function(creep) {
        
        const minerals = [RESOURCE_ENERGY, RESOURCE_HYDROGEN, RESOURCE_OXYGEN, RESOURCE_UTRIUM, RESOURCE_LEMERGIUM, RESOURCE_KEANIUM, RESOURCE_ZYNTHIUM, RESOURCE_CATALYST, RESOURCE_GHODIUM];
        
        var tombStores = creep.pos.findClosestByRange(FIND_TOMBSTONES, {
            filter: (tomb) => (_.sum(tomb.store) > 0)
        });
        
        if(tombStores){
            for(var i = 0; i < minerals.length; i++) {
                var mineral = minerals[i];
                if (mineral in tombStores.store) {
                    if(tombStores.store[mineral] > 0) {
                        if(creep.withdraw(tombStores, mineral) === ERR_NOT_IN_RANGE) {
                            creep.moveTo(tombStores);
                            return true;
                        }
                    }
                }
            }
        }
        
        var dropedRes = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES, {
            filter: (res) => (res.energy > creep.carryCapacity)
        });
        
        if(dropedRes) {
            if(creep.pickup(dropedRes) == ERR_NOT_IN_RANGE) {
                creep.moveTo(dropedRes);
                return true;
            }
        }
        
        return false;
    }
};

module.exports = findDrop;