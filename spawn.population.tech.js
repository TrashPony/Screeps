var techWorker        = require('spawn.population.tech.worker');
var techTransport     = require('spawn.population.tech.transport');
var techHarvester     = require('spawn.population.tech.harvester');
var techCapture       = require('spawn.population.tech.capture');
var techRangeDefender = require('spawn.population.tech.range_defender');
var techMelleDefender = require('spawn.population.tech.melee_defender');
var techHealDefender = require('spawn.population.tech.heal_defender');

var tech = {
    available: function(role, avaibaleEnergy) {
        if(role == 'Worker' || role == 'remoteWorker') {
            return techWorker.available(avaibaleEnergy);
        }
        
        if(role == 'transport') {
            return techTransport.available(avaibaleEnergy);
        }
        
        if(role == 'logistic_transport') {
            return techTransport.available(avaibaleEnergy);
        }
        
        if(role == 'harvester') {
            return techHarvester.available(avaibaleEnergy);
        }
        
        if(role == 'range_defender') {
            return techRangeDefender.available(avaibaleEnergy);
        }
        
        if(role == 'melee_defender') {
            return techMelleDefender.available(avaibaleEnergy);
        }
        
        if(role == 'heal_defender') {
            return techHealDefender.available(avaibaleEnergy);
        }
        
        if(role == 'remoteHarvester') { // TODO
            return techHarvester.available(avaibaleEnergy);
        }
        
        if(role == 'capture') {
            return techCapture.available(avaibaleEnergy);
        }
    }
};

module.exports = tech;