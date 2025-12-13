import { GameMap } from './game_map/base.js';
import { Kyo } from './player/kyo.js';
import { Goro } from './player/goro.js';
import { Ryo } from './player/ryo.js';
import { Iori } from './player/iori.js';
import { Athena } from './player/athena.js';

/**
 * KOF 游戏主类
 * 负责初始化游戏地图和玩家
 */
// 游戏设计分辨率
const DESIGN_WIDTH = 1280;
const DESIGN_HEIGHT = 720;

// 角色配置
const CHARACTERS = [
    { id: 'kyo', name: 'Kyo', class: Kyo },
    { id: 'iori', name: 'Iori', class: Iori },
    { id: 'athena', name: 'Athena', class: Athena },
    { id: 'goro', name: 'Goro', class: Goro },
    { id: 'ryo', name: 'Ryo', class: Ryo },
];

class KOF {
    constructor(id) {
        this.$kof = $('#' + id);
        this.game_map = null;
        this.players = [];
        this.selectedMap = 0;
        this.selectedCharacters = [0, 1]; // 玩家1和玩家2选择的角色索引
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

        // 生成角色选择项
        let characterItems = '';
        CHARACTERS.forEach((char, index) => {
            characterItems += `
                <div class="kof-character-item" data-char="${index}">
                    <div class="kof-character-avatar" 
                         style="background-image: url('/static/images/player/${char.id}/0.gif')">
                    </div>
                    <div class="kof-character-name">${char.name}</div>
                </div>
            `;
        });

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
                        <div class="kof-character-select">
                            <div class="kof-player-select">
                                <div class="kof-player-label player0">玩家1 (WASD + 空格)</div>
                                <div class="kof-character-grid" id="player0-chars">
                                    ${characterItems}
                                </div>
                            </div>
                            <div class="kof-vs-divider">VS</div>
                            <div class="kof-player-select">
                                <div class="kof-player-label player1">玩家2 (方向键 + Enter)</div>
                                <div class="kof-character-grid" id="player1-chars">
                                    ${characterItems}
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <button class="kof-btn" id="btn-start">开始游戏</button>
                </div>
            </div>
        `);

        // 初始化角色选择状态
        this.$kof.find('#player0-chars .kof-character-item').eq(this.selectedCharacters[0]).addClass('selected');
        this.$kof.find('#player1-chars .kof-character-item').eq(this.selectedCharacters[1]).addClass('selected');

        // 地图选择事件
        this.$kof.find('.kof-map-item').click((e) => {
            this.$kof.find('.kof-map-item').removeClass('selected');
            $(e.currentTarget).addClass('selected');
            this.selectedMap = $(e.currentTarget).data('map');
            this.$kof.css('background-image', `url('/static/images/background/${this.selectedMap}.gif')`);
        });

        // 玩家1角色选择
        this.$kof.find('#player0-chars .kof-character-item').click((e) => {
            this.$kof.find('#player0-chars .kof-character-item').removeClass('selected');
            $(e.currentTarget).addClass('selected');
            this.selectedCharacters[0] = $(e.currentTarget).data('char');
        });

        // 玩家2角色选择
        this.$kof.find('#player1-chars .kof-character-item').click((e) => {
            this.$kof.find('#player1-chars .kof-character-item').removeClass('selected');
            $(e.currentTarget).addClass('selected');
            this.selectedCharacters[1] = $(e.currentTarget).data('char');
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

        // 获取选中的角色类
        const Player0Class = CHARACTERS[this.selectedCharacters[0]].class;
        const Player1Class = CHARACTERS[this.selectedCharacters[1]].class;

        // 初始化两个玩家
        this.players = [
            new Player0Class(this, {
                id: 0,
                x: 200,
                y: 0,
                width: 150,
                height: 200,
                color: 'blue',
            }),
            new Player1Class(this, {
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
     */
    showEndModal(winner) {
        if (this.gameEnded) return;
        this.gameEnded = true;

        let resultText, resultClass, detail;
        const [p0, p1] = this.players;
        const char0Name = CHARACTERS[this.selectedCharacters[0]].name;
        const char1Name = CHARACTERS[this.selectedCharacters[1]].name;

        if (winner === 'player0') {
            resultText = `🏆 玩家1 (${char0Name}) 获胜！`;
            resultClass = 'player0';
            detail = `${char0Name} 剩余血量: ${p0.hp} | ${char1Name} 剩余血量: ${p1.hp}`;
        } else if (winner === 'player1') {
            resultText = `🏆 玩家2 (${char1Name}) 获胜！`;
            resultClass = 'player1';
            detail = `${char0Name} 剩余血量: ${p0.hp} | ${char1Name} 剩余血量: ${p1.hp}`;
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

        this.$kof.find('#btn-restart').click(() => {
            this.restartGame();
        });
    }

    /**
     * 重新开始游戏
     */
    restartGame() {
        this.$kof.empty();
        this.$kof.css('background-image', '');

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

        this.showStartModal();
    }
}

export {
    KOF
}
