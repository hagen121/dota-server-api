const express = require('express');
const router = express.Router();
const supabase = require('../supabase');

// Получить ежедневные квесты игрока
router.post('/get_player_daily_quests', async (req, res) => {
  const { SteamID } = req.body;
  if (!SteamID) return res.status(400).json({ error: "SteamID required" });

  const { data, error } = await supabase
    .from('daily_quests')
    .select('*')
    .eq('steamid', SteamID)
    .order('created_at', { ascending: false })
    .limit(5);

  if (error) return res.status(500).json({ error: error.message });

  res.json({ quests: data });
});

// Игрок выбирает награду за выполненный квест
router.post('/select_daily_reward', async (req, res) => {
  const { SteamID, QuestID } = req.body;
  if (!SteamID || !QuestID) {
    return res.status(400).json({ error: "SteamID and QuestID required" });
  }

  // Отмечаем квест выполненным
  const { data: quest, error: questErr } = await supabase
    .from('daily_quests')
    .update({ completed: true })
    .eq('id', QuestID)
    .eq('steamid', SteamID)
    .select()
    .single();

  if (questErr) return res.status(500).json({ error: questErr.message });

  // Добавляем XP в игрока
  const { data: bp, error: bpErr } = await supabase
    .from('player_battlepass')
    .upsert({
      steamid: SteamID,
      xp: quest.reward_xp
    }, { onConflict: 'steamid' })
    .select()
    .single();

  if (bpErr) return res.status(500).json({ error: bpErr.message });

  res.json({ RewardInfo: quest.reward_xp, PlayerBattlePass: bp });
});

module.exports = router;
