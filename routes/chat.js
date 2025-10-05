const express = require('express');
const router = express.Router();

// Глобальный чат
router.post('/send_global_chat_message_dota', (req, res) => {
  console.log("chat message", req.body);
  res.json({ status: "ok" });
});

router.post('/get_global_chat_messages_dota', (req, res) => {
  res.json([
    { id: 1, player_name: "Test", player_steamid: 123456, message: "Hello world!" }
  ]);
});

// Изменение chat wheel
router.post('/chat_wheel_changed', (req, res) => {
  console.log("chat_wheel_changed", req.body);
  res.json({ status: "ok" });
});

module.exports = router;
