var destroyCreeps = {
    search: function (destroyType, spawn) { 
        
        let destroyCreeps = [];
        
        for (let name in Memory.creeps) {
            if(Memory.creeps[name].role === destroyType && Memory.creeps[name].toDestroy && Memory.creeps[name].id) {
                destroyCreeps.push(Memory.creeps[name].id)
            }
        }

        if(destroyCreeps.length === 0){
            for (let name in Memory.creeps) {
                if(Memory.creeps[name].role === destroyType) {
                    Memory.creeps[name].toDestroy = true;
                    return;
                }
            }
        }
    },
    kill: function (spawn) {
         for (let name in Memory.creeps) {
            if(Memory.creeps[name].toDestroy) {
                spawn.recycleCreep(Game.creeps[name]);
            }
        }
    }
};

module.exports = destroyCreeps;