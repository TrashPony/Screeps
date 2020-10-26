var role              = require('creeps.role');
var freezeControl     = require('creeps.control.freeze');
var reNewCreep        = require('creeps.control.reNewtick');
var upgradeCreep      = require('creeps.control.upgrade');
var defendRoom        = require('spawn.defend');

var creepsManager = {
     run: function () {
        for(var name in Game.creeps){
            
            let creep = Game.creeps[name];
            
            if (!creep.memory.id) {
                creep.memory.id = creep.id;
            }
            
            if (!creep.memory.name) {
                creep.memory.name = name;
            }
            
            if (!creep.memory.creepRoom) {
                creep.memory.creepRoom = creep.room.name;
            }
            
            if (freezeControl.monitor(creep)) {
                freezeControl.action(creep);
            }
            
            // TODO не регенерировать боевых нпс
            let {npc, users, lost} = defendRoom.RoomIsAttack(creep.room.name);
            if (creep.memory.creepRoom === creep.room.name && !npc && !users && !lost && !creep.memory.group) {
                upgradeCreep.monitor(creep);
            
                if(creep.memory.toDestroy) {
                    let spawn = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return ( structure.structureType == STRUCTURE_SPAWN );
                        }   
                    }, 'dijkstra');
                    creep.moveTo(spawn);
                    continue;
                }
                
                var reNew = reNewCreep.monitor(creep);
                if (reNew) {
                    reNewCreep.action(creep);
                    continue;
                }
            }
            
            role.run(creep);
        }
    } 
};


module.exports = creepsManager;