/*
  -> "white play move" ({ move: algebraic notation })
- "white, waiting state" (game is waiting for a move from white player)
    - if not valid move, "white, waiting state"
      - side effect, play error message
    - else, "white, move confirmation"
  -> "resign"
    - "white, resign confirmation"

- "white, move confirmation" (game is waiting for white to confirm move)
  -> "confirm"
    - if checkmate, go to "game over"
      - "game over" ({ result: "1-0", termination: "checkmate" })
    - if stalemate, go to "game over"
      - "game over" ({ result: "1/2 - 1/2", termination: "stalemate" })
    - else, go to "black, waiting state"
  -> "cancel"
    - "white, waiting state"

- "white, resign confirmation"
  -> "confirm"
    - "game over" ({ result: "0-1", termination: "resign" })
  -> "cancel"
    - "white, waiting state"

Do the same for Black

- "game over"
  result: 1-0 | 0-1 | 1/2 - 1/2
  termination: resign | checkmate | stalemate
*/

// Available variables:
// - Machine
// - interpret
// - assign
// - send
// - sendParent
// - spawn
// - raise
// - actions
// - XState (all XState exports)

const fetchMachine = Machine(
  {
    id: "fetch",
    initial: "whiteWaitingState",
    context: {
      result: null,
      termination: null,
      currentMove: null,
    },
    states: {
      whiteWaitingState: {
        on: {
          resign: "whiteResignConfirmation",
          playMove: [
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
          confirm: "gameOver",
          cancel: "whiteWaitingState",
        },
      },

      whiteMoveConfirmation: {
        on: {
          confirm: [
            {
              cond: { type: "isCheckmate" },
              target: "gameOver",
            },
            {
              cond: { type: "isStalemate" },
              target: "gameOver",
            },
            { target: "blackWaitingState" },
          ],
          cancel: "whiteWaitingState",
        },
      },

      blackWaitingState: {
        on: {
          resign: "blackResignConfirmation",
          playMove: [
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
          confirm: "gameOver",
          cancel: "blackWaitingState",
        },
      },

      blackMoveConfirmation: {
        on: {
          confirm: [
            {
              cond: { type: "isCheckmate" },
              target: "gameOver",
            },
            {
              cond: { type: "isStalemate" },
              target: "gameOver",
            },
            { target: "whiteWaitingState" },
          ],
          cancel: "blackWaitingState",
        },
      },

      gameOver: {
        type: "final",
      },
    },
  },
  {
    guards: {
      isValid: () => true,
      isCheckmate: () => false,
      isStalemate: () => false,
    },
    actions: {
      cacheCurrentMove: assign((context, event) => {
        return {
          currentMove: event.move,
        };
      }),
    },
  }
);
