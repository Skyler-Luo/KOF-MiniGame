import { Player } from './base.js';
import { GIF } from '../utils/gif.js';

/**
 * Ryo 角色类
 */
export class Ryo extends Player {
    constructor(root, info) {
        super(root, info);
        this.init_animation();
    }

    init_animation() {
        let outer = this;
        // Ryo 各状态动画配置：[offset_y, scale]
        let configs = [
            [0, 2],       // 0-待机
            [-22, 2],     // 1-前进
            [-22, 2],     // 2-后退
            [-140, 2],    // 3-跳跃
            [0, 2],       // 4-攻击
            [0, 2],       // 5-受击
            [0, 2],       // 6-死亡
        ];

        for (let i = 0; i < 7; i++) {
            let gif = GIF();
            gif.load(`/static/images/player/ryo/${i}.gif`);

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
