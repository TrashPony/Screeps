/*
    Модуль собирает данные по каким целям ведут огонь турели в комнате
    Если турель не ведет огонь на своей территории но соседняя турель работает, то асистируем рабучую турель
 */

module.exports = {
    addTarget: function(tower, targetID) {
        if (!Memory.towerAssist) Memory.towerAssist = {};
        if (!Memory.towerAssist[tower.room.name]) Memory.towerAssist[tower.room.name] = {};
        
        Memory.towerAssist[tower.room.name][tower.id] = targetID;
    },
    getTargetID: function(roomName) {
        if (!Memory.towerAssist) Memory.towerAssist = {};
        if (!Memory.towerAssist[roomName]) Memory.towerAssist[roomName] = {};
        
        for (let toweID in Memory.towerAssist[roomName]) {
            return Memory.towerAssist[roomName][toweID]
        }
    },
    removeTarget: function(tower) {
        if (!Memory.towerAssist) Memory.towerAssist = {};
        if (!Memory.towerAssist[tower.room.name]) Memory.towerAssist[tower.room.name] = {};
        
        delete Memory.towerAssist[tower.room.name][tower.id]
    },
    checkLiveTower: function(roomName) {
        
        if (!Memory.towerAssist) Memory.towerAssist = {};
        if (!Memory.towerAssist[roomName]) Memory.towerAssist[roomName] = {};
        
        // проверям что турели живы иначе удаляем их и их цели  
        for (let toweID in Memory.towerAssist[roomName]) {
            if (!Game.structures[toweID]) {
                delete Memory.towerAssist[roomName][tower.id]
            }
        }
    },
};