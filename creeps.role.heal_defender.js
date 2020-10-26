/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('creeps.role.heal_defender');
 * mod.thing == 'a thing'; // true
 */
 
var attackModule    = require('attack.get_target');
var group           = require('attack.group');
var behavior        = require('attack.group.behavior');

module.exports = {
    healDefenderRun: function(creep){
        
        let creepGroup = group.distribution(creep);
        let toRoom;
        if (creepGroup) {
            toRoom = creepGroup.toRoom
        } else {
            toRoom = creep.memory.creepRoom
        }
        
        let doHeal = false;
        
        // хил на 1 клетку если рядом есть раненый свой
        let myShortCreeps = creep.pos.findInRange(FIND_MY_CREEPS, 1);
        if(myShortCreeps.length > 1) {
            let healTarget = getHealTarget(creep, myShortCreeps);
            if (healTarget) {
                creep.heal(healTarget);
                doHeal = true;
            }
        } 
        
        if (!doHeal) {
            if (creep.hits < creep.hitsMax) {
                creep.heal(creep)
            } else {
                // хил на 3 клетки если рядом есть раненый свой
                let myCreeps = creep.pos.findInRange(FIND_MY_CREEPS, 3);
                if(myCreeps.length > 1) {
                    let healTarget = getHealTarget(creep, myCreeps);
                    if (healTarget) {
                        creep.rangedHeal(healTarget);
                    }
                }
            }
        }
        
        let backRange = 2;
        if(myShortCreeps.length > 1) backRange = 1;
        
        // если рядом нет союзников то отступаем на 2 клетки, если есть союзники то на 1
        let hostiles = creep.pos.findInRange(FIND_HOSTILE_CREEPS, backRange);
        if(hostiles.length > 0) {
            if(creep.room.name == toRoom){
                if (creep.pos.getRangeTo(Game.creeps[creepGroup.leader]) > 4) {
                    console.log('OLOLO')
                    // отрабатывает поведение группы
                } else {
                    checkBack(creep, hostiles);
                }
            }
            return;
        }
        
        behavior.GroupBehavior(creep, creepGroup);
    }
};

function checkBack(creep, hostiles) {
    let creepBack = false

    for (let hostile of hostiles) {
        
        let range = creep.pos.getRangeTo(hostile)
        
        if (range == 2 && hostile.fatigue > 0){
            creepBack = true;
            continue;
        }
        
        if ((attackModule.isMelle(hostile) || attackModule.isRange(hostile)) && (range < 2 || (range === 2 && hostile.fatigue == 0))) {
            attackModule.back(creep, hostile);
            return true
        }
    }
    
    return creepBack
}

function getHealTarget(creep, myCreeps) {
    for (let myCreep of myCreeps) {
        if ((attackModule.isMelle(myCreep) || attackModule.isRange(myCreep)) && myCreep.hits < myCreep.hitsMax) {
            return myCreep
        }
    }
    
    for (let myCreep of myCreeps) {
        if (myCreep.hits < myCreep.hitsMax) {
            return myCreep
        }
    }
}