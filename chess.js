const { Chess } = require("chess.js");
const ChessImageGenerator = require("@newyork.anthonyng/chess-image-generator");
const path = require("path");

class MyChessGame {
  constructor() {
    this.chess = new Chess();
    this.imageGenerator = new ChessImageGenerator();
  }

  isMoveValid(move) {
    const legalMoves = this.chess.moves() || [];
    const moveIndex = legalMoves.findIndex(
      (currentMove) => currentMove.toLowerCase() === move.toLowerCase()
    );

    console.log("******");
    console.log("is move valid");
    console.log(moveIndex > -1);

    return moveIndex > -1;
  }

  move(move) {
    if (move) {
      const result = this.chess.move(move);
      console.log("************");
      console.log("given move", move);
      console.log(result);
      if (!result) {
        throw new Error("Whoops. Move did not work");
      }
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

    const imagePath = `public/images/${history.length}.png`;
    this.imageGenerator.generatePNG(path.resolve(__dirname, imagePath));

    return imagePath;
  }

  debug() {
    return this.chess.fen();
  }
}

const chess = new MyChessGame();

module.exports = chess;
