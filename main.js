var creepsManager = require('creeps');
var spawn         = require('spawn');
var tower         = require('tower');


module.exports.loop = function() {
    spawn.run();
    tower.run();
    creepsManager.run();
    
    // todo сделать заполнение контейнеров только тогда когда некто не регенит себе хп
    // 
    /* todo авто билд
    
        строительство турелей {     
            сканиурем карты и выбираем все точки где более 3х сторон со стенами 
            строим из каждой точки путь по алгоритму поиска пути
            выбираем минимальный по стоимости путь
            строим там турель
        }
        
        строительство банка {
            смотрим вокруг спавна клеточки с радлиусом 1
            незаяных клеток >=3 {
                строим на однои из них банк
                на соседнем линк
            } else {
                смотрим вокруг спавна клеточки с радлиусом 2
                незаяных клеток >=3 {
                    строим на однои из них банк
                    на соседнем линк
                }
            }
        }
        
        обновление ящиков на линки {
            смотрим линк у банка
            
            if доступен линк для строитества > 0 || у банка есть линк{
                for (сюрс := range сюрсы) {
                    строительство линков и ящиков у сюрсов(сюрс)
                }
            }
        }
        
        строительство линков и ящиков у сюрсов (СЮРС) {
            смотрим есть ли линки или ящики вкруг сюрса в радиусе 2х клеток
            
            if есть ящик && доступен линк {
                удаляем ящик
                строим в первой доуступной клетке линк
            }
            
            if !есть ящик && !доступен линк {
                строим ящик
            }

            if есть линк || (есть ящик && !(доступен линк)) {
                return
            }
        }
    
        строительство генераторов {
            //todo
        }
        
    */
}