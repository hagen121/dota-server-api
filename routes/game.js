const express = require('express');
const router = express.Router();
const supabase = require('../supabase');

// Топ-1 рекорды
router.post('/get_top1_records', async (req, res) => {
  // Это пример — ты сам определишь логику, что такое “топ-1”
  // Например, выбрать игрока с самым высоким рейтингом
  const { data, error } = await supabase
    .from('players')
    .select('*')
    .order('rating', { ascending: false })
    .limit(1);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  const top = data[0] || null;
  res.json({
    mode1: {
      rating: top ? { steamid: top.steamid, value: top.rating } : null
    }
  });
});

// Завершить матч и сохранить данные
router.post('/finish_game_for_player_v45', async (req, res) => {
  const { mode_id, difficult, key_tier, duration, player_info } = req.body;

  if (!player_info || !Array.isArray(player_info)) {
    return res.status(400).json({ error: "player_info array required" });
  }

  // Сначала вставим запись матча
  const { data: matchData, error: matchErr } = await supabase
    .from('matches')
    .insert([{ mode_id, difficult, key_tier, duration }])
    .select()
    .single();

  if (matchErr) {
    return res.status(500).json({ error: matchErr.message });
  }

  const matchId = matchData.id;

  // Затем для каждого игрока вставим player_matches и upsert игрока
  for (const pl of player_info) {
    await supabase
      .from('players')
      .upsert({
        steamid: pl.SteamID,
        nickname: pl.nickname || null
      });

    await supabase
      .from('player_matches')
      .insert({
        match_id: matchId,
        steamid: pl.SteamID,
        hero_name: pl.heroname,
        win: pl.win,
        kills: pl.kills_creeps,
        deaths: pl.deaths,
        damage: pl.outgoing_damage
      });
  }

  res.json({ status: "saved", match_id: matchId });
});

module.exports = router;
