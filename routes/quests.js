const express = require('express');
const router = express.Router();

// Получить ежедневки
router.post('/get_player_daily_quests', (req, res) => {
  res.json({ quests: [], reward: {} });
});

// Выбрать награду
router.post('/select_daily_reward', (req, res) => {
  res.json({ RewardInfo: {} });
});

module.exports = router;
