var createCreeps    = require('spawn.population.creeps.create');
var destroyCreeps   = require('spawn.population.creeps.destroy');
var createStorage   = require('spawn.autoBuild.storage');
var defendRoom      = require('spawn.defend');
var groups          = require('attack.group');


var populationCreeps = {
    run: function(spawn) {
        if(!spawn.spawning) {
            
            // todo Если какую то комнату атакуют игроки, то во всех румах создаем отряд для защиты и посылаем подкрепление
            // spawn.memory.sumWarrionGroup = 0;

            // обновляем данные о популяции только раз в 10 тиков что бы не грузить цпу
            if (spawn.memory.updateCreeps === undefined || spawn.memory.updateCreeps === 10) {
                spawn.memory.updateCreeps = 0
            } else {
                spawn.memory.updateCreeps++
                return;
            }
            
            let {npc, users, lost} = defendRoom.RoomIsAttack(spawn.room.name);
            if (npc || users) {
                // установить цель для группы этой комнатой, цель эта комната, даже если группа воюет где то еще, защита первостепенный приоритет
                spawn.memory.sumWarrionGroup = 1; // TODO на текущий момент поддерживается только 1 группа на 1 спавн, смотри реализацию популяции
                groups.setGroupRoom(spawn.id, spawn.room.name)
            } else {
                // проверям другие комнаты на наличие атаки если атака есть то посылаем подкрепление.
                let {dist, room} = defendRoom.getMinAlarmRoom(spawn.room.name)
                if (room && dist < 3) {
                    spawn.memory.sumWarrionGroup = 1;
                    groups.setGroupRoom(spawn.id, room)
                } else {
                    spawn.memory.sumWarrionGroup = 0;
                }
            }
                
            var countSource = spawn.room.find(FIND_SOURCES);

            if(spawn.room.controller.level >= 6){
                spawn.memory.sumTransport = 1;
                
                let findExtractor = spawn.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTRACTOR);
                    }   
                }, 'dijkstra');
                
                let findMineral = spawn.room.find(FIND_MINERALS, {
                    filter: (mineral) => {
                        return (mineral.mineralAmount > 0);
                    }   
                }, 'dijkstra');
                
                let findStorage = spawn.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_STORAGE);
                    }   
                }, 'dijkstra');
                
                if(findStorage.store > 150000){
                    spawn.memory.sumWorker = countSource.length * 2 + 2;
                } else {
                    if(findStorage.store < 100000){
                        spawn.memory.sumWorker = countSource.length * 2 + 1;
                    }
                }
                
                if(findExtractor[0] && findMineral[0]){
                    spawn.memory.sumHarvester = countSource.length + 1;
                } else {
                    if (findMineral[0]) {
                        spawn.room.createConstructionSite(findMineral[0].pos.x, findMineral[0].pos.y, STRUCTURE_EXTRACTOR);
                    }
                    spawn.memory.sumHarvester = countSource.length;
                }
            }
                
            if(spawn.room.controller.level >= 3 && spawn.room.controller.level < 6){
                
                let findStorage = spawn.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_STORAGE);
                    }   
                }, 'dijkstra');
                
                let findTower = spawn.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_TOWER);
                    }   
                }, 'dijkstra');
                
                if (findStorage[0] && findTower[0]) {
                    
                    if (spawn.room.controller.level >= 5){
                        spawn.memory.sumWorker = countSource.length + 1;
                        spawn.memory.sumTransport = 1;
                    } else {
                        spawn.memory.sumWorker = countSource.length * 2;
                        spawn.memory.sumTransport = 2;
                    }
                    
                } else {
                    spawn.memory.sumWorker = countSource.length * 2 + 1;
                    spawn.memory.sumTransport = 0;
                }
                
                if (spawn.room.controller.level >= 4){                
                    if (!findStorage[0]){
                        createStorage.run(spawn);
                    }
                }
                
                spawn.memory.sumHarvester = countSource.length;
            }
                
            if(spawn.room.controller.level == 2){
                spawn.memory.sumWorker = countSource.length * 2 + 1;
                spawn.memory.sumHarvester = 2;
                spawn.memory.sumWarrionGroup = 0;
            }
            
            if(spawn.room.controller.level < 2){
                spawn.memory.sumWorker = countSource.length * 2 + 1;
                spawn.memory.sumHarvester = 2;
                spawn.memory.sumWarrionGroup = 0;
            }
            
            updatePopulationSpawn(spawn)
        }
    }
};

function updatePopulationSpawn(spawn) {
    
     // очищаем глобальные данные
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            console.log(name)
            delete Memory.creeps[name];
        }
    }
    
    let currentPopulation = {};

    for (let name in Memory.creeps) {
        
        if (Memory.creeps[name].creepRoom !== spawn.room.name){
            continue;
        }
        
        if (!currentPopulation.hasOwnProperty(Memory.creeps[name].role)){
             currentPopulation[Memory.creeps[name].role] = 0;
        }
        
        currentPopulation[Memory.creeps[name].role]++
    }
    
    UpdateRole(spawn, 'melee_defender', groups.getAllCountWarriorBySpawn(spawn.id).groupMelleCount, currentPopulation, true)
    UpdateRole(spawn, 'range_defender', groups.getAllCountWarriorBySpawn(spawn.id).groupRangeCount, currentPopulation, true)
    UpdateRole(spawn, 'heal_defender', groups.getAllCountWarriorBySpawn(spawn.id).groupHealCount, currentPopulation, true)
    
    let {npc, users, lost} = defendRoom.RoomIsAttack(spawn.room.name);
    if (users) {
        if (spawn.memory.sumHarvester > 0) UpdateRole(spawn, 'harvester', 1, currentPopulation, true)
        if (spawn.memory.sumTransport > 0) UpdateRole(spawn, 'transport', 1, currentPopulation, true)
    } else {
        UpdateRole(spawn, 'harvester', spawn.memory.sumHarvester, currentPopulation)
        UpdateRole(spawn, 'transport', spawn.memory.sumTransport, currentPopulation)
    }
    
    UpdateRole(spawn, 'Worker', spawn.memory.sumWorker, currentPopulation)
    UpdateRole(spawn, 'logistic_transport', spawn.memory.sumLogisticTransport, currentPopulation)

    if (!Memory.groups){
        Memory.groups = {};
    }
    
    if (!Memory.groups.hasOwnProperty(spawn.id)) {
        Memory.groups[spawn.id] = []
    }

    // TODO не посылать рабочий туда где произошла тревога
    if (!(npc || users)){
        if (spawn.name === 'TrashCity' || spawn.name === 'RottenVillage') {
            UpdateRole(spawn, 'remoteWorker', 2, currentPopulation)
            UpdateRole(spawn, 'capture', 0, currentPopulation)
        }
    }
}

function UpdateRole(spawn, role, needCount, currentPopulation, noDestroy) {
    
    if (!currentPopulation.hasOwnProperty(role)) {    
        currentPopulation[role] = 0
    }
    
    if(currentPopulation[role] < needCount) {
        createCreeps.run(role, spawn.name);
    } else {
        if(currentPopulation[role] > needCount){
            if (!(spawn.room.name === 'sim' || noDestroy)) {
                destroyCreeps.search(role, spawn);
            }
        }
    }
}

module.exports = populationCreeps;