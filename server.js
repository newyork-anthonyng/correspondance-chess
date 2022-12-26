const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const chess = require("./chess");
const path = require("path");
const service = require("./state-machine");

service.start();

app.use(express.static(path.resolve(__dirname, "public")));
app.use(bodyParser.json());

function getUserPrompt(state) {
  switch (state) {
    case "whiteWaitingState":
    case "blackWaitingState":
      return "White turn.";
    case "whiteResignConfirmation":
    case "blackResignConfirmation":
      return 'Send "Confirm" if you want to resign';
    case "whiteMoveConfirmation":
    case "blackMoveConfirmation":
      return 'Send "Confirm" if you want to submit your move';
    default:
      return "Unrecognized";
  }
}

app.post("/move", (req, res) => {
  const { side, input: _input } = req.body;
  const input = _input.toLowerCase();

  if (input === "confirm") {
    const message = `${side}_confirm`;
    service.send({ type: message });
  } else if (input === "resign") {
    const message = `${side}_resign`;
    service.send({ type: message });
    // res.json({
    //   message: "resigned",
    // });
  } else if (input === "cancel") {
    const message = `${side}_resign`;
    service.send({ type: message });

    // const currentState = service.getSnapshot().toStrings()[0];
    // res.json({
    //   message: "cancelled",
    //   state: currentState,
    //   prompt: getUserPrompt(currentState),
    // });
  } else {
    // user provided a move
    const message = `${side}_playMove`;
    // chess.move(input);
    // const imagePath = chess.getImage();
    service.send({
      type: message,
      move: _input,
    });

    // const currentState = service.getSnapshot().toStrings()[0];
    // res.json({
    //   ok: true,
    //   // imagePath,
    //   state: currentState,
    //   prompt: getUserPrompt(currentState),
    // });
  }

  const currentState = service.getSnapshot();
  const stateString = currentState.toStrings()[0];
  const context = currentState.context;
  console.log(context);
  res.json({
    state: stateString,
    prompt: getUserPrompt(stateString),
  });
});

app.get("/player1/confirm", (req, res) => {
  service.send({ type: "confirm" });

  const state = service.getSnapshot().toStrings();

  res.json({
    ok: true,
    debug: state,
  });
});

app.get("/player1/:move", (req, res) => {
  const move = req.params && req.params.move;
  chess.move(move);

  const debug = chess.debug();
  const imagePath = chess.getImage();

  service.send({
    type: "playMove",
    move,
  });

  const state = service.getSnapshot().toStrings();

  res.json({
    ok: true,
    imagePath,
    debug,
    state,
  });
});

app.get("/player2/confirm", (req, res) => {
  service.send({ type: "confirm" });

  const state = service.getSnapshot().toStrings();

  res.json({
    ok: true,
    debug: state,
  });
});

app.get("/player2/:move", (req, res) => {
  const move = req.params && req.params.move;
  chess.move(move);

  const debug = chess.debug();
  const imagePath = chess.getImage();

  service.send({
    type: "playMove",
    move,
  });

  const state = service.getSnapshot().toStrings();

  res.json({
    ok: true,
    debug,
    state,
    imagePath,
  });
});

const PORT = 8888;
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
