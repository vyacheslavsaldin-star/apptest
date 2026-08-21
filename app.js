const tg = window.Telegram.WebApp;
tg.expand();

// Игровые переменные (всегда приводим к числу)
let score = parseInt(localStorage.getItem('clicker_score')) || 0;
let clickPower = parseInt(localStorage.getItem('clicker_power')) || 1;
let upgradeCost = parseInt(localStorage.getItem('clicker_cost')) || 15;

// Элементы интерфейса
const scoreDisplay = document.getElementById('score');
const perSecDisplay = document.getElementById('perSec');
const clickBtn = document.getElementById('clickBtn');
const gameArea = document.getElementById('gameArea');
const buyUpgradeBtn = document.getElementById('buyUpgrade');
const upgradeCostDisplay = document.getElementById('upgradeCost');

// Сохранение прогресса
function saveGame() {
    localStorage.setItem('clicker_score', score);
    localStorage.setItem('clicker_power', clickPower);
    localStorage.setItem('clicker_cost', upgradeCost);
}

// Обновление интерфейса
function updateUI() {
    scoreDisplay.textContent = score;
    upgradeCostDisplay.textContent = `🪙 ${upgradeCost}`;
    
    // Жесткая проверка: оба значения точно числа
    if (Number(score) >= Number(upgradeCost)) {
        buyUpgradeBtn.removeAttribute('disabled');
        buyUpgradeBtn.style.opacity = '1';
        buyUpgradeBtn.style.cursor = 'pointer';
    } else {
        buyUpgradeBtn.setAttribute('disabled', 'true');
        buyUpgradeBtn.style.opacity = '0.4';
        buyUpgradeBtn.style.cursor = 'not-allowed';
    }
}

// Всплывающая цифра
function createFloatingNumber(x, y, text) {
    const el = document.createElement('div');
    el.className = 'floating-num';
    el.textContent = text;
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    gameArea.appendChild(el);

    setTimeout(() => {
        el.remove();
    }, 800);
}

// Клик по монете
clickBtn.addEventListener('click', (e) => {
    score += clickPower;
    updateUI();
    saveGame();

    if (tg.HapticFeedback) {
        tg.HapticFeedback.impactOccurred('light');
    }

    const rect = clickBtn.getBoundingClientRect();
    const x = e.clientX - rect.left - 20;
    const y = e.clientY - rect.top - 20;
    createFloatingNumber(x, y, `+${clickPower}`);
});

// Покупка улучшения
buyUpgradeBtn.addEventListener('click', () => {
    if (score >= upgradeCost) {
        score -= upgradeCost;
        clickPower += 1;
        upgradeCost = Math.floor(upgradeCost * 1.6);
        
        updateUI();
        saveGame();

        if (tg.HapticFeedback) {
            tg.HapticFeedback.notificationOccurred('success');
        }
    }
});

// Первый запуск интерфейса при открытии
updateUI();

// Автосохранение
setInterval(saveGame, 5000);
