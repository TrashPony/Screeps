/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('spawn.population.tech.melee_defender');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    available: function(avaibaleEnergy) {
        //return [MOVE, ATTACK];

        if(avaibaleEnergy >= 750 && avaibaleEnergy < 1010){
            return [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK];
        }
        
        if(avaibaleEnergy >= 1010 && avaibaleEnergy < 1400){
            return [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK];
        }
        
        if(avaibaleEnergy >= 1400){
            return [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK];
        }
        
        return [];
    }
};