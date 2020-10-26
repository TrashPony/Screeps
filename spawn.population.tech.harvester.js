var techHarvester = {
    available: function(avaibaleEnergy) {
        if(avaibaleEnergy >= 500 && avaibaleEnergy < 750){
            return [WORK,WORK,WORK,WORK,MOVE,CARRY];
        }
        
        if(avaibaleEnergy >= 800){
            return [WORK,WORK,WORK,WORK,WORK,WORK,MOVE,MOVE,CARRY,CARRY];
        }
        
        return [];
    }
};

module.exports = techHarvester;