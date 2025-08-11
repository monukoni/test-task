// server.js
const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Функція для визначення кольору за NODE_ENV
function getColorByEnv(env) {
  switch(env) {
    case 'development':
      return 'green';
    case 'production':
      return 'purple';
    case 'staging':
      return 'yellow';
    case 'test':
      return 'blue';
    default:
      return 'default';
  }
}

// API endpoint для отримання інформації про середовище
app.get('/api/env-info', (req, res) => {
  const nodeEnv = process.env.NODE_ENV || 'development';
  const backgroundColor = getColorByEnv(nodeEnv);
  
  res.json({
    nodeEnv: nodeEnv,
    backgroundColor: backgroundColor
  });
});

// Статичні файли
app.use(express.static('public'));

// Головна сторінка
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  const nodeEnv = process.env.NODE_ENV || 'development';
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`NODE_ENV: ${nodeEnv}`);
  console.log(`Background color: ${getColorByEnv(nodeEnv)}`);
});