import { Player } from './base.js';
import { GIF } from '../utils/gif.js';

/**
 * Kyo 角色类
 * 继承自 Player，定义 Kyo 角色的动画资源
 */
export class Kyo extends Player {
    constructor(root, info) {
        super(root, info);
        this.init_animation();
    }

    /**
     * 初始化角色动画
     * 加载各状态对应的 GIF 动画资源
     */
    init_animation() {
        let outer = this;
        // 各状态动画的 Y 轴偏移量
        let offsets = [0, -22, -22, -140, 0, 0, 0];

        for (let i = 0; i < 7; i++) {
            let gif = GIF();
            gif.load(`/static/images/player/kyo/${i}.gif`);

            this.animations.set(i, {
                gif: gif,
                frame_cnt: 0,       // 动画帧数
                frame_rate: 10,     // 帧率（每 N 帧切换一次动画帧）
                offset_y: offsets[i], // Y 轴偏移量
                loaded: false,      // 是否加载完成
                scale: 2,           // 缩放比例
            });

            gif.onload = function () {
                let obj = outer.animations.get(i);
                obj.frame_cnt = gif.frames.length;
                obj.loaded = true;
            };
        }
    }
}
