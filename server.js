const express = require('express');
const app = express();
const chess = require('./chess');

app.get('/player1/:move', (req, res) => {
  const move = req.params && req.params.move;
  chess.move(move);

  const debug = chess.debug();

  res.json({
    ok: true,
    move,
    debug
  });
});

app.get('/player2/:move', (req, res) => {
  const move = req.params && req.params.move;
  chess.move(move);

  const debug = chess.debug();

  res.json({
    ok: true,
    move,
    debug
  });
});

const PORT = 8888;
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
