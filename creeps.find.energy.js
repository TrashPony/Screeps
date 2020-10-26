var freezeControl     = require('creeps.control.freeze');
var sayCreep    = require('creeps.say');

var findFirstResource = {
    //creep.room.find
    //creep.pos.findClosestByPath
    run: function(creep,typeSource) {
        
        if(creep.spawning) typeSource = "";
        
        sayCreep.sendMsg(creep, '🚚', true)

        if(creep.memory.result && creep.memory._move){
            if((creep.memory.result.pos.x !== creep.memory._move.dest.x) || (creep.memory.result.pos.y !== creep.memory._move.dest.y) || (creep.memory.result.pos.roomName !== creep.memory._move.dest.room)) {
                //console.log(creep.memory.result.pos.x+ ' ' + creep.memory._move.dest.x + '||' + creep.memory.result.pos.y+ ' ' + creep.memory._move.dest.y +" сравнил " + creep.name);
               freezeControl.action(creep);
            }
        }
        
        if(typeSource === 'All'){
            if(!creep.memory._move || !creep.memory.result || creep.memory.result.id === false) {
                
                let selection = [];
                
                let findContainer = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return ((structure.structureType === STRUCTURE_CONTAINER || structure.structureType === STRUCTURE_STORAGE) && structure.store[RESOURCE_ENERGY] > creep.carryCapacity);
                    }   
                });
                    
                let findSource = creep.pos.findClosestByPath(FIND_SOURCES, {
                    filter: (source) => {
                        return (source.energy > 0);
                    }
                });
                
                let findLink = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (link) => {
                        return ((link.structureType === STRUCTURE_LINK) && link.energy > creep.carryCapacity);
                    }   
                });
            
                if(findContainer) {
                    selection.push(findContainer); 
                } else {
                    if(findSource) selection.push(findSource);
                    if(findLink) selection.push(findLink);
                }
            
                let result = creep.pos.findClosestByPath(selection, 'dijkstra');
                if(result) {
                    creep.memory.result=result;
                    creep.moveTo(Game.getObjectById(creep.memory.result.id));
                    if(creep.memory._move){
                        creep.memory.path = creep.memory._move.path;
                    } else {
                        if((creep.withdraw(result), RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                             creep.moveTo(result);
                        } 
                    }
                }
            } else {
                if(creep.memory.result.structureType === STRUCTURE_CONTAINER || creep.memory.result.structureType === STRUCTURE_STORAGE || creep.memory.result.structureType === STRUCTURE_LINK) {
                    
                    let container = Game.getObjectById(creep.memory.result.id);
                    
                    if(creep.withdraw(container, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                         creep.moveByPath(creep.memory.path);
                    } 
                    
                    if(container.store[RESOURCE_ENERGY] < creep.carryCapacity) {
                        freezeControl.action(creep);
                    }
                    
                    return;
                }
                
                if((creep.memory.result.ticksToRegeneration > 0) || !(creep.memory.result.ticksToRegeneration)){
                   
                    try{
                        if(Game.getObjectById(creep.memory.result.id) === null || Game.getObjectById(creep.memory.result.id).energy < 1) {
                            freezeControl.action(creep);
                        }
                    } catch(err){
                        console.log(err + ' ' + creep.name + ' ' + Game.getObjectById(creep.memory.result.id) + ' ' + creep.room.name + ' ' + creep.memory.role);
                        freezeControl.action(creep);
                    }
                    if(creep.memory.result && creep.harvest(Game.getObjectById(creep.memory.result.id)) === ERR_NOT_IN_RANGE) {
                         creep.moveByPath(creep.memory.path);
                    }
                }
            }
        }
        
        if(typeSource === 'Container'){
            
            if(!creep.memory._move || !creep.memory.result || creep.memory.result.id === false){
                
                let findContainer = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return ((structure.structureType === STRUCTURE_CONTAINER || structure.structureType === STRUCTURE_STORAGE || structure.structureType === STRUCTURE_LINK) && structure.store[RESOURCE_ENERGY] > creep.carryCapacity);
                    }   
                });
                        
                if(findContainer){
                    creep.memory.result=findContainer;
                    creep.moveTo(Game.getObjectById(creep.memory.result.id));
                    if(creep.memory._move){
                        creep.memory.path = creep.memory._move.path;
                    } else {
                        if((creep.withdraw(result), RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                             creep.moveTo(result);
                        } 
                    }
                }
                
            } else {
                if(creep.memory.result.structureType === STRUCTURE_CONTAINER || creep.memory.result.structureType === STRUCTURE_STORAGE ) {
                    if(Game.getObjectById(creep.memory.result.id).store.energy < creep.carryCapacity) creep.memory.result.id = false;
                    if(creep.withdraw(Game.getObjectById(creep.memory.result.id), RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                         creep.moveByPath(creep.memory.path);
                    } 
                }
            }
        }
        
        if(typeSource === 'Container2k'){
            if(!creep.memory._move || !creep.memory.result || creep.memory.result.id === false){
                
                let findContainer = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (((structure.structureType === STRUCTURE_CONTAINER) && structure.store[RESOURCE_ENERGY] > creep.carryCapacity) ||
                                ((structure.structureType === STRUCTURE_LINK) && structure.energy > creep.carryCapacity));
                    }   
                });
                        
                if(findContainer){
                    creep.memory.result=findContainer;
                    creep.moveTo(Game.getObjectById(creep.memory.result.id));
                    if(creep.memory._move){
                        creep.memory.path = creep.memory._move.path;
                    } else {
                        if((creep.withdraw(result), RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                             creep.moveTo(result);
                        } 
                    }
                }
                
            } else {
                if(creep.memory.result.structureType === STRUCTURE_CONTAINER) {
                    if(Game.getObjectById(creep.memory.result.id).store.energy < creep.carryCapacity) creep.memory.result.id = false;
                    if(creep.withdraw(Game.getObjectById(creep.memory.result.id), RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                       creep.moveByPath(creep.memory.path);
                    } 
                }
                if(creep.memory.result.structureType === STRUCTURE_LINK){
                    if(Game.getObjectById(creep.memory.result.id).energy < creep.carryCapacity) creep.memory.result.id = false;
                    if(creep.withdraw(Game.getObjectById(creep.memory.result.id), RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                        creep.moveByPath(creep.memory.path);
                    } 
                }
            }
        }
        
        if(typeSource === 'Source'){
            if(!creep.memory._move || !creep.memory.result || creep.memory.result.id === false){
                findSource = creep.pos.findClosestByPath(FIND_SOURCES, {
                    filter: (source) => {
                        return (source.energy > 0);
                        }
                    });
                if(findSource){
                    creep.memory.result=findSource;
                    creep.moveTo(Game.getObjectById(creep.memory.result.id));
                    if(creep.memory._move){
                        creep.memory.path = creep.memory._move.path;
                    } else {
                        if((creep.withdraw(result), RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                             creep.moveTo(result);
                        } 
                    }
                }
            } else {
            
            if((creep.memory.result.ticksToRegeneration > 0) || !(creep.memory.result.ticksToRegeneration)){
                
                try{
                    if(Game.getObjectById(creep.memory.result.id) === null || Game.getObjectById(creep.memory.result.id).energy < 1) {
                        creep.memory.result.id = false;
                    }
                } catch(err){
                    console.log(err + ' ' + creep.name + ' ' + Game.getObjectById(creep.memory.result.id) + ' ' + creep.room.name + ' ' + creep.memory.role);
                    creep.memory.result.id = false;
                }
                
                if(creep.harvest(Game.getObjectById(creep.memory.result.id)) === ERR_NOT_IN_RANGE) {
                    creep.moveByPath(creep.memory.path);
                    }
                }
            }
        }
        
        if(typeSource === 'Link'){
            if(!creep.memory._move || !creep.memory.result || creep.memory.result.id == false){
                
                findLink = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (link) => {
                        return ((link.structureType === STRUCTURE_LINK) && link.energy > creep.carryCapacity);
                    }   
                });
                
                if(findLink){
                    creep.memory.result=findLink;
                    creep.moveTo(Game.getObjectById(creep.memory.result.id));
                    if(creep.memory._move){
                        creep.memory.path = creep.memory._move.path;
                    } else {
                        if((creep.withdraw(result), RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                             creep.moveTo(result);
                        } 
                    }
                }
                
            } else {
                if(creep.memory.result.structureType === STRUCTURE_LINK){
                    if(Game.getObjectById(creep.memory.result.id).energy < creep.carryCapacity) creep.memory.result.id = false;
                    if(creep.withdraw(Game.getObjectById(creep.memory.result.id), RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                        creep.moveByPath(creep.memory.path);
                    } 
                }
            }
        }
    }
};

module.exports = findFirstResource;