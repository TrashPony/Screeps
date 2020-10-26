var reNewCreeps = {
    run: function(spawn) {
        for (let name in Memory.creeps) {
            if(Memory.creeps[name].reNew && Memory.creeps[name].id) {
                
                let creep = Game.creeps[name];
                
                if (creep) {
                    spawn.renewCreep(creep);
                }
            }
        }
    }
};

module.exports = reNewCreeps;