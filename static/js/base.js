import { GameMap } from './game_map/base.js';
import { Kyo } from './player/kyo.js';

/**
 * KOF 游戏主类
 * 负责初始化游戏地图和玩家
 */
class KOF {
    constructor(id) {
        this.$kof = $('#' + id);

        // 初始化游戏地图
        this.game_map = new GameMap(this);

        // 初始化两个玩家
        this.players = [
            new Kyo(this, {
                id: 0,
                x: 200,
                y: 0,
                width: 150,
                height: 200,
                color: 'blue',
            }),
            new Kyo(this, {
                id: 1,
                x: 900,
                y: 0,
                width: 150,
                height: 200,
                color: 'white',
            }),
        ];
    }
}

export {
    KOF
}