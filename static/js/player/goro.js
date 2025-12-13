import { Player } from './base.js';
import { GIF } from '../utils/gif.js';

/**
 * Goro 角色类
 */
export class Goro extends Player {
    constructor(root, info) {
        super(root, info);
        this.init_animation();
    }

    init_animation() {
        let outer = this;
        // Goro 各状态动画配置：[offset_y, scale]
        let configs = [
            [20, 1.5],    // 0-待机
            [0, 1.5],     // 1-前进
            [0, 1.5],     // 2-后退
            [-120, 1.5],  // 3-跳跃
            [20, 1.5],    // 4-攻击
            [20, 1.5],    // 5-受击
            [20, 1.5],    // 6-死亡
        ];

        for (let i = 0; i < 7; i++) {
            let gif = GIF();
            gif.load(`/static/images/player/goro/${i}.gif`);

            this.animations.set(i, {
                gif: gif,
                frame_cnt: 0,
                frame_rate: 10,
                offset_y: configs[i][0],
                loaded: false,
                scale: configs[i][1],
            });

            gif.onload = function () {
                let obj = outer.animations.get(i);
                obj.frame_cnt = gif.frames.length;
                obj.loaded = true;
            };
        }
    }
}
