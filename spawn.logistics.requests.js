
// TODO проверять что транспорты еще живые
module.exports = {
    /*
    * Проверяем можем ли мы удовлить чей либо запрос, если да то отправляем транспорт
    * Если нет свободного транспорта то мы его создаем, ждем пока построится и даем задание.
    * На 1 руму может быть только 1 транспорт
    */
    checkRequests: function(spawn) {
        
        if (!Memory.logisticsRequsts[spawn.room.name].storageID || Memory.logisticsRequsts[spawn.room.name].storeEnergy.count < 50000) {
            // снимаем свои траспорты с заданий т.к. мы не можем удовлетворить требования
            for (let id in Memory.logisticsRequsts.requests) {
                let request = Memory.logisticsRequsts.requests[id];
                for (let creepID in request.transports) {
                    if (request.transports[creepID].fromRoom === spawn.room.name) {
                        let creep = Game.creeps[creepID];
                        creep.memory.requestID = null;
                        delete request.transports[creepID];
                    }
                }
            }
            return;
        }
        
        for (let id in Memory.logisticsRequsts.requests) {
            
            let request = Memory.logisticsRequsts.requests[id];

            if (request.open && request.roomName !== spawn.room.name){
                let transport = null;

                for(var name in Game.creeps){
                    let creep = Game.creeps[name];
                    if (creep.memory.role === 'logistic_transport' && creep.ticksToLive > 500 && !creep.memory.requestID) {
                        transport = creep;
                    }
                }
                
                if (transport) {
                    transport.memory.requestID = id;
                    request.transports[transport.name] = {creepName: transport.name, resource: RESOURCE_ENERGY, fromRoom: spawn.room.name};
                } else {
                    spawn.memory.sumLogisticTransport = 1;
                }
            }
        }
    },
    
    /*
    * проверяет кол-во ресурсов в комнате, если енергии в комнате мало создается запрос на нее
    * Если в какой то другой комнате есть энергия то та комната создает(или переиспользует) дальний транспорт и посылает вместе с ним ресурсы
    * Когда в комнате уже достаточно энергии то комната снимает запрос
    */
    checkEnergy: function(spawn){
        if (!Memory.logisticsRequsts) Memory.logisticsRequsts = {requests: {}};

        /* 
            request = {
                id: , 
                open: [true/false] // если запрос все еще актуален то true будет генерится транспорты из доступных мест/ false - запрос уже не актуален но не удалеятся потому что еще едут трансорты
                roomName: , 
                resource: [energy or mineral], 
                transports: {creepName: , resource: [energy or mineral], fromRoom: ,}, транспорты которые уже едут в руму
            }
        */
        
        if (!Memory.logisticsRequsts[spawn.room.name]) {
            Memory.logisticsRequsts[spawn.room.name] = {
                roomName: spawn.room.name,
                storageID: null,
                storeEnergy: {
                    count: 0,
                },
            };
        }
        
        let storage = null;
        for(var structureID in Game.structures){
            if (Game.structures[structureID].structureType === 'storage' && Game.structures[structureID].room.name === spawn.room.name) {
                storage = Game.structures[structureID];
            }
        }
        
        let request = Memory.logisticsRequsts.requests[spawn.room.name + RESOURCE_ENERGY];
        
        if (!storage) {
            Memory.logisticsRequsts[spawn.room.name].storageID = null;
            
            if (request) {
                // снимаем все запросы т.к. негде хранить, возвращаем транспорты обратно
                for (let creepID in request.transports) {
                    let creep = Game.creeps[creepID];
                    if (creep && creep.memory.requestID && creep.memory.requestID === request.id) {
                        creep.memory.requestID = null;
                    }
                }
                
                delete Memory.logisticsRequsts.requests[spawn.room.name + RESOURCE_ENERGY];
            }
        } else {
            Memory.logisticsRequsts[spawn.room.name].storageID = storage.id;
            Memory.logisticsRequsts[spawn.room.name].storeEnergy.count = storage.store[RESOURCE_ENERGY];
            
            
            if (Memory.logisticsRequsts[spawn.room.name].storeEnergy.count < 25000) {
                // создаем запрос если его еще нет
                if (request) {
                    request.open = true;
                } else {
                    Memory.logisticsRequsts.requests[spawn.room.name + RESOURCE_ENERGY] = {
                        id: spawn.room.name + RESOURCE_ENERGY,
                        open: true,
                        roomName: spawn.room.name,
                        resource: RESOURCE_ENERGY,
                        transports: {},
                    }
                }
            } else {
                // закрываем запрос, если все транспорты доехали то удаляем его
                if (request) {
                    request.open = false;
                    if (Object.keys(request.transports).length === 0) {
                        delete Memory.logisticsRequsts.requests[spawn.room.name + RESOURCE_ENERGY];
                    }
                } 
            }
        }
    },
};