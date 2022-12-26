const { createMachine, interpret, assign } = require("xstate");
const chess = require("./chess");

const gameMachine = createMachine(
  {
    id: "chess",
    initial: "whiteWaitingState",
    context: {
      result: null,
      termination: null,
      currentMove: null,
      images: [],
    },
    states: {
      whiteWaitingState: {
        on: {
          white_resign: "whiteResignConfirmation",
          white_playMove: [
            {
              actions: "cacheCurrentMove",
              cond: { type: "isValid" },
              target: "whiteMoveConfirmation",
            },
            { target: "whiteWaitingState" },
          ],
        },
      },

      whiteResignConfirmation: {
        on: {
          white_confirm: "gameOver",
          white_cancel: "whiteWaitingState",
        },
      },

      whiteMoveConfirmation: {
        on: {
          white_confirm: [
            {
              cond: { type: "isCheckmate" },
              target: "gameOver",
            },
            {
              cond: { type: "isStalemate" },
              target: "gameOver",
            },
            {
              actions: "playCurrentMove",
              target: "blackWaitingState",
            },
          ],
          white_cancel: "whiteWaitingState",
        },
      },

      blackWaitingState: {
        on: {
          black_resign: "blackResignConfirmation",
          black_playMove: [
            {
              actions: "cacheCurrentMove",
              cond: { type: "isValid" },
              target: "blackMoveConfirmation",
            },
            { target: "whiteWaitingState" },
          ],
        },
      },

      blackResignConfirmation: {
        on: {
          black_confirm: "gameOver",
          black_cancel: "blackWaitingState",
        },
      },

      blackMoveConfirmation: {
        on: {
          black_confirm: [
            {
              cond: { type: "isCheckmate" },
              target: "gameOver",
            },
            {
              cond: { type: "isStalemate" },
              target: "gameOver",
            },
            { actions: "playCurrentMove", target: "whiteWaitingState" },
          ],
          black_cancel: "blackWaitingState",
        },
      },

      gameOver: {
        type: "final",
      },
    },
  },
  {
    guards: {
      isValid: (context, event) => {
        const isMoveValid = chess.isMoveValid(event.move);
        console.log("*******");
        console.log(event);
        console.log("isValid", isMoveValid);

        return isMoveValid;
      },
      isCheckmate: () => false,
      isStalemate: () => false,
    },
    actions: {
      cacheCurrentMove: assign((context, event) => {
        return {
          currentMove: event.move,
        };
      }),
      playCurrentMove: (context, event) => {
        chess.move(context.currentMove);
        const image = chess.getImage();
        context.images.push(image);
      },
    },
  }
);

const gameService = interpret(gameMachine);
module.exports = gameService;
