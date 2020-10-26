var sayCreep    = require('creeps.say');

var supportTower = {
    monitor: function(creep) {
        if(creep.memory.helpTower == 1){
            return true;
        } else {
            return false;
        }
    },
    
    action: function(creep) {
        
        sayCreep.sendMsg(creep, '🏹', true)
        
        let tower = Game.getObjectById(creep.memory.helpTowerid);
        if (!tower) {
            creep.memory.helpTower = 0;
            creep.memory.helpTowerid = null;
        }

        if(!creep.memory.helpTowerid || tower.energy > 850){
            creep.memory.helpTower = 0;
        } else {
            if(creep.transfer(tower, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(tower);
            } 
        }
    }
};

module.exports = supportTower;