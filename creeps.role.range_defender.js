/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('creeps.role. range_defender');
 * mod.thing == 'a thing'; // true
 */
var attackModule    = require('attack.get_target');
var group           = require('attack.group');
var behavior        = require('attack.group.behavior');

module.exports = {
    run: function(creep) {
        
        let creepGroup = group.distribution(creep);
        let toRoom;
        if (creepGroup) {
            toRoom = creepGroup.toRoom
        } else {
            toRoom = creep.memory.creepRoom
        }

        let hostiles = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 1);
        if(hostiles.length > 0) {
            
            if(creep.room.name === toRoom){
                if (creep.pos.getRangeTo(Game.creeps[creepGroup.leader]) > 4) {
                    // отрабатывает поведение группы
                } else {
                    checkBack(creep, hostiles);
                }
            }
            
            creep.rangedMassAttack();
        }
            
    
        hostiles = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 3);
        if(hostiles.length > 0) {
            // проверяем естли в range == 2 воины ближнего боя, если да то отступаем (дальний и хил игнорируем)
            // если воинов нет то наобород наступаем на врага
            
            if(creep.room.name === toRoom){
                if (creep.pos.getRangeTo(Game.creeps[creepGroup.leader]) > 4) {
                    // отрабатывает поведение группы
                } else {
                    checkBack(creep, hostiles);
                }
            }
            
            let target = attackModule.getCreepTraget(hostiles)
            creep.rangedAttack(target.creep);
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
        
        if (attackModule.isMelle(hostile) && (range < 2 || (range === 2 && hostile.fatigue == 0))) {
            attackModule.back(creep, hostile);
            return true
        }
    }
    
    return creepBack
}