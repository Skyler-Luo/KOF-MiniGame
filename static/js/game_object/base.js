/**
 * 游戏对象基类
 * 用于管理所有游戏对象的生命周期和帧更新
 */

// 全局游戏对象数组，存储所有需要更新的游戏对象
let GAME_OBJECTS = [];

class AcGameObject {
    constructor() {
        // 将新创建的对象自动加入全局数组
        GAME_OBJECTS.push(this);

        this.timedelta = 0; // 当前帧与上一帧的时间间隔（毫秒）
        this.has_call_start = false; // 标记 start 方法是否已被调用
    }

    /**
     * 初始化方法，仅在第一帧执行一次
     */
    start() {

    }

    /**
     * 更新方法，每一帧执行一次（第一帧除外）
     */
    update() {

    }

    /**
     * 销毁当前对象，从全局数组中移除
     */
    destroy() {
        for (let i in GAME_OBJECTS) {
            if (GAME_OBJECTS[i] === this) {
                GAME_OBJECTS.splice(i, 1);
                break;
            }
        }
    }
}

// 记录上一帧的时间戳
let last_timestamp;

/**
 * 游戏主循环，使用 requestAnimationFrame 实现动画
 * @param {number} timestamp - 当前帧的时间戳
 */
let GAME_OBJECTS_FRAME = (timestamp) => {
    for (let obj of GAME_OBJECTS) {
        if (!obj.has_call_start) {
            // 首次执行初始化
            obj.start();
            obj.has_call_start = true;
        } else {
            // 计算帧间隔时间并更新
            obj.timedelta = timestamp - last_timestamp;
            obj.update();
        }
    }

    last_timestamp = timestamp;
    requestAnimationFrame(GAME_OBJECTS_FRAME);
};

// 启动游戏主循环
requestAnimationFrame(GAME_OBJECTS_FRAME);

export {
    AcGameObject
}
