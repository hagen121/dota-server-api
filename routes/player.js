const express = require('express');
const router = express.Router();

// Получить профиль игрока
router.post('/get_player_profile', (req, res) => {
  res.json({
    Profile: {
      steamid: req.body.SteamID,
      AccountLvlInfo: { level: 1, xp: 0 },
      donate_tiers: {},
      QuickCastInfo: { ability: 0, item: 0 },
      talents_points: 0
    },
    Achievements: {},
    BattlePass: {},
    ChatWheel: {}
  });
});

// Самостоятельный профиль (для клиента)
router.post('/get_player_self_profile', (req, res) => {
  res.json({ Profile: { steamid: req.body.SteamID } });
});

// История матчей
router.post('/get_player_self_history_v41', (req, res) => {
  res.json({ List: [] });
});

// Инфо по матчу
router.post('/get_match_info_v41', (req, res) => {
  res.json({
    MatchID: req.body.MatchID,
    Players: []
  });
});

// Обновить профиль игрока
router.post('/update_player_profile_v45', (req, res) => {
  console.log("update_player_profile_v45", req.body);
  res.json({ Profile: { updated: true } });
});

module.exports = router;
