var findFirstStructure  = require('creeps.find.structure');

var DefendRoom = {
    DefendRoomMonitor: function(spawn) {
        
        var hostiles = spawn.pos.findInRange(FIND_HOSTILE_CREEPS, 100)
        
        if (!Memory.alarmRooms) Memory.alarmRooms = {};
        if (!Memory.alarmRooms[spawn.room.name]) {
            Memory.alarmRooms[spawn.room.name] = {Log: [], LastInvader: {time: 0}, LastUser: {time: 0}, update: Game.time};
        } else {
            Memory.alarmRooms[spawn.room.name].update = Game.time;
        }
        
        if(hostiles.length > 0){
            for (let hostile of hostiles) {
                
                if (hostile.owner.username === "Invader") {
                    // вторжение нпсей
                    Memory.alarmRooms[spawn.room.name].LastInvader = {time: Game.time}
                } else {
                    Memory.alarmRooms[spawn.room.name].LastUser = {time: Game.time, userName: hostile.owner.username}
                }
                
                //Memory.alarmRooms[spawn.room.name].Log.push({time: Game.time, userName: hostile.owner.username});
            }
        }
    },
    RoomIsAttack: function(roomName) {
        let npc = false;
        let users = false;
        
        if (!Memory.alarmRooms.hasOwnProperty(roomName)) { // не наша комната
            return {npc: npc, users: users, lost: false};
        }
        
        if (!(Game.time >= Memory.alarmRooms[roomName].update-1 && Game.time <= Memory.alarmRooms[roomName].update+1)) {
            return {npc: npc, users: users, lost: true};
        }
      
        if (Memory.alarmRooms[roomName].LastInvader.time + 75 > Game.time) {
            npc = true;
        }
        
        if (Memory.alarmRooms[roomName].LastUser.time + 500 > Game.time) {
            users = true;
        }
      
        return {npc: npc, users: users, lost: false};
    },
    getMinAlarmRoom: function(roomName) {
        
        let minDist = 99999;
        let minDistRoom = null;
        
        for (let alarmRoomName in Memory.alarmRooms) {
            let {npc, users} = this.RoomIsAttack(alarmRoomName)
            if (npc || users) {
                let dist = Game.map.getRoomLinearDistance(roomName, alarmRoomName);
                if (dist < minDist) {
                    minDist = dist;
                    minDistRoom = alarmRoomName;
                }
            }
        }
        
        return {dist: minDist, room: minDistRoom}
    }
};

module.exports = DefendRoom;