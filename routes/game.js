const express = require('express');
const router = express.Router();

// Топ-1 рекорды
router.post('/get_top1_records', (req, res) => {
  res.json({}); // вернуть список рекордов
});

// Все сезоны
router.post('/get_all_seasons', (req, res) => {
  res.json([]);
});

// Сезоны ключей
router.post('/get_all_keys_seasons', (req, res) => {
  res.json([]);
});

// Сезоны battle pass
router.post('/get_all_battle_pass_seasons', (req, res) => {
  res.json([]);
});

// Сохранить матч (авто-сейв)
router.post('/safe_match', (req, res) => {
  console.log("safe_match", req.body);
  res.json({ status: "ok" });
});

// Завершить игру
router.post('/finish_game_for_player_v45', (req, res) => {
  console.log("finish_game_for_player_v45", req.body);
  res.json({ status: "saved" });
});

module.exports = router;
