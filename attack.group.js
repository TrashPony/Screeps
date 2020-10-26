/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('attack.group');
 * mod.thing == 'a thing'; // true
 */
var attackModule    = require('attack.get_target');
var behavior        = require('attack.group.behavior');

module.exports = {
    groupTypes: {
        s_gibride: {
            groupMelleCount: 1,
            groupHealCount: 1,
            groupRangeCount: 1, 
        },
        s_melee: {
            groupMelleCount: 2,
            groupHealCount: 1,
            groupRangeCount: 0, 
        },
        s_range: {
            groupMelleCount: 0,
            groupHealCount: 1,
            groupRangeCount: 2, 
        },
        m_range: {
            groupMelleCount: 1,
            groupHealCount: 1,
            groupRangeCount: 2, 
        },
        b_gibride: {
            groupMelleCount: 2,
            groupHealCount: 1,
            groupRangeCount: 2,  
        },
    },
    maxCreepGroun: function(groupType) {
        let gType = this.groupTypes[groupType];
        if (gType) {
            return gType.groupMelleCount + gType.groupHealCount + gType.groupRangeCount;
        } else {
            return 0;
        }
    },
    distribution: function(creep) {
        let spawn = Game.spawns[creep.memory.spawnName];
        
        if (!spawn || !Memory.groups) return;

        let groups = Memory.groups[spawn.id];
        if (!groups) return;
        
        if (creep.memory.group) {
            for (let group of groups) {
                if (!group.toRoom) group.toRoom = spawn.room.name;
                if (group.id === creep.memory.group) return group;
            }
        }
        
        while (groups.length < spawn.memory.sumWarrionGroup) {
            let newGroup = {id: spawn.name + '' + groups.length + Game.time, creeps: [], leader: null, toRoom: spawn.room.name, status: "pending", type: "m_range"};
            Memory.groups[spawn.id].push(newGroup);
        }
        
        for (let group of groups) {
            
            if (!group.type) group.type = "m_range";
            
            let melle = 0;
            let heal = 0;
            let range = 0;
            
            for (let creepName of group.creeps) {
                let groupCreep = Game.creeps[creepName.name];
                if (groupCreep) {                
                    if (attackModule.isMelle(groupCreep)) melle++;
                    if (attackModule.isHeal(groupCreep))  heal++;
                    if (attackModule.isRange(groupCreep)) range++;
                }
            }
            
            // милишник всега лидер потому что танкует
            if (melle < this.groupTypes[group.type].groupMelleCount && attackModule.isMelle(creep)) {
                creep.memory.group = group.id;
                group.leader = creep.name;
                group.creeps.push({name: creep.name, role: 'melee'});
                creep.say('Join!',true);
                return group;
            }
            
            if (heal < this.groupTypes[group.type].groupHealCount && attackModule.isHeal(creep)) {
                creep.memory.group = group.id;
                group.creeps.push({name: creep.name, role: 'heal'});
                creep.say('Join!',true);
                return group;
            }
            
            if (range < this.groupTypes[group.type].groupRangeCount && attackModule.isRange(creep)) {
                creep.memory.group = group.id;
                group.creeps.push({name: creep.name, role: 'range'})
                creep.say('Join!',true);;
                return group;
            }
        }
    },
    cheackLiveMember: function(spawn) {
        
        if (!Memory.groups) return;
        
        let groups = Memory.groups[spawn.id];
        if (!groups) return;
        
        for (let group of groups) {
            
            let i = group.creeps.length
            while (i--) {
                let creep = Game.creeps[group.creeps[i].name];
                if (!creep) { 
                    group.creeps.splice(i, 1);
                } 
            }
            
            if (group.creeps.length === 0 || (group.creeps.length === 1 && group.creeps[0].role === "heal")) {
                group.status = "pending";
                if (group.creeps.length === 1) {
                    group.leader = group.creeps[0].name;
                    behavior.getGroupTarget(group, Game.creeps[group.leader]);
                }
                continue;
            }
            
            if (group.status === "pending" && group.creeps.length === this.maxCreepGroun(group.type)) {
                group.status = "ok";
            }
            
            // если лидер умер, или лидер не является милишником то переназначаем лидера если есть милишник то его, а если нет то рандомно
            let leader = Game.creeps[group.leader];
            if (!leader || !attackModule.isMelle(leader)) {
                
                let meleeLeader = false;
                for (let creepName of group.creeps) {
                    let groupCreep = Game.creeps[creepName.name];
                    if (groupCreep && attackModule.isMelle(groupCreep)) {
                        meleeLeader = true;
                        group.leader = groupCreep.name;
                        leader = groupCreep
                        break;
                    }
                }
                
                if (!meleeLeader && group.creeps.length > 0) {
                    group.leader = group.creeps[0].name;
                    leader = Game.creeps[group.creeps[0].name];
                }
            }

            behavior.getGroupTarget(group, leader)
        }
    },
    getGroup: function(spawnID, id) {
        let groups = Memory.groups[spawnID];
        
        if (!groups) return null;
        
        for (let group of groups) {
            if (group.id === id) {
                return group;
            }
        }
    },
    setGroupRoom: function(spawnID, roomName) {
        
        if (!Memory.groups) return;
        
        let groups = Memory.groups[spawnID];
        
        if (!groups) return null;
        
        for (let group of groups) {
            group.toRoom = roomName;
        }
    },
    getAllCountWarriorBySpawn: function(spawnID) {
        if (!Memory.groups) return;
        
        let groups = Memory.groups[spawnID];
        
        if (!groups) return null;
        
        let allCount = {
            groupMelleCount: 0,
            groupHealCount: 0,
            groupRangeCount: 0, 
        }
        
        for (let group of groups) {
            allCount.groupMelleCount += this.groupTypes[group.type].groupMelleCount;
            allCount.groupHealCount += this.groupTypes[group.type].groupHealCount;
            allCount.groupRangeCount += this.groupTypes[group.type].groupRangeCount;
        }
        
        return allCount
    },
};