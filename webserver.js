var express = require("express");
var app = express();
const https = require("https");
const latency = require("./src/latency");
const axios = require("axios");

const PORT = 8888;
const HOST = "0.0.0.0";

const wordServiceTimeout =
  (process.env.WORD_SERVICE_TIMEOUT &&
    parseInt(process.env.WORD_SERVICE_TIMEOUT)) ||
  1000;

function forwardTraceHeaders(req) {
  incoming_headers = [
    "x-request-id",
    "x-b3-traceid",
    "x-b3-spanid",
    "x-b3-parentspanid",
    "x-b3-sampled",
    "x-b3-flags",
    "x-ot-span-context",
    "x-dev-user",
    "fail"
  ];
  const headers = {};
  for (let h of incoming_headers) {
    if (req.header(h)) headers[h] = req.header(h);
  }

  // console.log("*** Headers:");
  // console.log(JSON.stringify(headers, null, 2));

  return headers;
}

app.use(function(err, req, res, next) {
  console.error(err.message); // Log error message in our server's console
  if (!err.statusCode) err.statusCode = 500; // If err has no specified error code, set error code to 'Internal Server Error (500)'
  res.status(err.statusCode).send(err.message); // All HTTP requests must have a response, so let's send back an error with its status code and message
});

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/web/index.html");
});

app.get("/style.css", function(req, res) {
  res.sendFile(__dirname + "/web/style.css");
});

app.get("/index.js", function(req, res) {
  res.sendFile(__dirname + "/web/index.js");
});

app.get("/getword", async function(req, res, next) {
  try {
    const options = {
      timeout: wordServiceTimeout,
      headers: forwardTraceHeaders(req)
    };

    const response = await axios.get(process.env.WORD_SERVICE_URL, options);
    const status = response.status;
    const word = response.data;

    res.send(status, word);
  } catch (error) {
    console.dir(error);
    console.log(error.message);
    if (error.code === "ECONNABORTED") {
      error.statusCode = 504;
    }
    next(error);
  }
});

app.get("/healthz", function(req, res) {
  res.send("I am happy and healthy\n");
});

const server = app.listen(PORT);

// quit on ctrl-c when running docker in terminal
process.on("SIGINT", function onSigint() {
  console.info(
    "Got SIGINT (aka ctrl-c in docker). Graceful shutdown ",
    new Date().toISOString()
  );
  shutdown();
});

// quit properly on docker stop
process.on("SIGTERM", function onSigterm() {
  console.info(
    "Got SIGTERM (docker container stop). Graceful shutdown ",
    new Date().toISOString()
  );
  shutdown();
});

let sockets = {},
  nextSocketId = 0;
server.on("connection", function(socket) {
  const socketId = nextSocketId++;
  sockets[socketId] = socket;
  const numSockets = Object.keys(sockets).length;
  console.log(
    ">>> Creating socket: " + socketId + " | " + numSockets + " sockets total"
  );

  socket.once("close", function() {
    delete sockets[socketId];
    const numSockets = Object.keys(sockets).length;
    console.log(
      "<<< Deleting socket: " + socketId + " | " + numSockets + " sockets total"
    );
  });
});

// shut down server
function shutdown() {
  waitForSocketsToClose(10);
  server.close(function onServerClosed(err) {
    if (err) {
      console.error(err);
      process.exitCode = 1;
    }
    process.exit();
  });
}

function waitForSocketsToClose(counter) {
  if (counter > 0) {
    console.log(
      `Waiting ${counter} more ${
        counter === 1 ? "seconds" : "second"
      } for all connections to close...`
    );
    return setTimeout(waitForSocketsToClose, 1000, counter - 1);
  }

  console.log("Forcing all connections to close now");
  for (var socketId in sockets) {
    sockets[socketId].destroy();
    const numSockets = Object.keys(sockets).length;
    console.log(
      "!!! Destroying socket: " +
        socketId +
        " | " +
        numSockets +
        " sockets total"
    );
  }
}

console.log(
  `Firing cannon on http://${HOST}:${PORT} (Failure threshold: ${process.env.FAILURE_RATE})`
);

console.log(
  `Wordcannon web server ready to receive traffic on http://${HOST}:${PORT}.  Backend timeout set to ${wordServiceTimeout} ms.`
);
