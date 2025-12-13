import { AcGameObject } from '../game_object/base.js';

/**
 * 玩家基类
 * 定义玩家的基本属性、移动、攻击和渲染逻辑
 */
export class Player extends AcGameObject {
    constructor(root, info) {
        super();

        // 基本属性
        this.root = root;           // 游戏根对象
        this.id = info.id;          // 玩家 ID（0 或 1）
        this.x = info.x;            // X 坐标
        this.y = info.y;            // Y 坐标
        this.width = info.width;    // 宽度
        this.height = info.height;  // 高度
        this.color = info.color;    // 颜色

        // 移动属性
        this.direction = 1;         // 朝向（1: 右, -1: 左）
        this.vx = 0;                // X 轴速度
        this.vy = 0;                // Y 轴速度
        this.speedx = 400;          // 水平移动速度
        this.speedy = -1000;        // 跳跃初始速度
        this.gravity = 50;          // 重力加速度

        // 引用
        this.ctx = this.root.game_map.ctx;
        this.pressed_keys = this.root.game_map.controller.pressed_keys;

        // 状态：0-待机, 1-前进, 2-后退, 3-跳跃, 4-攻击, 5-受击, 6-死亡
        this.status = 3;
        this.animations = new Map();    // 存储各状态的动画
        this.frame_current_cnt = 0;     // 当前帧计数

        // 生命值
        this.hp = 100;
        this.$hp = this.root.$kof.find(`.kof-head-hp-${this.id}>div`);
        this.$hp_div = this.$hp.find('div');
    }

    start() {

    }

    /**
     * 处理玩家控制输入
     */
    update_control() {
        let w, a, d, space;

        // 根据玩家 ID 分配不同的按键
        if (this.id === 0) {
            w = this.pressed_keys.has('w');
            a = this.pressed_keys.has('a');
            d = this.pressed_keys.has('d');
            space = this.pressed_keys.has(' ');
        } else {
            w = this.pressed_keys.has('ArrowUp');
            a = this.pressed_keys.has('ArrowLeft');
            d = this.pressed_keys.has('ArrowRight');
            space = this.pressed_keys.has('Enter');
        }

        // 状态转换逻辑
        if (this.status === 0 || this.status === 1) {
            if (space) {
                // 攻击
                this.status = 4;
                this.vx = 0;
                this.frame_current_cnt = 0;
            } else if (w) {
                // 跳跃（可同时左右移动）
                if (d) {
                    this.vx = this.speedx;
                } else if (a) {
                    this.vx = -this.speedx;
                } else {
                    this.vx = 0;
                }
                this.vy = this.speedy;
                this.status = 3;
                this.frame_current_cnt = 0;
            } else if (d) {
                // 右移
                this.vx = this.speedx;
                this.status = 1;
            } else if (a) {
                // 左移
                this.vx = -this.speedx;
                this.status = 1;
            } else {
                // 待机
                this.status = 0;
                this.vx = 0;
            }
        }
    }

    /**
     * 更新玩家位置
     */
    update_move() {
        // 应用重力
        this.vy += this.gravity;
        this.x += this.vx * this.timedelta / 1000;
        this.y += this.vy * this.timedelta / 1000;

        // 地面碰撞检测
        if (this.y > 450) {
            this.y = 450;
            this.vy = 0;
            if (this.status === 3) {
                this.status = 0;
            }
        }

        // 边界检测
        if (this.x < 0) {
            this.x = 0;
        } else if (this.x + this.width > this.root.game_map.$canvas.width()) {
            this.x = this.root.game_map.$canvas.width() - this.width;
        }
    }

    /**
     * 更新玩家朝向
     */
    update_direction() {
        if (this.status === 6) return;

        let players = this.root.players;
        if (players[0] && players[1]) {
            let me = this;
            let you = players[1 - this.id];
            // 根据对手位置调整朝向
            me.direction = (me.x < you.x) ? 1 : -1;
        }
    }

    /**
     * 处理被攻击
     * @param {number} damage - 伤害值，默认20
     */
    is_attack(damage = 20) {
        if (this.status === 6) return;

        this.status = 5;
        this.frame_current_cnt = 0;
        this.hp = Math.max(this.hp - damage, 0);

        // 血条动画
        this.$hp_div.animate({
            width: this.$hp.parent().width() * this.hp / 100,
        }, 300);

        this.$hp.animate({
            width: this.$hp.parent().width() * this.hp / 100,
        }, 600);

        // 死亡判断
        if (this.hp === 0) {
            this.status = 6;
            this.frame_current_cnt = 0;
            this.vx = 0;
        }
    }

    /**
     * 检测两个矩形是否碰撞
     * @param {Object} r1 - 矩形1 {x1, y1, x2, y2}
     * @param {Object} r2 - 矩形2 {x1, y1, x2, y2}
     * @returns {boolean} 是否碰撞
     */
    is_collision(r1, r2) {
        if (Math.max(r1.x1, r2.x1) > Math.min(r1.x2, r2.x2)) return false;
        if (Math.max(r1.y1, r2.y1) > Math.min(r1.y2, r2.y2)) return false;
        return true;
    }

    /**
     * 更新攻击检测
     */
    update_attack() {
        // 在攻击动画的特定帧检测碰撞
        if (this.status === 4 && this.frame_current_cnt === 18) {
            let me = this;
            let you = this.root.players[1 - this.id];

            // 创建攻击区域矩形
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

            // 对手碰撞区域
            let r2 = {
                x1: you.x,
                y1: you.y,
                x2: you.x + you.width,
                y2: you.y + you.height,
            };

            // 检测碰撞
            if (this.is_collision(r1, r2)) {
                you.is_attack();
            }
        }
    }

    update() {
        this.update_control();
        this.update_move();
        this.update_direction();
        this.update_attack();
        this.render();
    }

    /**
     * 渲染玩家
     */
    render() {
        let status = this.status;

        // 后退状态判断
        if (status === 1 && this.direction * this.vx < 0) {
            status = 2;
        }

        let obj = this.animations.get(status);
        if (obj && obj.loaded) {
            let k = parseInt(this.frame_current_cnt / obj.frame_rate) % obj.frame_cnt;
            let image = obj.gif.frames[k].image;

            if (this.direction > 0) {
                // 朝右渲染
                this.ctx.drawImage(
                    image,
                    this.x,
                    this.y + obj.offset_y,
                    image.width * obj.scale,
                    image.height * obj.scale
                );
            } else {
                // 朝左渲染（水平翻转）
                this.ctx.save();
                this.ctx.scale(-1, 1);
                this.ctx.translate(-this.root.game_map.$canvas.width(), 0);

                this.ctx.drawImage(
                    image,
                    this.root.game_map.$canvas.width() - this.x - this.width,
                    this.y + obj.offset_y,
                    image.width * obj.scale,
                    image.height * obj.scale
                );

                this.ctx.restore();
            }
        }

        // 特殊状态动画结束处理
        if (status === 4 || status === 5 || status === 6) {
            if (obj && this.frame_current_cnt === obj.frame_rate * (obj.frame_cnt - 1)) {
                if (status === 6) {
                    // 死亡状态保持最后一帧
                    this.frame_current_cnt--;
                } else {
                    // 回到待机状态
                    this.status = 0;
                }
            }
        }

        this.frame_current_cnt++;
    }
}
