/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('attack.group.behavior');
 * mod.thing == 'a thing'; // true
 */
var attackModule    = require('attack.get_target');
var sayCreep        = require('creeps.say');
var defendRoom      = require('spawn.defend');
var towerAssist     = require('tower.assist');

const maxGroupRange = 3;
const squadRangeTower = 4;

module.exports = {
    GroupBehavior: function(creep, group) {
        
        if (!group) { // но такого быть недолжно
            let allHostiles = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 50);
            if(allHostiles.length > 0) {
                let target = attackModule.getCreepTraget(allHostiles);
                creep.moveTo(target.creep);
            }
            return;
        }
        
        if (controlBorder(creep)) {
            group.regroup = 0;
            sayCreep.sendMsg(creep, '🍆', true) 
            return;
        }
        
        if (group.action === "back_to_spawn") {
            sayCreep.sendMsg(creep, '💤', true) 

            let spawn = Game.spawns[creep.memory.spawnName];
            if (spawn) {
                creep.moveTo(spawn.pos);
            }
            return;
        }
        
        if (group.action === "") {
            if (group && group.leader !== creep.name){
                creep.moveTo(Game.creeps[group.leader])
            }
        }
        
        if (group.action === "regroup") {
            sayCreep.sendMsg(creep, '🧲', true) 
            
            if (group.regroup > 1 && group.leader === creep.name){
                let toCreep = getMaxRangeMember(group, Game.creeps[group.leader])
                if (toCreep.room.name === creep.room.name) {
                    creep.moveTo(toCreep)
                }
                
            } else {
                creep.moveTo(Game.creeps[group.leader])
            }
            return;
        }
        
        if (group.leader === creep.name && creep.room.name !== group.toRoom){
            creep.moveTo(new RoomPosition(25,25, group.toRoom));
            sayCreep.sendMsg(creep, '👁️', true) 
            return;
        }
        
        if (group.action === "attack") {
            sayCreep.sendMsg(creep, '⚔️', true) 
            if (group.leader === creep.name){
                
                let range = 2;
                if (attackModule.isMelle(creep)) range = 1;
                
                if (creep.pos.getRangeTo(group.toTarget) > range){
                    creep.moveTo(group.toTarget)
                }
            } else {
                
                if (attackModule.isHeal(creep)){
                    creep.moveTo(Game.creeps[group.leader])
                }
                
                if (attackModule.isMelle(creep)) {
                    let rangeToTarget = creep.pos.getRangeTo(group.toTarget)
                    if (rangeToTarget > 2){
                        creep.moveTo(Game.creeps[group.leader])
                    } else {
                        creep.moveTo(group.toTarget)
                    }
                }
                
                if (attackModule.isRange(creep)) {
                    let rangeToTarget = creep.pos.getRangeTo(group.toTarget)
                    if (rangeToTarget > 4){
                        creep.moveTo(Game.creeps[group.leader])
                    } else if (rangeToTarget > 2) {
                        creep.moveTo(group.toTarget)
                    }
                }
            }
            return;
        }
        
        if (group.action === "defend_tower") {
            sayCreep.sendMsg(creep, '🛡️', true) 

            if (group && group.leader === creep.name){
                creep.moveTo(new RoomPosition(group.toTarget.x, group.toTarget.y, group.toTarget.roomName))
            } else {
                creep.moveTo(Game.creeps[group.leader])
            }
            return;
        }
    },
    getGroupTarget: function(group, leader) {
        if (group.creeps.length === 0 || !leader) return;
        group.action = "";
        //group.toRoom = "W7S59";
        
        if (group.status === "pending") {
            group.action = "back_to_spawn";
            sayCreep.sendMsg(leader, '💤', true) 
            return;
        }
        
        // все должны быть в районе 10 клеток
        let allRangeLeader = leaderRange(group, leader);
        if (!allRangeLeader) {
            
            if (!group.regroup)group.regroup = 0;
            group.regroup++;
            
            group.action = "regroup";
            return;
        } else {
            group.regroup = 0;
        }
        
        let myTowers = getRoomMyTowers(leader);
        
        if (myTowers.length === 0) {
            group.towen_defense_id = null;
            // если остался только хиллер то все что он может сделать это убежать
            if (group.creeps.length === 1 && group.creeps[0].role === "heal") {
                group.toRoom = leader.memory.creepRoom;
                group.action = "back_to_spawn";
                return;
            }
            
            let allHostiles = leader.pos.findInRange(FIND_HOSTILE_CREEPS, 50);
            if (allHostiles.length > 0) {
                group.toTarget = attackModule.getCreepTraget(allHostiles).creep.pos;
                group.action = "attack";
                return;
            }
        } else {
            
            // group.towen_defense = {};
            // return;
            
            if (!group.towen_defense) {
                group.towen_defense = {};
            }
            
            // когда мы в нашем секторе с нашими турелями, то отряды патрулируют у турелей что бы всегда иметь поддержку
            let tower = Game.structures[group.towen_defense.id];
            if (!tower || !group.towen_defense.pos || tower.room.name !== group.toRoom) {
                tower = anchorGroupToTower(group, myTowers)
            }
            
            let {npc, users, lost} = defendRoom.RoomIsAttack(tower.room.name);
                
            if (npc || users) {
                let attackRange = 50;
                if (users) attackRange = 10;
            
                const hostiles = tower.pos.findInRange(FIND_HOSTILE_CREEPS, attackRange);
                if(hostiles.length > 0) {
                    group.action = "attack";
                    group.toTarget = attackModule.getCreepTraget(hostiles).creep.pos;
                    return;
                } else {
                    let targetID = towerAssist.getTargetID(tower.room.name);
                    if (targetID) {
                        let target = Game.getObjectById(targetID);
                        if (target) {
                            group.action = "attack";
                            group.toTarget = target.pos;
                            return;
                        }
                    }
                }
            }
            
            group.action = "defend_tower";
            group.toTarget = group.towen_defense.pos;
        }
    },
};

function leaderRange(group, leader) {
    for (let creepName of group.creeps) {
        
        let groupCreep = Game.creeps[creepName.name];

        if (creepName.name === leader.name|| !groupCreep || groupCreep.room.name !== leader.room.name) continue;
        
        if (groupCreep) {                
            if (groupCreep.pos.getRangeTo(leader) > maxGroupRange){
                return false
            }
        }
    }
    
    return true;
}

function getRoomMyTowers(leader) {
    
    let roomTowers = [];
    
    for(var towers in Game.structures){
        var tower = Game.structures[towers];
        if (tower.structureType === 'tower' && tower.room.name === leader.room.name){
            roomTowers.push(tower);
        }
    }
    
    return roomTowers;
}

function getMaxRangeMember(group, leader) {
    let maxRange = 0
    let maxRangeCreep = null;
    
    for (let creepName of group.creeps) {
        
        let groupCreep = Game.creeps[creepName.name];
        if (creepName.name === leader.name || !groupCreep || groupCreep.room.name !== leader.room.name){
            continue;
        }

        let range = groupCreep.pos.getRangeTo(leader);
        if (groupCreep && range > maxRange){
            maxRangeCreep = groupCreep;
            maxRange = range
        }
    }

    return maxRangeCreep;
}

function anchorGroupToTower(group, towers) {
    // смотрим у какой туреле еще нет патруля и закрепляемся за ней, если все турели заняты то рандомно прикрепляемся
    // TODO супер не оптимизированый метод
    for (let tower of towers) {
        
        let anchor = false;
        for (let spawnGroups in Memory.groups) {
            for (let spwnGroup of Memory.groups[spawnGroups]) {
                if (spwnGroup.towen_defense && spwnGroup.towen_defense.id === tower.id){
                    anchor = true;
                }
            }
        }
        
        if (!anchor) {
            group.towen_defense.id = tower.id;
            group.towen_defense.pos = getPatrolPosInTower(tower);
            return tower; 
        }
    }
    
    group.towen_defense.id = towers[0].id;
    group.towen_defense.pos = getPatrolPosInTower(towers[0]);
    return towers[0];
}

function getPatrolPosInTower(tower) {
    // между патрулем и башней должно быть 2 клетки что бы не загораживать доступ к пополнению, и не дальше 6
    
    let newPos = new RoomPosition(tower.pos.x + getRndInteger(squadRangeTower * -1 ,squadRangeTower), tower.pos.y + getRndInteger(squadRangeTower * -1 ,squadRangeTower), tower.room.name)
    while (tower.pos.getRangeTo(newPos) < 2 || newPos.x <= 0 || newPos.y <= 0 || newPos.x >= 50 || newPos.y >= 50) {
        newPos = new RoomPosition(tower.pos.x + getRndInteger(squadRangeTower * -1 ,squadRangeTower), tower.pos.y + getRndInteger(squadRangeTower * -1 ,squadRangeTower), tower.room.name)
    }
    
    return newPos
}

function controlBorder(creep) {
    if (creep.pos.x === 0){
        creep.moveTo(creep.pos.x+1, creep.pos.y)
        return true;
    }
        
    if (creep.pos.y === 0){
        creep.moveTo(creep.pos.x, creep.pos.y+1)
        return true;
    }
    
    if (creep.pos.x === 49){
        creep.moveTo(creep.pos.x-1, creep.pos.y)
        return true;
    }
        
    if (creep.pos.y === 49){
        creep.moveTo(creep.pos.x, creep.pos.y-1)
        return true;
    }
}

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1) ) + min;
}

