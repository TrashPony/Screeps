var buildContainer = {
    run: function(creep) {
        var posSource = creep.memory.sourceID.pos;
        
        var points = []
        
        if(CheackPlace(creep, posSource.x + 1, posSource.y)) {
            var point = {x: posSource.x + 1, y: posSource.y}
            points.push(point);
        }
        
        if(CheackPlace(creep, posSource.x + 1, posSource.y - 1)) {
            var point = {x: posSource.x + 1, y: posSource.y - 1}
            points.push(point);
        }
        if(CheackPlace(creep, posSource.x, posSource.y - 1)) {
            var point = {x: posSource.x, y: posSource.y - 1}
            points.push(point);            
        }
        if(CheackPlace(creep, posSource.x - 1, posSource.y - 1)) {
            var point = {x: posSource.x - 1, y: posSource.y - 1}
            points.push(point);     
        }
        if(CheackPlace(creep, posSource.x - 1, posSource.y)) {
            var point = {x: posSource.x - 1, y: posSource.y}
            points.push(point);   
        }
        if(CheackPlace(creep, posSource.x - 1, posSource.y + 1)){
            var point = {x: posSource.x - 1, y: posSource.y + 1}
            points.push(point);  
        }
        if(CheackPlace(creep, posSource.x, posSource.y + 1)){
            var point = {x: posSource.x, y: posSource.y + 1}
            points.push(point);   
        }
        if(CheackPlace(creep, posSource.x + 1, posSource.y + 1)){
            var point = {x: posSource.x + 1, y: posSource.y + 1}
            points.push(point);  
        }

        var findContainer = FindContainer(creep, points);
        
                       

        if (findContainer) {
            return;
        } else {
            // TODO проверять что удалось установить и пытаться поставить во всех поинтах пока не удастся
            creep.room.createConstructionSite(points[0].x, points[0].y, STRUCTURE_CONTAINER);
        }

        function CheackPlace(creep, x, y) {
            
            var point = creep.room.lookForAt('terrain', x, y);

            if (point != 'wall') {
                return true;
            } else {
                return false;
            }
        }
        
        function FindContainer(creep, points) {
            for(var i = 0; i < points.length; i++) {
            
                var construction = creep.room.lookForAt('constructionSite', points[i].x, points[i].y);
            
                if(construction.length > 0) {
                    if(construction[0].structureType === "container" || construction[0].structureType === "link"){
                        creep.memory.buildConteinerID = construction[0].id;
                        return true;
                    }
                }
            
                var structure = creep.room.lookForAt('structure', points[i].x, points[i].y);
            
                if(structure.length > 0) {
                    if(structure[0].structureType === "container" || structure[0].structureType === "link"){
                        creep.memory.buildConteinerID = structure[0].id;
                        return true;
                    }
                }
            }
            return false;
        }
    }
};

module.exports = buildContainer;