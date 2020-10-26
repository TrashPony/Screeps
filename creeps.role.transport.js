var findFirstResource   = require('creeps.find.energy');
var findFirstStructure  = require('creeps.find.structure');
var findDropRes         = require('creeps.find.drop.res');
var transferControl     = require('creeps.control.transfer');
var supportTower        = require('creeps.support.towers');
var supportContainer    = require('creeps.support.container');
var pourSpawn           = require('creeps.support.spawn');
var mineralTransfer     = require('creeps.role.transport.mineral.transfer');
var defendRoom          = require('spawn.defend');
var sayCreep            = require('creeps.say');

module.exports = {
    run: function(creep) {
        transferControl.run(creep);

        let {npc, users, lost} = defendRoom.RoomIsAttack(creep.room.name);
        if (npc || users) {
            defendWork(creep)
        } else {
            normalWork(creep)
        }
    }
};

function defendWork(creep) {
    if(supportTower.monitor(creep)){
        if(creep.carry.energy < creep.carryCapacity && creep.memory.controlTransfer) {
            findFirstResource.run(creep,'Container');
        } else {
            supportTower.action(creep);
        }
        return;
    } else {
        
        if (pourSpawn.monitor(creep)) {
            
            if(creep.carry.energy < creep.carryCapacity && creep.memory.controlTransfer) {
                findFirstResource.run(creep,'Container');
            } else {
                pourSpawn.action(creep);
            }
            
            return;
        }
        
        
        sayCreep.sendMsg(creep, '🚛', true)       
        findFirstStructure.run(creep,'Storage');
    }
}

function normalWork(creep) {
    if(creep.carry.energy < creep.carryCapacity && creep.memory.controlTransfer) {
            
        if(supportContainer.monitor(creep)) {
                
            if (_.sum(creep.carry) > 0) {
                supportContainer.toStorage(creep);
            } else {
                supportContainer.get(creep);
            }
                
        } else {
                
            if (findDropRes.run(creep)) {
                return;
            } else {
                findFirstResource.run(creep,'Container2k');
            }
                
        }
    }
        
    if(!creep.memory.controlTransfer) {
            
        if (creep.carry.energy == 0 && _.sum(creep.carry) != 0) {
            mineralTransfer.action(creep)
            return;
        }
            
        if(supportTower.monitor(creep)){
            supportTower.action(creep);
            return;
        } 
                    
        if(pourSpawn.monitor(creep)){
            pourSpawn.action(creep);
            return;
        }
                
        sayCreep.sendMsg(creep, '🚛', true)       
        findFirstStructure.run(creep,'Storage');
    }
}