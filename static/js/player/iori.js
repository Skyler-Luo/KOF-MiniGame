import { Player } from './base.js';
import { GIF } from '../utils/gif.js';

/**
 * Iori 角色类
 */
export class Iori extends Player {
    constructor(root, info) {
        super(root, info);
        this.attack_hit_frames = [18, 30]; // Iori 两次攻击判定的帧
        this.attack_damage = 10; // 每次伤害10，两次共20
        this.init_animation();
    }

    /**
     * 重写攻击检测，实现两次伤害
     */
    update_attack() {
        if (this.status === 4) {
            for (let hitFrame of this.attack_hit_frames) {
                if (this.frame_current_cnt === hitFrame) {
                    let me = this;
                    let you = this.root.players[1 - this.id];

                    let r1;
                    if (this.direction > 0) {
                        r1 = {
                            x1: me.x + 120,
                            y1: me.y + 43,
                            x2: me.x + 120 + 100,
                            y2: me.y + 43 + 20,
                        };
                    } else {
                        r1 = {
                            x1: me.x - 100,
                            y1: me.y + 43,
                            x2: me.x,
                            y2: me.y + 43 + 20,
                        };
                    }

                    let r2 = {
                        x1: you.x,
                        y1: you.y,
                        x2: you.x + you.width,
                        y2: you.y + you.height,
                    };

                    if (this.is_collision(r1, r2)) {
                        you.is_attack(this.attack_damage);
                    }
                    break;
                }
            }
        }
    }

    init_animation() {
        let outer = this;
        // Iori 各状态动画配置：[offset_y, scale]
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
            gif.load(`/static/images/player/Iori/${i}.gif`);

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
