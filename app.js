const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Роуты
app.use('/', require('./routes/game'));
app.use('/', require('./routes/player'));
app.use('/', require('./routes/battlepass'));
app.use('/', require('./routes/chat'));
app.use('/', require('./routes/quests'));

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Dota 2 API server running on port ${PORT}`);
});
