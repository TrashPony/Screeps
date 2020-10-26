var container = {
    run: function(spawn) {
        
        var findStorage = spawn.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_STORAGE);
            }   
        }, 'dijkstra');
        
        if(findStorage) {
            const containers = spawn.room.find(FIND_STRUCTURES, {
                filter: { structureType: STRUCTURE_CONTAINER }
            });
            
            var findStorage = spawn.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_STORAGE);
                }   
            }, 'dijkstra');
            
            for(var i = 0; i < containers.length; i++) {
                if(_.sum(containers[i].store) > 1500 && findStorage) {
                    
                    var helperCreep = containers[i].pos.findClosestByRange(FIND_MY_CREEPS, {
                        filter: (creep) => (creep.memory.helpContainerid == containers[i].id && creep.memory.helpContainer == 1)
                    });
                    
                    if (!helperCreep) {
                        var worker = containers[i].pos.findClosestByRange(FIND_MY_CREEPS, {
                            filter: (creep) => (creep.memory.role == 'Worker' && !creep.spawning && (!creep.memory.helpTower || creep.memory.helpTower == 0) && (!creep.memory.helpContainer || creep.memory.helpContainer == 0))
                        });
                            
                            if(worker) {
                                worker.memory.helpContainer = 1;
                                worker.memory.helpContainerid = containers[i].id;
                            }
                        
                    } 
                }
            }   
        }
    }
};


module.exports = container;



/*

*/