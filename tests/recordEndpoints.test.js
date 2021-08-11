const supertest = require("supertest");
const app = require("../index");
const { sleep } = require("../helpers/utilityFunctions");
const {
  connectToDatabase,
  disconnectToDatabase,
} = require("../services/database");

beforeAll(async () => {
  await connectToDatabase().then(
    (db) => {
      app.db = db;
      console.log("Connection complete");
    },
    (e) => {
      throw e;
    }
  );
});

afterAll(async () => {
  // See tests/index.test.ts comment
  await sleep(200);
  await disconnectToDatabase();
});

describe("Fetch records - Positive Test", () => {
  const endpoint = "/v1/records";
  const server = supertest(app);
  const filterPayload = {
    startDate: "2016-01-26",
    endDate: "2018-02-02",
    minCount: 100,
    maxCount: 200,
  };

  it("Post with valid data", async () => {
    let response = await server
      .post("/records")
      .set("Content-Type", "application/json")
      .send(filterPayload);
    expect(response.status).toEqual(200);
    expect(response.body).toHaveProperty("records");
    expect(response.body.msg).toEqual("Success");
    expect(Array.isArray(response.body.records)).toEqual(true);
    expect(response.body.records.length).toBeGreaterThan(0);
  });
  it("Post with valid data but empty result", async () => {
    const filterPayload = {
      startDate: '2016-01-26',
      endDate: '2017-01-26',
      minCount: '2000',
      maxCount: '2070',
    };
    let response = await server
      .post("/records")
      .set("Content-Type", "application/json")
      .send(filterPayload);
    expect(response.status).toEqual(200);
    expect(response.body).toHaveProperty("records");
    expect(response.body.msg).toEqual("Success");
    expect(Array.isArray(response.body.records)).toEqual(true);
    expect(response.body.records.length).toHaveLength(0);
  });

  it('Post with invalid data', async () => {
    const filterPayload = {
    };
    let response = await server
      .post("/records")
      .set("Content-Type", "application/json")
      .send(filterPayload);

    expect(response.status).toEqual(500);
    expect(response.body.msg).toEqual('Invalid data');
  });
});
