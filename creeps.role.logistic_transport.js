/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('creeps.role.logistic_transport');
 * mod.thing == 'a thing'; // true
 */
var transferControl     = require('creeps.control.transfer');
var findFirstResource   = require('creeps.find.energy');
var findFirstStructure  = require('creeps.find.structure');
var sayCreep            = require('creeps.say');
var defendRoom          = require('spawn.defend');

module.exports = {
    logisticTransport: function(creep) {
        transferControl.run(creep);
        
        let request = Memory.logisticsRequsts.requests[creep.memory.requestID];
        
        let creepRoom = creep.memory.creepRoom;
        if (request) creepRoom = request.roomName;
        
        let {npc, users, lost} = defendRoom.RoomIsAttack(creepRoom);
        if (!request || (npc || users || lost) || creep.ticksToLive < 300) {
            
            if (lost) {
                creep.memory.requestID = null;
                delete request.transports[creep.id];
            }
            
            // скидываем ресурсы на свою базу если по каким то причинам они остались
            if(!creep.memory.controlTransfer && creep.memory.creepRoom === creep.room.name) {
                sayCreep.sendMsg(creep, '🚛', true) 
                findFirstStructure.run(creep,'Storage');
                return;
            }
            
            // возвращаемся на свою базу
            creep.moveTo(Game.spawns[creep.memory.spawnName]);
        } else {
            // забираем ресурсы в румме отправителе
            if(creep.carry.energy < creep.carryCapacity && creep.memory.controlTransfer) {
                
                // если запрос закрыт и мы пусты, то больше не работаем с ним
                if (!request.open) {
                    creep.memory.requestID = null;
                    delete request.transports[creep.id];
                    return;
                }
                
                if(creep.room.name == request.transports[creep.name].fromRoom) {
                    findFirstResource.run(creep,'Container');
                } else {
                    creep.moveTo(new RoomPosition(25, 25, request.transports[creep.name].fromRoom));
                }
            } 
            
            // отправляем ресурсы в руму запрашивателя
            if(!creep.memory.controlTransfer) {
                if(creep.room.name == request.roomName) {
                    sayCreep.sendMsg(creep, '🚛', true) 
                    findFirstStructure.run(creep,'Storage');
                } else {
                    creep.moveTo(Game.structures[Memory.logisticsRequsts[request.roomName].storageID]);
                }
            }
        }
    },
};