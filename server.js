const BACKGROUND_COLOR = 'purple'; // 'green', 'purple', або 'default'

const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

app.get('/api/config', (req, res) => {
  res.json({
    backgroundColor: BACKGROUND_COLOR
  });
});


app.use(express.static('public'));


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Background color set to: ${BACKGROUND_COLOR}`);
});