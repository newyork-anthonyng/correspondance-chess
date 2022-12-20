const express = require('express');
const app = express();

app.get('/player1/:move', (req, res) => {
  const move = req.params && req.params.move;

  res.json({
    ok: true,
    move
  });
});

app.get('/player2/:move', (req, res) => {
  const move = req.params && req.params.move;

  res.json({
    ok: true,
    move
  });
});

const PORT = 8888;
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
