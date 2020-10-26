var tech    = require('spawn.population.tech');

var creepUpgrade = {
    monitor: function(creep) {
        
        
        let destroyCreep = false;
        for (let name in Memory.creeps) {
            if(Memory.creeps[name].toDestroy) {
                destroyCreep = true;
                break;
            }
        }
        
        if(!destroyCreep){
            var avaibaleEnergy = creep.room.energyAvailable;
            var avilableBody = tech.available(creep.memory.role, avaibaleEnergy);
            
            if(avilableBody && avilableBody.length){
                if(avilableBody.length > creep.memory.tech) {
                    creep.memory.toDestroy = true;
                }   
            }
        }
    }
};

module.exports = creepUpgrade;