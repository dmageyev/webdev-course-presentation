/* ================================================
   JavaScript для інтерактивної презентації
   ================================================ */

// Ініціалізація Reveal.js
Reveal.initialize({
  controls: true,
  progress: true,
  center: true,
  hash: true,
  transition: 'slide',
  slideNumber: true,
  
  // Розмір презентації для 1920x1080
  width: 1920,
  height: 1080,
  margin: 0.04,
  
  // Плагіни
  plugins: [RevealHighlight]
});

// ================================================
// ТАЙМЕР ДЛЯ ПЕРЕРВИ (Слайд 20)
// ================================================

let countdown;
let timeLeft = 120; // 2 хвилини в секундах
let timerStarted = false;

function startTimer() {
  const display = document.getElementById('timer-display');
  
  if (!display) return;
  
  // Скидаємо таймер при повторному запуску
  if (timerStarted) {
    clearInterval(countdown);
    timeLeft = 120;
  }
  
  timerStarted = true;
  
  countdown = setInterval(() => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    
    display.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    
    // Зміна кольору при залишку < 30 сек
    if (timeLeft < 30) {
      display.classList.add('warning');
    } else {
      display.classList.remove('warning');
    }
    
    if (timeLeft === 0) {
      clearInterval(countdown);
      display.textContent = "Час вийшов! 🎉";
      playSound();
      timerStarted = false;
    }
    
    timeLeft--;
  }, 1000);
}

function stopTimer() {
  if (countdown) {
    clearInterval(countdown);
  }
  timeLeft = 120;
  timerStarted = false;
}

// Опціональний звуковий сигнал
function playSound() {
  // Створюємо простий beep звук
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.frequency.value = 800;
  oscillator.type = 'sine';
  
  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
  
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.5);
}

// ================================================
// АВТОЗАПУСК ТАЙМЕРА НА СЛАЙДІ ПЕРЕРВИ
// ================================================

Reveal.on('slidechanged', event => {
  // Слайд 20 - перерва (індекс 19, бо рахунок з 0)
  if (event.indexh === 19) {
    // Затримка перед запуском для кращого UX
    setTimeout(() => {
      startTimer();
    }, 500);
  } else {
    // Зупинити таймер на інших слайдах
    stopTimer();
  }
  
  // Слайд 15 - відповідь на вікторину (індекс 14)
  if (event.indexh === 14) {
    setTimeout(() => {
      showConfetti();
    }, 500);
  }
  
  // Слайд 25 - завершення (індекс 24)
  if (event.indexh === 24) {
    setTimeout(() => {
      showConfetti();
    }, 500);
  }
});

// ================================================
// КОНФЕТІ ДЛЯ ВІКТОРИНИ ТА ЗАВЕРШЕННЯ
// ================================================

function showConfetti() {
  // Перевірка чи бібліотека canvas-confetti завантажена
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#4285F4', '#34A853', '#FBBC04', '#EA4335']
    });
    
    // Додатковий вибух через півсекунди
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#4285F4', '#34A853', '#FBBC04', '#EA4335']
      });
    }, 250);
    
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#4285F4', '#34A853', '#FBBC04', '#EA4335']
      });
    }, 400);
  }
}

// ================================================
// ПІДСВІТКА СИНТАКСИСУ (Highlight.js)
// ================================================

document.addEventListener('DOMContentLoaded', (event) => {
  // Автоматично підсвічує всі <code> блоки
  if (typeof hljs !== 'undefined') {
    document.querySelectorAll('pre code').forEach((block) => {
      hljs.highlightElement(block);
    });
  }
});

// ================================================
// ІНТЕРАКТИВНІСТЬ ВІКТОРИНИ (опціонально)
// ================================================

// Додавання обробників для варіантів відповідей
document.addEventListener('DOMContentLoaded', () => {
  const quizOptions = document.querySelectorAll('.quiz-option');
  
  quizOptions.forEach(option => {
    option.addEventListener('click', function() {
      // Видаляємо попередні вибори
      quizOptions.forEach(opt => opt.style.background = '');
      
      // Підсвічуємо вибраний варіант
      this.style.background = '#4285F4';
      this.style.color = '#FFFFFF';
    });
  });
});

// ================================================
// ДОДАТКОВІ КОРИСНІ ФУНКЦІЇ
// ================================================

// Клавіатурні скорочення
document.addEventListener('keydown', (event) => {
  // Ctrl/Cmd + T - запуск таймера вручну
  if ((event.ctrlKey || event.metaKey) && event.key === 't') {
    event.preventDefault();
    startTimer();
  }
});

// Логування для відлагодження
console.log('🚀 Презентація HTML курсу завантажена!');
console.log('📍 Використовуйте стрілки для навігації');
console.log('⏱️ Таймер автоматично запуститься на слайді перерви');
console.log('🎉 Confetti з\'явиться на слайдах вікторини та завершення');
