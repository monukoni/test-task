document.addEventListener('DOMContentLoaded', function() {
    const body = document.body;
    const greenBtn = document.getElementById('greenBtn');
    const purpleBtn = document.getElementById('purpleBtn');
    const defaultBtn = document.getElementById('defaultBtn');
    const configBtn = document.getElementById('configBtn');
    const colorInfo = document.getElementById('colorInfo');

    let configColor = null;

    async function getConfig() {
        try {
            const response = await fetch('/api/config');
            const data = await response.json();
            configColor = data.backgroundColor;
            
            const colorNames = {
                'green': 'Зелений',
                'purple': 'Фіолетовий', 
                'default': 'За замовчуванням'
            };
            
            colorInfo.textContent = `Конфігурований колір: ${colorNames[configColor] || configColor}`;
            
            const userChoice = localStorage.getItem('userColorChoice');
            if (!userChoice) {
                changeBackgroundColor(configColor, false);
            }
            
            return data;
        } catch (error) {
            console.error('Error fetching config:', error);
            colorInfo.textContent = 'Помилка завантаження конфігурації';
            return null;
        }
    }

    function changeBackgroundColor(color, saveChoice = true) {
        body.classList.remove('green-background', 'purple-background');
        
        if (color === 'green') {
            body.classList.add('green-background');
        } else if (color === 'purple') {
            body.classList.add('purple-background');
        }
        
        if (saveChoice) {
            localStorage.setItem('backgroundColor', color);
            localStorage.setItem('userColorChoice', 'true');
        }
    }

    greenBtn.addEventListener('click', () => changeBackgroundColor('green'));
    purpleBtn.addEventListener('click', () => changeBackgroundColor('purple'));
    defaultBtn.addEventListener('click', () => changeBackgroundColor('default'));
    
    configBtn.addEventListener('click', () => {
        if (configColor) {
            changeBackgroundColor(configColor);
            localStorage.removeItem('userColorChoice'); 
        }
    });

    const savedColor = localStorage.getItem('backgroundColor');
    const userChoice = localStorage.getItem('userColorChoice');
    
    if (savedColor && userChoice) {
        changeBackgroundColor(savedColor, false);
    }

    getConfig();

    const container = document.querySelector('.container');
    container.style.opacity = '0';
    container.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        container.style.transition = 'all 0.5s ease';
        container.style.opacity = '1';
        container.style.transform = 'translateY(0)';
    }, 100);
});