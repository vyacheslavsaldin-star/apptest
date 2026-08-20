// Инициализация Telegram Web App
const tg = window.Telegram.WebApp;
tg.expand(); // Разворачиваем на весь экран

let score = 0;

const scoreDisplay = document.getElementById('score');
const clickBtn = document.getElementById('clickBtn');

// Обработка клика по монете
clickBtn.addEventListener('click', () => {
    score += 1;
    scoreDisplay.textContent = score;

    // Вибрация при клике (если поддерживается телефоном)
    if (tg.HapticFeedback) {
        tg.HapticFeedback.impactOccurred('light');
    }
});