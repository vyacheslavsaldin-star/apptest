const tg = window.Telegram.WebApp;
tg.expand();

// Игровые переменные
let score = 0;
let clickPower = 1;
let upgradeCost = 15;
let passiveIncome = 0; // На будущее под пассивный доход

// Элементы интерфейса
const scoreDisplay = document.getElementById('score');
const perSecDisplay = document.getElementById('perSec');
const clickBtn = document.getElementById('clickBtn');
const gameArea = document.getElementById('gameArea');
const buyUpgradeBtn = document.getElementById('buyUpgrade');
const upgradeCostDisplay = document.getElementById('upgradeCost');

// Загрузка сохраненного прогресса из памяти телефона
function loadGame() {
    const savedScore = localStorage.getItem('clicker_score');
    const savedPower = localStorage.getItem('clicker_power');
    const savedCost = localStorage.getItem('clicker_cost');

    if (savedScore !== null) score = parseInt(savedScore, 10);
    if (savedPower !== null) clickPower = parseInt(savedPower, 10);
    if (savedCost !== null) upgradeCost = parseInt(savedCost, 10);
    
    updateUI();
}

// Сохранение прогресса
function saveGame() {
    localStorage.setItem('clicker_score', score);
    localStorage.setItem('clicker_power', clickPower);
    localStorage.setItem('clicker_cost', upgradeCost);
}

// Обновление интерфейса на экране
function updateUI() {
    scoreDisplay.textContent = score;
    upgradeCostDisplay.textContent = `🪙 ${upgradeCost}`;
    
    // Активируем или деактивируем кнопку покупки в зависимости от баланса
    if (score >= upgradeCost) {
        buyUpgradeBtn.removeAttribute('disabled');
    } else {
        buyUpgradeBtn.setAttribute('disabled', 'true');
    }
}

// Создание красивой всплывающей цифры при клике
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

// Обработка клика по монете
clickBtn.addEventListener('click', (e) => {
    score += clickPower;
    updateUI();
    saveGame();

    // Вибрация в Telegram
    if (tg.HapticFeedback) {
        tg.HapticFeedback.impactOccurred('light');
    }

    // Анимация вылета цифры в месте касания
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
        upgradeCost = Math.floor(upgradeCost * 1.6); // Каждая покупка дорожает
        
        updateUI();
        saveGame();

        if (tg.HapticFeedback) {
            tg.HapticFeedback.notificationOccurred('success');
        }
    }
});

// Запускаем игру при загрузке
loadGame();

// Автосохранение каждые 5 секунд на всякий случай
setInterval(saveGame, 5000);