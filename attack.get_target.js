/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('attack.get_target');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    getCreepTraget: function(hostiles) {
        
        let targets = {};
        let maxHealPart = 0;
        
        if (!hostiles || hostiles.length === 0) return;
        
        for (let i in hostiles) {
            
            let creep = hostiles[i];
            
            targets[creep.id] = {id: creep.id, healPartCount: 0, movePartCount: 0, rangePartCount: 0, slow: false, fatigue: creep.fatigue, allFatiguePartCount: 0, hits: creep.hits, hitsMax: creep.hitsMax, index: i};

            for (let bodyPart of creep.body) {
                
                if (bodyPart.type !== MOVE){
                    targets[creep.id].allFatiguePartCount++
                }
                
                if (bodyPart.hits === 0) continue;
                
                if (bodyPart.type === HEAL) {
                    targets[creep.id].healPartCount++
                }
                
                if (bodyPart.type === MOVE) {
                    targets[creep.id].movePartCount++
                }
                
                if (bodyPart.type === RANGED_ATTACK) {
                    targets[creep.id].rangePartCount++
                }
            }
            
            if (targets[creep.id].healPartCount > maxHealPart) {
                maxHealPart = targets[creep.id].healPartCount;
            }
        }
        
        // выбираем цель с максимальной разницей хп между макс и мин, это гарантирует что все будут стрелять в 1го крипа
        let diffHP = 0;
        let target = null;
        
        // если во вражеском отряде есть хиллеры то это основная цель для атаки
        if (maxHealPart > 0) {        
            for (let id in targets) {
                
                let diff = targets[id].hitsMax - targets[id].hits;
                
                if (targets[id].healPartCount === maxHealPart && diffHP <= diff) {
                    diffHP = diff
                    target = targets[id];
                }
            }
        } else {
            // если хиллеров нет то убиваем всех кто может ходить хотя бы раз в 5 тиков и не могут стрелять, если они ходят медленее то они просто мясо для дальнобоев
            
            let slowCreeps = []
            // TODO без оружия
            for (let id in targets) {
                
                if (targets[id].rangePartCount === 0 && (targets[id].movePartCount === 0 || (targets[id].allFatiguePartCount / targets[id].movePartCount) > 5)) {
                    targets[id].slow = true;
                    slowCreeps.push(targets[id]);
                    continue;
                }
                
                let diff = targets[id].hitsMax - targets[id].hits;
                
                if (diffHP <= diff) {
                    diffHP = diff;
                    target = targets[id];
                }
            }
            
            if (!target && slowCreeps.length > 0) {
                target = slowCreeps[0]
            }
        }
        
        return {creep: hostiles[target.index], state: target};
    },
    isMelle: function(creep) {
        for (let bodyPart of creep.body) {
            if (bodyPart.type === ATTACK) {
                return true;
            }
        }
        
        return false;
    },
    isHeal: function(creep) {
        for (let bodyPart of creep.body) {
            if (bodyPart.type === HEAL) {
                return true;
            }
        }
        
        return false;
    },
    isRange: function(creep) {
         for (let bodyPart of creep.body) {
            if (bodyPart.type === RANGED_ATTACK) {
                return true;
            }
        }
        
        return false;
    },
    back: function(creep, hostile) {
        // отступаем в противоположеную сторону от hostile
        let possibleCoordinateBack = []
        let maxRange = 0;
        
        for (let pos of creep.room.lookForAtArea(LOOK_TERRAIN,creep.pos.y-1,creep.pos.x-1,creep.pos.y+1,creep.pos.x+1,true)) {
            
            if (!(creep.pos.y === pos.y && creep.pos.x === pos.x) && (pos.terrain === "plain" || pos.terrain === "swamp") && (pos.x > 0 && pos.y > 0)) {
                
                
                let range = creep.room.getPositionAt(pos.x, pos.y).getRangeTo(hostile)
                
                if (maxRange < range) {
                    maxRange = range;   
                }
                
                possibleCoordinateBack.push({pos: pos, range: range})
            }
        }
    
        for (let pos of possibleCoordinateBack) {
            if (pos.pos.terrain === "plain" && pos.range === maxRange) {
                creep.moveTo(pos.pos.x, pos.pos.y);
                return;
            }
        }
        
        if (possibleCoordinateBack.length > 0) {
            creep.moveTo(possibleCoordinateBack[0].pos.x, possibleCoordinateBack[0].pos.y);
        }
    }
};