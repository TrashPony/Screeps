var link      = require('spawn.logistics.link');
var container = require('spawn.logistics.container');
var requests  = require('spawn.logistics.requests');

var logistics = {
    run: function(spawn) {
        requests.checkEnergy(spawn);
        requests.checkRequests(spawn);
        link.run(spawn);
        container.run(spawn);
    }
};


module.exports = logistics;