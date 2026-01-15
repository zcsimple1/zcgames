class ClickGame {
    constructor() {
        this.score = 0;
        this.timeLeft = 10.0;
        this.isPlaying = false;
        this.timerInterval = null;
        
        this.clickButton = document.getElementById('clickButton');
        this.startButton = document.getElementById('startButton');
        this.scoreDisplay = document.getElementById('score');
        this.timerDisplay = document.getElementById('timer');
        this.gameArea = document.getElementById('gameArea');
        this.resultArea = document.getElementById('resultArea');
        this.finalScore = document.getElementById('finalScore');
        this.roastText = document.getElementById('roastText');
        this.retryButton = document.getElementById('retryButton');
        this.shareButton = document.getElementById('shareButton');
        this.shareCanvas = document.getElementById('shareCanvas');
        this.qrImage = new Image();
        this.qrImage.src = 'morning.jpg';
        
        this.roasts = [
            { min: 0, text: "手速堪比树懒！你是来度假的吗？" },
            { min: 10, text: "蜗牛都比你快，建议回炉重造！" },
            { min: 20, text: "刚学会用键盘？加油吧少年！" },
            { min: 30, text: "普通人类水平，没什么特别的。" },
            { min: 40, text: "还行吧，至少不是最慢的。" },
            { min: 50, text: "手速还可以，离大神就差一亿步！" },
            { min: 60, text: "不错不错，算是入门了！" },
            { min: 70, text: "手速惊人，职业选手预备役？" },
            { min: 80, text: "这手速！是不是偷偷练过？" },
            { min: 90, text: "传说中的雷电法王？佩服！" },
            { min: 100, text: "手速爆炸！建议去医院看看手！" },
            { min: 120, text: "非人类！你是用脚点的吗？" },
            { min: 150, text: "神级手速！请收下我的膝盖！" }
        ];
        
        this.init();
    }
    
    init() {
        this.clickButton.disabled = true;
        
        this.startButton.addEventListener('click', () => this.startGame());
        this.clickButton.addEventListener('click', () => this.handleClick());
        this.retryButton.addEventListener('click', () => this.resetGame());
        this.shareButton.addEventListener('click', () => this.generateShareImage());
        
        this.clickButton.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.handleClick();
        });
    }
    
    startGame() {
        this.score = 0;
        this.timeLeft = 10.0;
        this.isPlaying = true;
        
        this.scoreDisplay.textContent = '0';
        this.timerDisplay.textContent = '10.0';
        
        this.clickButton.disabled = false;
        this.startButton.disabled = true;
        
        this.timerInterval = setInterval(() => this.updateTimer(), 100);
    }
    
    handleClick() {
        if (!this.isPlaying) return;
        
        this.score++;
        this.scoreDisplay.textContent = this.score;
        
        this.clickButton.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.clickButton.style.transform = 'scale(1)';
        }, 50);
    }
    
    updateTimer() {
        this.timeLeft -= 0.1;
        
        if (this.timeLeft <= 0) {
            this.timeLeft = 0;
            this.endGame();
        }
        
        this.timerDisplay.textContent = this.timeLeft.toFixed(1);
        
        if (this.timeLeft <= 3) {
            this.timerDisplay.style.color = '#ff6b6b';
        }
    }
    
    endGame() {
        this.isPlaying = false;
        clearInterval(this.timerInterval);
        
        this.clickButton.disabled = true;
        
        this.showResult();
    }
    
    showResult() {
        this.gameArea.classList.add('hidden');
        this.resultArea.classList.remove('hidden');
        
        this.finalScore.textContent = this.score;
        
        const roast = this.getRoast(this.score);
        this.roastText.textContent = roast;
    }
    
    getRoast(score) {
        for (let i = this.roasts.length - 1; i >= 0; i--) {
            if (score >= this.roasts[i].min) {
                return this.roasts[i].text;
            }
        }
        return this.roasts[0].text;
    }
    
    resetGame() {
        this.gameArea.classList.remove('hidden');
        this.resultArea.classList.add('hidden');
        
        this.score = 0;
        this.timeLeft = 10.0;
        this.scoreDisplay.textContent = '0';
        this.timerDisplay.textContent = '10.0';
        this.timerDisplay.style.color = 'white';
        
        this.startButton.disabled = false;
    }
    
    generateShareImage() {
        const ctx = this.shareCanvas.getContext('2d');
        this.shareCanvas.width = 800;
        this.shareCanvas.height = 700;
        
        const gradient = ctx.createLinearGradient(0, 0, 800, 700);
        gradient.addColorStop(0, '#667eea');
        gradient.addColorStop(1, '#764ba2');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 800, 700);
        
        ctx.fillStyle = 'white';
        ctx.font = 'bold 48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('点击狂魔：10秒挑战', 400, 80);
        
        ctx.font = 'bold 24px Arial';
        ctx.fillText('我的战绩', 400, 150);
        
        ctx.font = 'bold 120px Arial';
        ctx.fillText(this.score, 400, 280);
        
        ctx.font = '20px Arial';
        ctx.fillText('次点击 / 10秒', 400, 320);
        
        const roast = this.getRoast(this.score);
        ctx.font = '24px Arial';
        ctx.fillText(roast, 400, 400);
        
        ctx.font = '18px Arial';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fillText('扫码关注更多好玩游戏', 400, 460);
        
        try {
            ctx.drawImage(this.qrImage, 300, 490, 200, 200);
        } catch (err) {
            console.log('QR Code image not loaded yet');
            ctx.fillStyle = 'white';
            ctx.font = '16px Arial';
            ctx.fillText('[二维码]', 400, 600);
        }
        
        const dataUrl = this.shareCanvas.toDataURL('image/png');
        
        const link = document.createElement('a');
        link.download = `我的成绩_${this.score}次.png`;
        link.href = dataUrl;
        link.click();
        
        if (navigator.share) {
            try {
                const imageBlob = this.dataURLtoBlob(dataUrl);
                const file = new File([imageBlob], `我的成绩_${this.score}次.png`, { type: 'image/png' });
                
                navigator.share({
                    title: '点击狂魔：10秒挑战',
                    text: `我在《点击狂魔：10秒挑战》中点击了 ${this.score} 次！${roast}`,
                    files: [file]
                }).catch(err => console.log('Share cancelled'));
            } catch (err) {
                console.log('Share API error:', err);
            }
        }
    }
    
    dataURLtoBlob(dataURL) {
        const parts = dataURL.split(',');
        const mime = parts[0].match(/:(.*?);/)[1];
        const bstr = atob(parts[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ClickGame();
});
