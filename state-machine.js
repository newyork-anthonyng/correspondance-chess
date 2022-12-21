/*
- "white, waiting state" (game is waiting for a move from white player)
  -> "white play move" ({ move: algebraic notation })
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

const fetchMachine = Machine({
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

    whiteMoveConfirmation: {},

    gameOver: {
      type: "final",
    },
  },
});
