var reNewCreeps      = require('spawn.population.reNew');
var populationCreeps = require('spawn.population.creeps');
var destroyCreeps    = require('spawn.population.creeps.destroy');

var population = {
    run: function(spawn) {
        reNewCreeps.run(spawn);
        destroyCreeps.kill(spawn);
        populationCreeps.run(spawn);
    }
};

module.exports = population;