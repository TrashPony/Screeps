var techTransport = {
    available: function(avaibaleEnergy) {

        if(avaibaleEnergy >= 750 && avaibaleEnergy < 1400){
            return [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY];
        }
        
        if(avaibaleEnergy >= 1400){
            return [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY];
        }
        
        return [];
    }
};

module.exports = techTransport;