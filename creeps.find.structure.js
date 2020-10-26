var findStructure;
var findTower;
var findContainer;
var findLink;

var findFirstStructure = {
    run: function(creep,typeStructure) {
        
        if(creep.spawning) typeSource = "";

        if(creep.memory.resultStructure && creep.memory._move){
            if((creep.memory.resultStructure.pos.x !== creep.memory._move.dest.x) || (creep.memory.resultStructure.pos.y !== creep.memory._move.dest.y) || (creep.memory.resultStructure.pos.roomName !== creep.memory._move.dest.room)) {
                //console.log(creep.memory.result.pos.x+ ' ' + creep.memory._move.dest.x + '||' + creep.memory.result.pos.y+ ' ' + creep.memory._move.dest.y +" сравнил " + creep.name);
                creep.memory.resultStructure.id = false;
            }
        }
        
       if(typeStructure == 'allNotSpawn') {
            if(!creep.memory._move || !creep.memory.resultStructure || creep.memory.resultStructure.id === false){
                findStorage = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_CONTAINER ||
                                structure.structureType == STRUCTURE_STORAGE ||
                                structure.structureType == STRUCTURE_LINK );
                    }  
                }, 'dijkstra');
                
            if(findStorage){
                    creep.memory.resultStructure = findStorage;
                    creep.moveTo(Game.getObjectById(creep.memory.resultStructure.id));
                    if(creep.memory._move) {
                        creep.memory.path = creep.memory._move.path;
                    } else {
                        if((creep.transfer(findStorage), RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                            creep.moveTo(findStorage);
                        } 
                    }
                }
            }
            
            if(creep.memory.resultStructure) {
                if(creep.transfer(Game.getObjectById(creep.memory.resultStructure.id), RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveByPath(creep.memory.path);
                } 
            }
        }
        
        if(typeStructure == 'Storage') {
            if(!creep.memory._move || !creep.memory.resultStructure || creep.memory.resultStructure.id === false){
                
                let findStorage = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_STORAGE);
                    }   
                }, 'dijkstra');
                
                if(findStorage){
                    creep.memory.resultStructure = findStorage;
                    creep.moveTo(Game.getObjectById(creep.memory.resultStructure.id));
                    if(creep.memory._move) {
                        creep.memory.path = creep.memory._move.path;
                    } else {
                        if((creep.transfer(findStorage), RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                            creep.moveTo(findStorage);
                        } 
                    }
                }
            }

            if(creep.memory.resultStructure && creep.memory.resultStructure.structureType === STRUCTURE_STORAGE ) {
                if(creep.transfer(Game.getObjectById(creep.memory.resultStructure.id), RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveByPath(creep.memory.path);
                } 
            }
        }
        
        if(typeStructure == 'Link') {
            if(!creep.memory._move || !creep.memory.resultStructure || creep.memory.resultStructure.id === false){
                
                let findLink = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType === STRUCTURE_LINK);
                    }   
                }, 'dijkstra');
                
                if(findLink){
                    creep.memory.resultStructure = findLink;
                    creep.moveTo(Game.getObjectById(creep.memory.resultStructure.id));
                    if(creep.memory._move) {
                        creep.memory.path = creep.memory._move.path;
                    } else {
                        if((creep.transfer(findLink), RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                            creep.moveTo(findLink);
                        } 
                    }
                }
            }
        
            if(creep.memory.resultStructure.structureType === STRUCTURE_LINK ) {
                if(creep.transfer(Game.getObjectById(creep.memory.resultStructure.id), RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveByPath(creep.memory.path);
                } 
            }
        }
        
        if(typeStructure == 'Container') {
            if(!creep.memory._move || !creep.memory.resultStructure || creep.memory.resultStructure.id === false){
                
                let findContainer = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_CONTAINER ||
                            structure.structureType == STRUCTURE_STORAGE );
                    }   
                }, 'dijkstra');
                    
                if(findContainer){
                    creep.memory.resultStructure = findContainer;
                    creep.moveTo(Game.getObjectById(creep.memory.resultStructure.id));
                    if(creep.memory._move) {
                        creep.memory.path = creep.memory._move.path;
                    } else {
                        if((creep.transfer(findContainer), RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                            creep.moveTo(findContainer);
                        } 
                    }
                }
            }
        
            if(creep.memory.resultStructure && (creep.memory.resultStructure.structureType === STRUCTURE_STORAGE || creep.memory.resultStructure.structureType === STRUCTURE_CONTAINER)) {
                if(creep.transfer(Game.getObjectById(creep.memory.resultStructure.id), RESOURCE_ENERGY) === ERR_NOT_IN_RANGE || creep.transfer(Game.getObjectById(creep.memory.resultStructure.id), RESOURCE_UTRIUM) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(Game.getObjectById(creep.memory.resultStructure.id));
                    //creep.moveByPath(creep.memory.path);
                } 
            }
        }
        
        if(typeStructure == 'Tower'){
            if(!creep.memory._move || !creep.memory.resultStructure || creep.memory.resultStructure.id === false){
                let findTower = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (tower) => {
                        return (tower.structureType == STRUCTURE_TOWER && tower.energy < 850)        
                        }
                    }, 'dijkstra');
                 if(findTower){
                    creep.memory.resultStructure = findTower;
                    creep.moveTo(Game.getObjectById(creep.memory.resultStructure.id));
                    if(creep.memory._move) {
                        creep.memory.path = creep.memory._move.path;
                    } else {
                        if((creep.transfer(findTower), RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                            creep.moveTo(findTower);
                        } 
                    }
                    return true;
                } else {
                    return false;
                }
            }
        
            if(creep.memory.resultStructure.structureType === STRUCTURE_TOWER) {
                if(Game.getObjectById(creep.memory.resultStructure.id).energy > 900) creep.memory.resultStructure.id = false;
                if(creep.transfer(Game.getObjectById(creep.memory.resultStructure.id), RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveByPath(creep.memory.path);
                } 
            }
        }
        
        if(typeStructure == 'Spawn'){
            if(!creep.memory._move || !creep.memory.resultStructure){
                let findStructure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return ((structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) && !structure.spawning && structure.energy < structure.energyCapacity);
                    }   
                }, 'dijkstra');
   
                if(findStructure && !findStructure.spawning){ // TODO странный костыль если респаун респаунит то возникает ошибка цикличной зависимости
                    creep.memory.resultStructure = findStructure;
                    creep.moveTo(Game.getObjectById(creep.memory.resultStructure.id));
                    if(creep.memory._move) {
                        creep.memory.path = creep.memory._move.path;
                    } else {
                        if((creep.transfer(findStructure), RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                            creep.moveTo(findStructure);
                        } 
                    }
                }
            } else {
                if(creep.memory.resultStructure && (creep.memory.resultStructure.structureType === STRUCTURE_EXTENSION || creep.memory.resultStructure.structureType === STRUCTURE_SPAWN)) {
                    
                    try {
                        if(creep.memory.controlTransfer === false && Game.getObjectById(creep.memory.resultStructure.id).energy == Game.getObjectById(creep.memory.resultStructure.id).energyCapacity) {
                            delete creep.memory.resultStructure;
                            findFirstStructure.run(creep,'Spawn');
                        }
                    } catch(err){
                        delete creep.memory.resultStructure;
                    }
                    
                    if(creep.memory.resultStructure) {
                        if(creep.transfer(Game.getObjectById(creep.memory.resultStructure.id), RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                            creep.moveTo(Game.getObjectById(creep.memory.resultStructure.id));
                        } 
                    }
                } else {
                    if(creep.memory.resultStructure){
                        delete creep.memory.resultStructure;
                    }
                }
            }
        }
    }
};

module.exports = findFirstStructure;