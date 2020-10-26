var transferControl = {
    run: function(creep) {
        if(_.sum(creep.carry) == creep.carryCapacity) {
            creep.memory.controlTransfer = false;
        }
        
        if(_.sum(creep.carry) == 0) {
            creep.memory.controlTransfer = true;
        }
    }
};

module.exports = transferControl;