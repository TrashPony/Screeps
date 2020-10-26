/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('spawn.population.tech.heal_defender');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    available: function(avaibaleEnergy) {
        //return [MOVE, HEAL];

        if(avaibaleEnergy < 750){
            return [MOVE, MOVE, HEAL];
        }
        
        if(avaibaleEnergy >= 750 && avaibaleEnergy < 1050){
            return [MOVE, MOVE, MOVE, MOVE, MOVE, HEAL, HEAL];
        }
        
        if(avaibaleEnergy >= 1050 && avaibaleEnergy < 1450){
            return [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, HEAL, HEAL, HEAL];
        }
        
        if(avaibaleEnergy >= 1440){
            return [TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,HEAL,HEAL,HEAL,HEAL];
        }
        
        return [];
    }
};