const express = require('express');
const router = express.Router();
const supabase = require('../supabase');

// Получить профиль игрока
router.post('/get_player_profile', async (req, res) => {
  const { SteamID } = req.body;
  if (!SteamID) {
    return res.status(400).json({ error: "SteamID required" });
  }
  
  const { data, error } = await supabase
    .from('players')
    .select('*')
    .eq('steamid', SteamID)
    .single();

  if (error) {
    return res.status(404).json({ error: error.message });
  }
  
  res.json({ Profile: data });
});

// Обновить профиль
router.post('/update_player_profile_v45', async (req, res) => {
  const body = req.body;
  const SteamID = body.SteamID;
  if (!SteamID) {
    return res.status(400).json({ error: "SteamID required" });
  }

  const updateData = {
    nickname: body.nickname,
    rating: body.rating,
    account_xp: body.account_xp
    // и др. поля, которые ты хочешь хранить
  };

  const { data, error } = await supabase
    .from('players')
    .upsert({ steamid: SteamID, ...updateData });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json({ Profile: data });
});

// История матчей игрока
router.post('/get_player_self_history_v41', async (req, res) => {
  const { SteamID } = req.body;
  if (!SteamID) {
    return res.status(400).json({ error: "SteamID required" });
  }

  const { data, error } = await supabase
    .from('player_matches')
    .select('*, matches(*)')
    .eq('steamid', SteamID)
    .order('match_id', { ascending: false });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json({ List: data });
});

// Инфо по матчу
router.post('/get_match_info_v41', async (req, res) => {
  const { MatchID } = req.body;
  if (!MatchID) {
    return res.status(400).json({ error: "MatchID required" });
  }

  const { data, error } = await supabase
    .from('player_matches')
    .select('*, matches(*)')
    .eq('match_id', MatchID);

  if (error) {
    return res.status(404).json({ error: error.message });
  }

  res.json({
    MatchID,
    Players: data
  });
});

module.exports = router;
