const express = require('express');
const router = express.Router();
const supabase = require('../supabase');

// Получить текущий уровень Battle Pass игрока
router.post('/get_battle_pass_levels', async (req, res) => {
  const { SteamID } = req.body;
  if (!SteamID) return res.status(400).json({ error: "SteamID required" });

  const { data: bp, error: bpErr } = await supabase
    .from('player_battlepass')
    .select('*')
    .eq('steamid', SteamID)
    .single();

  if (bpErr && bpErr.code !== "PGRST116") { // PGRST116 = not found
    return res.status(500).json({ error: bpErr.message });
  }

  // Если игрока нет в таблице — создаём с дефолтным уровнем
  let playerBP = bp;
  if (!bp) {
    const { data: newBP } = await supabase
      .from('player_battlepass')
      .insert({ steamid: SteamID, level: 1, xp: 0 })
      .select()
      .single();
    playerBP = newBP;
  }

  // Получаем список наград
  const { data: rewards, error: rErr } = await supabase
    .from('battlepass_levels')
    .select('*')
    .order('level', { ascending: true });

  if (rErr) return res.status(500).json({ error: rErr.message });

  res.json({
    PlayerBattlePass: playerBP,
    Rewards: rewards
  });
});

// Обновить Battle Pass XP игрока (например, после матча)
router.post('/update_battle_pass_progress', async (req, res) => {
  const { SteamID, xpEarned } = req.body;
  if (!SteamID || !xpEarned) {
    return res.status(400).json({ error: "SteamID and xpEarned required" });
  }

  // Текущий прогресс
  const { data: bp, error } = await supabase
    .from('player_battlepass')
    .select('*')
    .eq('steamid', SteamID)
    .single();

  let newLevel = 1;
  let newXp = xpEarned;

  if (bp) {
    newXp = bp.xp + xpEarned;
    newLevel = bp.level;

    // Пример: уровень = каждые 1000 XP
    while (newXp >= 1000) {
      newLevel++;
      newXp -= 1000;
    }
  }

  const { data, error: upErr } = await supabase
    .from('player_battlepass')
    .upsert({ steamid: SteamID, level: newLevel, xp: newXp })
    .select()
    .single();

  if (upErr) return res.status(500).json({ error: upErr.message });

  res.json({ PlayerBattlePass: data });
});

module.exports = router;
