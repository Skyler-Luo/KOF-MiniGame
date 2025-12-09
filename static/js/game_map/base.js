import { AcGameObject } from '../ac_game_object/base.js';
import { Controller } from '../controller/base.js';

// 游戏设计分辨率
const DESIGN_WIDTH = 1280;
const DESIGN_HEIGHT = 720;

/**
 * 游戏地图类
 * 负责管理游戏画布、计时器和整体渲染
 */
class GameMap extends AcGameObject {
    constructor(root) {
        super();

        this.root = root;

        // 创建画布元素，tabindex=0 使其可以获得焦点以接收键盘输入
        this.$canvas = $(`<canvas width="${DESIGN_WIDTH}" height="${DESIGN_HEIGHT}" tabindex="0"></canvas>`);
        this.ctx = this.$canvas[0].getContext('2d');
        this.root.$kof.append(this.$canvas);
        this.$canvas.focus();

        // 初始化键盘控制器
        this.controller = new Controller(this.$canvas);

        // 添加游戏头部 UI：玩家0血条、计时器、玩家1血条
        this.root.$kof.append(`
            <div class="kof-head">
                <div class="kof-head-hp-0"><div><div></div></div></div>
                <div class="kof-head-timer">60</div>
                <div class="kof-head-hp-1"><div><div></div></div></div>
            </div>
        `);

        // 初始化游戏计时器（单位：毫秒）
        this.time_left = 60000;
        this.$timer = this.root.$kof.find('.kof-head-timer');

        // 初始化屏幕适配
        this.resize();
        // 监听窗口大小变化
        $(window).resize(() => this.resize());
    }

    /**
     * 屏幕自适应缩放
     * 根据窗口大小计算缩放比例，保持 16:9 比例居中显示
     */
    resize() {
        const windowWidth = $(window).width();
        const windowHeight = $(window).height();

        // 计算缩放比例，取宽高比例的较小值以保证完整显示
        const scaleX = windowWidth / DESIGN_WIDTH;
        const scaleY = windowHeight / DESIGN_HEIGHT;
        const scale = Math.min(scaleX, scaleY);

        // 应用缩放和居中
        this.root.$kof.css({
            transform: `translate(-50%, -50%) scale(${scale})`
        });
    }

    start() {

    }

    update() {
        // 更新剩余时间
        this.time_left -= this.timedelta;

        if (this.time_left < 0) {
            this.time_left = 0;

            // 时间结束时，将双方玩家设置为死亡状态
            let [a, b] = this.root.players;
            if (a.status !== 6 && b.status !== 6) {
                a.status = b.status = 6;
                a.frame_current_cnt = b.frame_current_cnt = 0;
                a.vx = b.vx = 0;
            }
        }

        // 更新计时器显示
        this.$timer.text(parseInt(this.time_left / 1000));

        this.render();
    }

    /**
     * 渲染方法：清空画布，为下一帧做准备
     */
    render() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }
}

export {
    GameMap
};
