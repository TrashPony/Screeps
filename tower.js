var attackModule     = require('attack.get_target');
var defendRoom       = require('spawn.defend');
var structuresRepair = require('structures.repair');
var towerAssist      = require('tower.assist');

var tower = {
    run: function() {
        for(var towers in Game.structures){
            
            var tower = Game.structures[towers];
            if (tower.structureType === 'tower'){
                
                if(tower.energy < 850) {
                    
                    let helperCreep = false;
                    
                    for (let name in Memory.creeps) {
                        if (Memory.creeps[name].helpTowerid == tower.id && Memory.creeps[name].helpTower == 1){
                            helperCreep = true;
                            break;
                        }
                    }
                    
                    if (!helperCreep) {
                        
                        for (let name in Game.creeps) {
                            let creep = Game.creeps[name];
                            
                            if (creep.room.name === tower.room.name && !creep.spawning && (creep.memory.role == 'transport' || creep.memory.role == 'Worker') &&
                                (!creep.memory.helpTower || creep.memory.helpTower == 0) && (!creep.memory.helpContainer || creep.memory.helpContainer == 0)) {
                                    
                                creep.memory.helpTower = 1;
                                creep.memory.helpTowerid = tower.id;
                                break;
                            }
                        }
                    }
                }
                
                let {npc, users, lost} = defendRoom.RoomIsAttack(tower.room.name);
                
                if (npc || users) {
                    
                    let attackRange = 50;
                    if (users) attackRange = 10;
                    
                    const hostiles = tower.pos.findInRange(FIND_HOSTILE_CREEPS, attackRange);
                    if(hostiles.length > 0) {
                        
                        let target = attackModule.getCreepTraget(hostiles).creep;
                        
                        tower.attack(target);
                        towerAssist.addTarget(tower, target.id);
                    } else {
                        towerAssist.removeTarget(tower);
                        let targetID = towerAssist.getTargetID(tower.room.name);
                        if (targetID) {
                            tower.attack(Game.getObjectById(targetID));
                        }
                    }
                    
                    continue;
                }
                
               
                if(tower.energy > 502) {
                    
                    for (let name in Game.creeps) {
                        if (Game.creeps[name].hits < Game.creeps[name].hitsMax){
                            tower.heal(Game.creeps[name])
                            continue;
                        }
                    }
                    
                    if (structuresRepair.Repair(tower, 100)) {
                        continue;
                    }
                }
            }
        }
    }
};


module.exports = tower;