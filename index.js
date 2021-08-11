const dotenv = require("dotenv");

dotenv.config();
const utility = require("./helpers/utilityFunctions");

const express = require("express");
const app = express();
const cors = require("cors");

const cluster = require("cluster");
const os = require("os");
const numCPUs = os.cpus().length;
const maxWorkers = utility.stringToNumber(
  process.env.MAX_NUM_OF_WORKER_NODES,
  2
);
const numOfWorker = Math.min(maxWorkers, numCPUs);

const { connectToDatabase } = require("./services/database");
const { LoggerService } = require("./services/loggerSvc");
const {errorHandler} = require("./middleware/error-handler")
const host = process.env.GETIR_HOST;
const port = Number(process.env.GETIR_PORT) || 8080;

const { recordRouter } = require("./records/record_routes");

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use((err, req, res, next) => {
    // This check makes sure this is a JSON parsing issue, but it might be
    // coming from any middleware, not just body-parser:
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.sendStatus(400); // Bad request
    }

    next();
});

// setup Logger

app.logger = new LoggerService();
const logger = app.logger;

app.use(express.json({ limit: "500mb", strict: false }));
app.use(express.urlencoded({ extended: false }));
app.use(cors());

connectToDatabase().then(
  (db) => {
    app.db = db;
    if (cluster.isMaster) {
      logger.info("master node on http://" + host + ":" + port.toString());
      if (numOfWorker > 0) {
        createWorkers();
        return;
      }
    }
    logger.info("Connected to data base!");
    startInstance(port);
  },
  (e) => {
    throw e;
  }
);

function createWorkers() {
  for (let i = 0; i < numOfWorker; i++) {
    cluster.fork();
  }
  cluster.on("exit", (worker, code, signal) => {
    cluster.fork();
  });
}

function startInstance(port) {
  app.listen(port, () => {
    console.log(`Instance started with ${process.pid}, ${port}`);
  });
}

app.use("/records", recordRouter);
app.use("*", (req, res) => {
  res.status(404).json({ msg: `Not Found` });
});
// Error handler
app.use(errorHandler);

module.exports = app;
