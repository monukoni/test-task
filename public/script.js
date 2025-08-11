document.addEventListener('DOMContentLoaded', function() {
    const body = document.body;
    const envTitle = document.getElementById('envTitle');
    const envInfo = document.getElementById('envInfo');
    const greenBtn = document.getElementById('greenBtn');
    const purpleBtn = document.getElementById('purpleBtn');
    const yellowBtn = document.getElementById('yellowBtn');
    const blueBtn = document.getElementById('blueBtn');
    const defaultBtn = document.getElementById('defaultBtn');
    const autoBtn = document.getElementById('autoBtn');

    let currentEnvData = null;

    // Функція для отримання інформації про середовище
    async function getEnvInfo() {
        try {
            const response = await fetch('/api/env-info');
            const data = await response.json();
            currentEnvData = data;
            
            // Оновлюємо заголовок з NODE_ENV
            envTitle.textContent = data.nodeEnv.toUpperCase();
            
            const envNames = {
                'development': 'Розробка',
                'production': 'Продакшн',
                'staging': 'Тестування',
                'test': 'Тести'
            };
            
            const colorNames = {
                'green': 'зелений',
                'purple': 'фіолетовий',
                'yellow': 'жовтий',
                'blue': 'синій',
                'default': 'за замовчуванням'
            };
            
            envInfo.textContent = `Середовище: ${envNames[data.nodeEnv] || data.nodeEnv} (колір: ${colorNames[data.backgroundColor]})`;
            
            // Автоматично встановлюємо колір при завантаженні, якщо не було ручного вибору
            const manualChoice = localStorage.getItem('manualColorChoice');
            if (!manualChoice || manualChoice === 'auto') {
                changeBackgroundColor(data.backgroundColor, false);
            }
            
            return data;
        } catch (error) {
            console.error('Error fetching env info:', error);
            envTitle.textContent = 'ERROR';
            envInfo.textContent = 'Помилка отримання інформації про середовище';
            return null;
        }
    }

    // Функція для зміни кольору фону
    function changeBackgroundColor(color, isManual = true) {
        // Видаляємо всі класи кольорів
        body.classList.remove('green-background', 'purple-background', 'yellow-background', 'blue-background');
        
        // Додаємо потрібний клас
        if (color === 'green') {
            body.classList.add('green-background');
        } else if (color === 'purple') {
            body.classList.add('purple-background');
        } else if (color === 'yellow') {
            body.classList.add('yellow-background');
        } else if (color === 'blue') {
            body.classList.add('blue-background');
        }
        
        // Зберігаємо вибір користувача
        if (isManual) {
            localStorage.setItem('backgroundColor', color);
            localStorage.setItem('manualColorChoice', color);
        }
    }

    // Обробники подій для кнопок
    greenBtn.addEventListener('click', () => changeBackgroundColor('green'));
    purpleBtn.addEventListener('click', () => changeBackgroundColor('purple'));
    yellowBtn.addEventListener('click', () => changeBackgroundColor('yellow'));
    blueBtn.addEventListener('click', () => changeBackgroundColor('blue'));
    defaultBtn.addEventListener('click', () => changeBackgroundColor('default'));
    
    autoBtn.addEventListener('click', () => {
        if (currentEnvData) {
            changeBackgroundColor(currentEnvData.backgroundColor);
            localStorage.setItem('manualColorChoice', 'auto');
        }
    });

    // Відновлення збереженого кольору при завантаженні
    const savedColor = localStorage.getItem('backgroundColor');
    const manualChoice = localStorage.getItem('manualColorChoice');
    
    if (savedColor && manualChoice && manualChoice !== 'auto') {
        changeBackgroundColor(savedColor, false);
    }

    // Завантаження інформації про середовище
    getEnvInfo();

    // Додаємо анімацію появи
    const container = document.querySelector('.container');
    container.style.opacity = '0';
    container.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        container.style.transition = 'all 0.5s ease';
        container.style.opacity = '1';
        container.style.transform = 'translateY(0)';
    }, 100);
});