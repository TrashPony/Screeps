/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('structures.repair');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    Repair: function(repairer, range) {
        for(var structure of repairer.pos.findInRange(FIND_STRUCTURES, range)) {
            if ((structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_ROAD) && structure.hits < structure.hitsMax) {
                if (repairer.repair(structure) === -9) {
                    repairer.moveTo(structure)
                }
                return true
            }
                        
            if ((structure.structureType == STRUCTURE_WALL || structure.structureType == STRUCTURE_RAMPART) && structure.hits < 50000) {
                if (repairer.repair(structure) === -9) {
                    repairer.moveTo(structure)
                }
                return true
            }
        }
    }
};