const { Chess } = require('chess.js');

class MyChessGame {
  constructor() {
    this.chess = new Chess();
  }

  move(move) {
    if (move) {
      this.chess.move(move);
    }
  }

  debug() {
    return this.chess.fen();
  }
}

const chess = new MyChessGame();

module.exports = chess;
