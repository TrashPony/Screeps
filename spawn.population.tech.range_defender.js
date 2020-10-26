/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('spawn.population.tech. range_defender');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    available: function(avaibaleEnergy) {
        
        //return [MOVE, RANGED_ATTACK];

        if(avaibaleEnergy >= 750 && avaibaleEnergy < 1050){
            return [MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK];
        }
        
        if(avaibaleEnergy >= 1050 && avaibaleEnergy < 1400){
            return [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK];
        }
        
        if(avaibaleEnergy >= 1400){
            return [RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];
        }
        
        return [];
    }
};