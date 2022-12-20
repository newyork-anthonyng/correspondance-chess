const express = require('express');
const app = express();
const chess = require('./chess');
const path = require('path');

app.use(express.static(path.resolve(__dirname, 'public')));

app.get('/player1/:move', (req, res) => {
  const move = req.params && req.params.move;
  chess.move(move);

  const debug = chess.debug();
  const imagePath = chess.getImage();

  res.json({
    ok: true,
    move,
    debug,
    imagePath
  });
});

app.get('/player2/:move', (req, res) => {
  const move = req.params && req.params.move;
  chess.move(move);

  const debug = chess.debug();
  const imagePath = chess.getImage();

  res.json({
    ok: true,
    move,
    debug,
    imagePath
  });
});

const PORT = 8888;
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
