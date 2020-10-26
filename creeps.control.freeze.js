var sayCreep    = require('creeps.say');

var freezeController = {
    monitor: function(creep) {
        
        if(!creep.memory.freezeMonitor){
            creep.memory.freezeMonitor = {};
            creep.memory.freezeMonitor.control = false;
            return;
        }
        
        if (creep.fatigue == 0 && creep.memory._move) {
            if(creep.memory.freezeMonitor.control == false){
                creep.memory.freezeMonitor.x = creep.pos.x;
                creep.memory.freezeMonitor.y = creep.pos.y;
                creep.memory.freezeMonitor.time = Game.time;
                creep.memory.freezeMonitor.control = true;
                return false;
            } else {
                if((creep.memory.freezeMonitor.x == creep.pos.x && creep.memory.freezeMonitor.y == creep.pos.y) && creep.memory.freezeMonitor.time < Game.time) {
                    //console.log(1, creep.name)
                    return true;
                }
                
                if (creep.memory.freezeMonitor.x != creep.pos.x || creep.memory.freezeMonitor.y != creep.pos.y) {
                    //console.log(5, creep.name)
                    creep.memory.freezeMonitor.x = creep.pos.x;
                    creep.memory.freezeMonitor.y = creep.pos.y;
                    creep.memory.freezeMonitor.time = Game.time;
                    return false;
                }
            }
        } else {
            creep.memory.freezeMonitor.control = false;
            creep.memory.freezeMonitor.time = null;
            return false;
        }
    },
    
    action: function(creep) {
        // TODO когда пустой
        delete creep.memory.freezeMonitor;
        delete creep.memory._move;
        delete creep.memory.resultStructure;
        delete creep.memory.result;
        sayCreep.sendMsg(creep, '❄️', true)
        //delete creep.memory.controlTransfer
    }
};

module.exports = freezeController;