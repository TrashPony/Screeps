var techWorker = {
    available: function(avaibaleEnergy) {
        if(avaibaleEnergy < 350 ){
            return [WORK,MOVE,CARRY];
        }
        if(avaibaleEnergy >= 350 && avaibaleEnergy < 400 ){
            return [WORK,WORK,CARRY,MOVE,MOVE];
        }
        if(avaibaleEnergy >= 400 && avaibaleEnergy < 800 ){
            return [WORK,WORK,CARRY,CARRY,MOVE,MOVE];
        }
        if(avaibaleEnergy >= 800 ){
            return [WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE];
        }
        
        return [];
    }
};

module.exports = techWorker;