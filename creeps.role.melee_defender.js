/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('creeps.role.melee_defender');
 * mod.thing == 'a thing'; // true
 */
var attackModule    = require('attack.get_target');
var group           = require('attack.group');
var behavior        = require('attack.group.behavior');

module.exports = {
    melleDefenderRun: function(creep) {
        
        let creepGroup = group.distribution(creep);
        let toRoom;
        if (creepGroup) {
            toRoom = creepGroup.toRoom
        } else {
            toRoom = creep.memory.creepRoom
        }
        
        let shortHostiles = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 1);

        let myRangeCreeps = [];
        for (let name in Memory.creeps) {
            if (Memory.creeps[name].creepRoom === creep.room.name){
                let myRangeCreep = Game.creeps[name];
                if (myRangeCreep && attackModule.isRange(myRangeCreep)) {
                    myRangeCreeps.push(myRangeCreep)
                }
            }
        }
        
        if(shortHostiles.length > 0) {
                
            let target = attackModule.getCreepTraget(shortHostiles);
                
            creep.attack(target.creep);
                
            if (target.state.slow && myRangeCreeps.length > 0) {
                // отходим т.к. цель медленная и рядом есть свои дальние бойцы
                attackModule.back(creep, target.creep);
            }
        }
        
        behavior.GroupBehavior(creep, creepGroup);
    },
};