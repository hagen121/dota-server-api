const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

// Подключаем роуты
app.use('/', require('./routes/game'));
app.use('/', require('./routes/player'));
app.use('/', require('./routes/chat'));
app.use('/', require('./routes/quests'));
app.use('/', require('./routes/battlepass'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
