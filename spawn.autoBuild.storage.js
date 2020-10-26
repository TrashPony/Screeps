var buildStarage = {
    run: function(spawn) {

        var points = []
        
        if(CheackPlace(spawn, spawn.pos.x + 1, spawn.pos.y)) {
            var point = {x: spawn.pos.x + 1, y: spawn.pos.y}
            points.push(point);
        }
        
        if(CheackPlace(spawn, spawn.pos.x + 1, spawn.pos.y - 1)) {
            var point = {x: spawn.pos.x + 1, y: spawn.pos.y - 1}
            points.push(point);
        }
        if(CheackPlace(spawn, spawn.pos.x, spawn.pos.y - 1)) {
            var point = {x: spawn.pos.x, y: spawn.pos.y - 1}
            points.push(point);            
        }
        if(CheackPlace(spawn, spawn.pos.x - 1, spawn.pos.y - 1)) {
            var point = {x: spawn.pos.x - 1, y: spawn.pos.y - 1}
            points.push(point);     
        }
        if(CheackPlace(spawn, spawn.pos.x - 1, spawn.pos.y)) {
            var point = {x: spawn.pos.x - 1, y: spawn.pos.y}
            points.push(point);   
        }
        if(CheackPlace(spawn, spawn.pos.x - 1, spawn.pos.y + 1)){
            var point = {x: spawn.pos.x - 1, y: spawn.pos.y + 1}
            points.push(point);  
        }
        if(CheackPlace(spawn, spawn.pos.x, spawn.pos.y + 1)){
            var point = {x: spawn.pos.x, y: spawn.pos.y + 1}
            points.push(point);   
        }
        if(CheackPlace(spawn, spawn.pos.x + 1, spawn.pos.y + 1)){
            var point = {x: spawn.pos.x + 1, y: spawn.pos.y + 1}
            points.push(point);  
        }

        var findStorage = findStorage(spawn, points);
        
        if (findStorage) {
            return;
        } else {
            spawn.room.createConstructionSite(points[0].x, points[0].y, STRUCTURE_STORAGE);
        }

        function CheackPlace(spawn, x, y) {
            
            var point = spawn.room.lookForAt('terrain', x, y);

            if (point != 'wall') {
                return true;
            } else {
                return false;
            }
        }
        
        function findStorage(spawn, points) {
            
            for(var i = 0; i < points.length; i++) {
            
                var construction = spawn.room.lookForAt('constructionSite', points[i].x, points[i].y);
            
                if(construction.length > 0) {
                    if(construction[0].structureType === "storage"){
                        return true;
                    }
                }
            
                var structure = spawn.room.lookForAt('structure', points[i].x, points[i].y);
            
                if(structure.length > 0) {
                    if(structure[0].structureType === "storage"){
                        return true;
                    }
                }
            }
            
            return false;
        }
    }
};

module.exports = buildStarage;