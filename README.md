# 🎮 KOF-MiniGame

**一个拳皇双人对战小游戏** 👊

## 🛠️ 技术栈

[![HTML5](https://img.shields.io/badge/HTML5-Canvas-orange.svg)](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
[![CSS3](https://img.shields.io/badge/CSS3-Styling-blue.svg)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6-yellow.svg)](https://www.ecma-international.org/ecma-262/6.0/)
[![jQuery](https://img.shields.io/badge/jQuery-3.x-blue.svg)](https://jquery.com/)

## 📸 游戏截图

<div align="center">
  <img src="image.png" alt="游戏截图" width="800"/>
</div>

## ✨ 功能特性

| 特性 | 描述 |
|:---:|:---|
| 🕹️ | 双人本地对战，和朋友一起玩 |
| 🎨 | GIF 动画角色渲染，流畅的战斗动作 |
| ⏱️ | 60秒倒计时，紧张刺激 |
| ❤️ | 血条系统，实时显示战斗状态 |

## 🎯 操作说明

| 操作 | 🎮 玩家1 | 🎮 玩家2 |
|:----:|:-------:|:-------:|
| ⬆️ 跳跃 | `W` | `↑` |
| ⬅️ 左移 | `A` | `←` |
| ➡️ 右移 | `D` | `→` |
| 👊 攻击 | `Space` | `Enter` |

## 🚀 快速开始

```bash
# 1. 克隆项目
git clone https://github.com/Skyler-Luo/KOF-MiniGame.git

# 2. 进入项目目录
cd KOF-MiniGame

# 3. 使用 VS Code Live Server 插件运行 templates/index.html
# 4. 在浏览器中开始游戏
```

## 📁 项目结构

```
KOF-MiniGame/
├── 📂 static/
│   ├── 📂 css/
│   │   └── 📄 base.css          # 基础样式
│   ├── 📂 js/
│   │   ├── 📄 base.js           # 游戏主入口
│   │   ├── 📂 game_object/
│   │   │   └── 📄 base.js       # 游戏对象基类
│   │   ├── 📂 controller/
│   │   │   └── 📄 base.js       # 键盘控制器
│   │   ├── 📂 game_map/
│   │   │   └── 📄 base.js       # 游戏地图
│   │   ├── 📂 player/
│   │   │   ├── 📄 base.js       # 玩家基类
│   │   │   ├── 📄 athena.js     # 角色：雅典娜
│   │   │   ├── 📄 goro.js       # 角色：大门五郎
│   │   │   ├── 📄 iori.js       # 角色：八神庵
│   │   │   ├── 📄 kyo.js        # 角色：草薙京
│   │   │   └── 📄 ryo.js        # 角色：坂崎良
│   │   └── 📂 utils/
│   │       └── 📄 gif.js        # GIF工具类
│   └── 📂 images/               # 图片资源
├── 📂 templates/
│   └── 📄 index.html            # 游戏入口页面
└── 📄 README.md
```

## 📝 License

本项目采用 [MIT License](LICENSE) 开源协议

---

<div align="center">

⭐ **如果觉得不错，欢迎 Star！** ⭐

🌸 Created by [宇翊](https://github.com/Skyler-Luo) & [0033](https://github.com/zhangyw24) 🌸

</div>
