const express = require('express');
const router = express.Router();

// Получить награду за уровень
router.post('/get_battle_pass_levels', (req, res) => {
  res.json({ BattlePass: {}, Profile: {} });
});

module.exports = router;
