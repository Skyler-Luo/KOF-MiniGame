//该文件用来控制输入，键盘输入
export class Controller{
    constructor($canvas){
        this.$canvas = $canvas;
        //存储当时在键盘上按下的键。然后set可以进行去重
        this.pressed_keys = new Set();
        this.start();
    }


    start() {
        //保留了外部的this引用
        let outer = this;
        //按键按下。当按键按下时，将按键名添加到pressed_keys集合中
        this.$canvas.keydown(function (e) {
            outer.pressed_keys.add(e.key);
        });
        //按键释放。当按键释放时，从pressed_keys集合中移除对应的键
        this.$canvas.keyup(function (e) {
            outer.pressed_keys.delete(e.key);
        });
    }
};
