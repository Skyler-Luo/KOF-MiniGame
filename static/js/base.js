import { GameMap } from '/KOF-MiniGame/static/js/game_map/base.js';
import { Kyo } from '/KOF-MiniGame/static/js/player/kyo.js';

class KOF{
    constructor(id){
        this.$kof = $('#' + id);
        
        this.game_map = new GameMap(this);
        this.players = [
            new Kyo(this, {
                id:0,
                x:200,
                y:0,
                width: 150,
                height:200,
                color:'blue',
            }),
            new Kyo(this, {
                id: 1,
                x: 500,
                y: 0,
                width: 150,
                height: 200,
                color: 'white',
            }),

        ];

    }
}

export{
    KOF
}