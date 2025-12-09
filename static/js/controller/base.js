/**
 * 键盘控制器类
 * 用于监听和管理键盘输入事件
 */
export class Controller {
    constructor($canvas) {
        this.$canvas = $canvas;
        // 使用 Set 存储当前按下的按键，自动去重
        this.pressed_keys = new Set();
        this.bindEvents();
    }

    /**
     * 绑定键盘事件
     */
    bindEvents() {
        let outer = this;

        // 按键按下事件：将按键名添加到 pressed_keys 集合中
        this.$canvas.keydown(function (e) {
            outer.pressed_keys.add(e.key);
        });

        // 按键释放事件：从 pressed_keys 集合中移除对应的键
        this.$canvas.keyup(function (e) {
            outer.pressed_keys.delete(e.key);
        });
    }
}
