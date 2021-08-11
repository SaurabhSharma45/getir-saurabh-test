const AsyncRouter = require("../routes/async-router");
const { getRecords } = require("./record_service");
const successCode = process.env.GETIR_SUCCESS_CODE;
const errorCode = process.env.GETIR_INTERNEL_ERROR;

const recordRouter = AsyncRouter({ mergeParams: true });

recordRouter.postAsync("/", async (req, res) => {
  const body = req.body;
  const records = await getRecords(body);
  if (records.code == successCode) {
    res.send(records);
  } else {
    res.status(errorCode);
    res.send(records);
  }
});

module.exports = {
  recordRouter,
};
