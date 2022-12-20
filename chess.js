const { Chess } = require('chess.js');
const ChessImageGenerator = require('@newyork.anthonyng/chess-image-generator');
const path = require('path');

class MyChessGame {
  constructor() {
    this.chess = new Chess();
    this.imageGenerator = new ChessImageGenerator();
    this.moveCounter = 0;
  }

  move(move) {
    if (move) {
      this.chess.move(move);
    }
  }

  getImage() {
    // get most recent move
    const fen = this.chess.fen();
    this.imageGenerator.loadFEN(fen);

    const history = this.chess.history({ verbose: true });
    const lastMove = history[history.length - 1];

    if (lastMove) {
      const { from, to } = lastMove;
      this.imageGenerator.highlightSquares([from, to]);
    }

    const imagePath = `public/images/${this.moveCounter++}.png`;
    this.imageGenerator.generatePNG(path.resolve(__dirname, imagePath));

    return imagePath;
  }

  debug() {
    return this.chess.fen();
  }
}

const chess = new MyChessGame();

module.exports = chess;
