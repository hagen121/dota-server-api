const express = require('express');
const router = express.Router();
const supabase = require('../supabase');

// Таблица чата: chat_messages (id, steamid, player_name, message, created_at)

router.post('/send_global_chat_message_dota', async (req, res) => {
  const { player_steamid, player_name, message } = req.body;

  if (!player_steamid || !message) {
    return res.status(400).json({ error: "player_steamid and message required" });
  }

  const { data, error } = await supabase
    .from('chat_messages')
    .insert([{ player_steamid, player_name, message }]);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json({ status: "ok", message: data });
});

router.post('/get_global_chat_messages_dota', async (req, res) => {
  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .order('created_at', { ascending: true })
    .limit(50);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

router.post('/chat_wheel_changed', (req, res) => {
  // Это просто логика клиента, можно игнорировать или сохранять
  console.log("chat wheel changed:", req.body);
  res.json({ status: "ok" });
});

module.exports = router;
