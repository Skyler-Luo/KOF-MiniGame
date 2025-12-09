import { GameMap } from './game_map/base.js';
import { Kyo } from './player/kyo.js';

/**
 * KOF 游戏主类
 * 负责初始化游戏地图和玩家
 */
// 游戏设计分辨率
const DESIGN_WIDTH = 1280;
const DESIGN_HEIGHT = 720;

class KOF {
    constructor(id) {
        this.$kof = $('#' + id);
        this.game_map = null;
        this.players = [];
        this.selectedMap = 0;
        this.gameStarted = false;
        this.gameEnded = false;

        // 初始化屏幕适配
        this.resize();
        $(window).resize(() => this.resize());

        // 显示开始弹窗
        this.showStartModal();
    }

    /**
     * 屏幕自适应缩放
     */
    resize() {
        const windowWidth = $(window).width();
        const windowHeight = $(window).height();
        const scaleX = windowWidth / DESIGN_WIDTH;
        const scaleY = windowHeight / DESIGN_HEIGHT;
        const scale = Math.min(scaleX, scaleY);

        this.$kof.css({
            transform: `translate(-50%, -50%) scale(${scale})`
        });
    }

    /**
     * 显示开始游戏弹窗
     */
    showStartModal() {
        const mapCount = 6; // 地图数量
        let mapItems = '';
        for (let i = 0; i < mapCount; i++) {
            mapItems += `
                <div class="kof-map-item ${i === 0 ? 'selected' : ''}" 
                     data-map="${i}"
                     style="background-image: url('/static/images/background/${i}.gif')">
                </div>
            `;
        }

        this.$kof.append(`
            <div class="kof-modal-overlay" id="start-modal">
                <div class="kof-modal">
                    <div class="kof-modal-title">🎮 拳皇对战</div>
                    <div class="kof-modal-subtitle">选择地图和角色开始游戏</div>
                    
                    <div class="kof-select-area">
                        <div class="kof-select-label">🗺️ 选择地图</div>
                        <div class="kof-map-grid">${mapItems}</div>
                    </div>
                    
                    <div class="kof-select-area">
                        <div class="kof-select-label">👤 选择角色</div>
                        <div class="kof-character-area">
                            <div class="kof-character-placeholder">
                                角色选择功能开发中...<br>
                                当前默认：玩家1 (Kyo) vs 玩家2 (Kyo)
                            </div>
                        </div>
                    </div>
                    
                    <button class="kof-btn" id="btn-start">开始游戏</button>
                </div>
            </div>
        `);

        // 地图选择事件 - 点击后实时预览背景
        this.$kof.find('.kof-map-item').click((e) => {
            this.$kof.find('.kof-map-item').removeClass('selected');
            $(e.currentTarget).addClass('selected');
            this.selectedMap = $(e.currentTarget).data('map');
            // 实时更新背景预览
            this.$kof.css('background-image', `url('/static/images/background/${this.selectedMap}.gif')`);
        });

        // 开始游戏按钮
        this.$kof.find('#btn-start').click(() => {
            this.startGame();
        });
    }

    /**
     * 开始游戏
     */
    startGame() {
        // 移除开始弹窗
        this.$kof.find('#start-modal').remove();

        // 设置选中的地图背景
        this.$kof.css('background-image', `url('/static/images/background/${this.selectedMap}.gif')`);

        // 初始化游戏地图
        this.game_map = new GameMap(this);

        // 初始化两个玩家
        this.players = [
            new Kyo(this, {
                id: 0,
                x: 200,
                y: 0,
                width: 150,
                height: 200,
                color: 'blue',
            }),
            new Kyo(this, {
                id: 1,
                x: 900,
                y: 0,
                width: 150,
                height: 200,
                color: 'white',
            }),
        ];

        this.gameStarted = true;
        this.gameEnded = false;
    }

    /**
     * 显示游戏结束弹窗
     * @param {string} winner - 'player0', 'player1', 或 'draw'
     */
    showEndModal(winner) {
        if (this.gameEnded) return;
        this.gameEnded = true;

        let resultText, resultClass, detail;
        const [p0, p1] = this.players;

        if (winner === 'player0') {
            resultText = '🏆 玩家1 获胜！';
            resultClass = 'player0';
            detail = `玩家1 剩余血量: ${p0.hp} | 玩家2 剩余血量: ${p1.hp}`;
        } else if (winner === 'player1') {
            resultText = '🏆 玩家2 获胜！';
            resultClass = 'player1';
            detail = `玩家1 剩余血量: ${p0.hp} | 玩家2 剩余血量: ${p1.hp}`;
        } else {
            resultText = '🤝 平局！';
            resultClass = 'draw';
            detail = `双方血量相同: ${p0.hp}`;
        }

        this.$kof.append(`
            <div class="kof-modal-overlay" id="end-modal">
                <div class="kof-modal">
                    <div class="kof-modal-title">游戏结束</div>
                    <div class="kof-result-text ${resultClass}">${resultText}</div>
                    <div class="kof-result-detail">${detail}</div>
                    <button class="kof-btn" id="btn-restart">再来一局</button>
                </div>
            </div>
        `);

        // 再来一局按钮
        this.$kof.find('#btn-restart').click(() => {
            this.restartGame();
        });
    }

    /**
     * 重新开始游戏
     */
    restartGame() {
        // 清空游戏容器
        this.$kof.empty();
        this.$kof.css('background-image', '');

        // 销毁现有对象
        if (this.game_map) {
            this.game_map.destroy();
        }
        for (let player of this.players) {
            player.destroy();
        }

        this.game_map = null;
        this.players = [];
        this.gameStarted = false;
        this.gameEnded = false;

        // 显示开始弹窗
        this.showStartModal();
    }
}

export {
    KOF
}
