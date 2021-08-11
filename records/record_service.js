const { getCollection } = require("../services/database");
const {isValidDate} = require("../helpers/utilityFunctions")
const recordCollection = process.env.GETIR_RECORD_COLLECTION;
const successCode = process.env.GETIR_SUCCESS_CODE;
const errorCode = process.env.GETIR_INTERNEL_ERROR;

async function getRecords(data){
    try{
    const recordCollectionDB = getCollection(recordCollection);
    if(!validateData(data)) throw {code: errorCode, message: "Invalid data"};
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);
    const minCount = data.minCount;
    const maxCount = data.maxCount;
    console.log(startDate, endDate, minCount, maxCount)
    // const records = await recordCollectionDB.find({}).toArray()
    const records = await recordCollectionDB.aggregate([
        {
          $match: {
            createdAt: {
              $gte: startDate,
              $lt: endDate,
            },
          },
        },
        {
            $project: {
              _id: 0,
              key: 1,
              createdAt: 1,
              totalCount: {
                $sum: '$counts',
              },
            },
          },
          {
            $match: {
              totalCount: {
                $gte: minCount,
                $lte: maxCount,
              },
            },
          }
      ]).toArray();
    return {code: successCode, msg: "Success", records: records};
    } catch(e){
      console.log('test')
        return {code: errorCode, msg: e.message}
    }

}


function validateData(data){
    // Missing data should be reported
    if(!data.startDate || !data.endDate || !data.minCount || !data.maxCount) {
        return false;
    }
    return true;
}

module.exports = {
    getRecords
}