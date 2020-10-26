var findFirstResource   = require('creeps.find.energy');
var findFirstStructure  = require('creeps.find.structure');
var findDropRes         = require('creeps.find.drop.res');
var reNewCreep          = require('creeps.control.reNewtick');
var transferControl     = require('creeps.control.transfer');
var pourSpawn           = require('creeps.support.spawn');
var supportTower        = require('creeps.support.towers');
var supportContainer    = require('creeps.support.container');
var mineralTransfer     = require('creeps.role.transport.mineral.transfer');
var defendRoom          = require('spawn.defend');
var sayCreep            = require('creeps.say');
var structuresRepair    = require('structures.repair');

module.exports = {

    run: function(creep, creepRoom) {

        let {npc, users, lost} = defendRoom.RoomIsAttack(creepRoom);

        if(creep.room.name == creepRoom || (npc || users || lost)) { //npc, users, lost что бы строитель не пытался идти во время осады или в потеряный сектор
            
            transferControl.run(creep);
            
            if (npc || users) {
                defendWork(creep)
            } else {
                normalWork(creep)
            }

        } else {
            creep.moveTo(new RoomPosition(25, 25, creepRoom));
        }
    }
};

function defendWork(creep) {
    // ограниченая версия рабочего, приритет на турели
    if(supportTower.monitor(creep)){
        if(creep.carry.energy < creep.carryCapacity && creep.memory.controlTransfer) {
            findFirstResource.run(creep,'Container');
        } else {
            supportTower.action(creep);
        }
        return;
    } else {
        if(creep.carry.energy < creep.carryCapacity && creep.memory.controlTransfer) {
            findFirstResource.run(creep,'Container');
        } else {
            
            if(creep.room.controller.ticksToDowngrade < 1000){
                         
                if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller);
                }
                            
                return;
            }
        
            if(pourSpawn.monitor(creep)){
                pourSpawn.action(creep);
                return;
            }
            
            sayCreep.sendMsg(creep, '❄️', true)
        }
    }
    
    //let creepSpawn = Game.spawns[creep.memory.spawnName];
    //creep.moveTo();
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
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
                findFirstResource.run(creep,'All');
            }
        }
    }
            
    if(!creep.memory.controlTransfer) {
    
        if (creep.carry.energy == 0 && _.sum(creep.carry) != 0) {
                    
            mineralTransfer.action(creep);
                    
        } else {
                        
        if(creep.room.controller.ticksToDowngrade < 1000){
                            
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
                        
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
        
        if (structuresRepair.Repair(creep, 10)) {
            return;
        }
        
        var builderStructure = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(builderStructure[0]){
                sayCreep.sendMsg(creep, '⚒️️', true)
                if(creep.build(builderStructure[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(builderStructure[0]);
                }
            } else {
                sayCreep.sendMsg(creep, '💹️', true)
                if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller);
                }
            }
        }
    }
}


