var logistics       = require('spawn.logistics');
var population      = require('spawn.population');
var defend          = require('spawn.defend');
var group           = require('attack.group');
var towerAssist     = require('tower.assist');

var spawn = {
    run: function() {
        for(var name in Game.spawns){
            towerAssist.checkLiveTower(Game.spawns[name].room.name)
            defend.DefendRoomMonitor(Game.spawns[name]);
            group.cheackLiveMember(Game.spawns[name])
            logistics.run(Game.spawns[name]);
            population.run(Game.spawns[name]);
        }
    }
};

module.exports = spawn;
