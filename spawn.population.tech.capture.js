var techCapture = {
    available: function(avaibaleEnergy) {
        if(avaibaleEnergy >= 700){
            return [MOVE,MOVE,CLAIM];
        }
        
        return [];
    }
};

module.exports = techCapture;