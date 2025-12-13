import { Player } from './base.js';
import { GIF } from '../utils/gif.js';

/**
 * Athena 角色类
 */
export class Athena extends Player {
    constructor(root, info) {
        super(root, info);

        // Athena 自定义跳跃参数（跳得更高，下落更慢）
        this.speedy = -1200;  // 跳跃初始速度（更大的负值 = 跳得更高）
        this.gravity = 40;    // 重力（更小 = 下落更慢）

        this.init_animation();
    }

    init_animation() {
        let outer = this;
        // Athena 各状态动画配置：[offset_y, scale, frame_rate]
        let configs = [
            [30, 1.8, 10],    // 0-待机
            [10, 1.8, 10],    // 1-前进
            [10, 1.8, 10],    // 2-后退
            [-150, 1.8, 15],  // 3-跳跃（往上移动，帧率放慢）
            [30, 1.8, 10],    // 4-攻击
            [30, 1.8, 10],    // 5-受击
            [30, 1.8, 10],    // 6-死亡
        ];

        for (let i = 0; i < 7; i++) {
            let gif = GIF();
            gif.load(`/static/images/player/athena/${i}.gif`);

            this.animations.set(i, {
                gif: gif,
                frame_cnt: 0,
                frame_rate: configs[i][2],
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
