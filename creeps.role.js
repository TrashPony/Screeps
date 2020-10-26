var roleHarvester       = require('creeps.role.harvester');
var roleTransport       = require('creeps.role.transport');
var roleWorker          = require('creeps.role.worker');
var roleCapture         = require('creeps.role.capture');
var roleRangeDefender   = require('creeps.role.range_defender');
var roleMeleeDefender   = require('creeps.role.melee_defender');
var roleHealDefender    = require('creeps.role.heal_defender');
var logisticTransport   = require('creeps.role.logistic_transport');

var role = {
     run: function (creep) {
        if (!creep.spawning) {
            
            // if (!creep.memory.role){
            //     creep.memory.role = 'heal_defender'
            // }
            
            // in room roles
            if(creep.memory.role === 'harvester'){
                roleHarvester.run(creep);
            }
                
            if(creep.memory.role === 'transport'){
                roleTransport.run(creep);
            }
            
            if (creep.memory.role === 'logistic_transport') {
                logisticTransport.logisticTransport(creep)
            }
                
            if(creep.memory.role === 'Worker'){
                roleWorker.run(creep, creep.memory.creepRoom);
            }
            
            if(creep.memory.role === 'range_defender'){
                roleRangeDefender.run(creep);
            }
            
            if(creep.memory.role === 'melee_defender'){
                roleMeleeDefender.melleDefenderRun(creep)
            }
            
            if(creep.memory.role === 'heal_defender'){
                roleHealDefender.healDefenderRun(creep)
            }
                
            // // out room roles
            // if(creep.memory.role == 'capture'){
            //     toRoom = 'W7S59';
            //     targetController = Game.getObjectById('59bbc48c2052a716c3ce81c4');
            //     roleCapture.run(creep,toRoom,targetController);
            // }
            
            if(creep.memory.role === 'remoteWorker'){
                creepRoom = 'W7S59';
                roleWorker.run(creep, creepRoom);
            }
        }
    }
};


module.exports = role;