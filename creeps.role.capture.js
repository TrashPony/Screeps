var target;
var roleCapture = {
    run: function(creep,toRoom,targetController) {
        creep.say('WaGH!!!',true);
        if(creep.room.name == toRoom){
            if(creep.claimController(targetController) == ERR_NOT_IN_RANGE) {
                creep.moveTo(targetController);
            } else {
                creep.moveTo(30,35);
            }
        } else {
            creep.moveTo(new RoomPosition(25,25, toRoom));
        }
    }
};

module.exports = roleCapture;