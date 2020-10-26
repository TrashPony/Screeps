var findFirstStructure  = require('creeps.find.structure');
var mineralBaseTransfer = require('creeps.role.harvester.minerals');
var buildContainer      = require('creeps.role.harvester.buildContainer');
var transferControl     = require('creeps.control.transfer');
var sayCreep            = require('creeps.say');

var roleHarvester = {
    run: function(creep) {
        
        var source = creep.room.find(FIND_SOURCES);
        var harvesters = creep.room.find(FIND_MY_CREEPS, {
            filter: (creep) => (creep.memory.role == 'harvester')
        });        
        
        if(!creep.memory.sourceID){
            
            creep.memory.sourceID;
            
            for(var i = 0; i < source.length; i++) {
                
                var count = 0;
                
                for(var j = 0; j < harvesters.length; j++){
                    if(harvesters[j].memory.sourceID){
                        if(source[i].id === harvesters[j].memory.sourceID.id){
                            count++;
                        }
                    }
                }
                
                if(count === 0){
                    creep.memory.sourceID = Game.getObjectById(source[i].id);
                }
            }
        }
        
        if(!creep.memory.sourceID){
           mineralID = creep.room.find(FIND_MINERALS);
           creep.memory.sourceID = mineralID[0];
        }
        
        
        transferControl.run(creep);
        
        if(_.sum(creep.carry) < creep.carryCapacity && creep.memory.controlTransfer) {
            
            if(creep.memory.sourceID){
                sayCreep.sendMsg(creep, '⛏️', true) 
                if(creep.harvest(Game.getObjectById(creep.memory.sourceID.id)) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(Game.getObjectById(creep.memory.sourceID.id));
                } 
            }
            
        } else {
            
            let container = Game.getObjectById(creep.memory.buildConteinerID)
            
            if (creep.memory.buildConteinerID && (creep.build(container) == ERR_NOT_IN_RANGE)) {
                creep.moveTo(container);
            } else {
                
                buildContainer.run(creep);
                
                var mineral = mineralBaseTransfer.monitor(creep);
                
                if(mineral) {
                    mineralBaseTransfer.action(creep, mineral);
                } else {
                    // TODO держать в памяти контейнер после постройки что бы не искать строения
                    // todo передавать энергию без движения
                    findFirstStructure.run(creep,'allNotSpawn');
                }
            }
        } 
    }
};


module.exports = roleHarvester;