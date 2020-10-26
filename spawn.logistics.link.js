var link = {
    run: function(spawn) {
        const links = spawn.room.find(FIND_MY_STRUCTURES, {
            filter: { structureType: STRUCTURE_LINK }
        });
        
        var findStorage = spawn.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_STORAGE );
            }  
        }, 'dijkstra');
        
        for(var i = 0; i < links.length; i++){ // высчитываем дальность до банка для каждого линка
            if (findStorage) {
                var rangeTo = links[i].pos.getRangeTo(findStorage);
                links[i].rangeToStorage = rangeTo;
            }
        }
        
        var nearLinkToStorage;
        
        for(var i = 0; i < links.length; i++){ // находим самый ближний линк к банку
            if(i == 0) {
                nearLinkToStorage = links[i];
            } else {
                if (nearLinkToStorage.rangeToStorage > links[i].rangeToStorage) {
                    nearLinkToStorage = links[i];
                }
            }
        }
        
        for(var i = 0; i < links.length; i++){ // перекидываем ремурсы на ближайший линк
            if (nearLinkToStorage.id != links[i].id && links[i].cooldown == 0){
                links[i].transferEnergy(nearLinkToStorage)
            }
        }
    }
};


module.exports = link;