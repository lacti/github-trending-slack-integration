const scheduler = require("./scheduler");
const report = require("./report");

exports.handlerReport = async (event, _, callback) => {
  try {
    console.log(`Maybe call manually from API Gateway`);
    const { language, period } = event.pathParameters;
    if (!language || !period) {
      throw new Error(`Invalid language[${language}] and period[${period}]`);
    }
    const result = await report(language, period);
    console.log(`result`, result);
    callback(null, { statusCode: 200, body: JSON.stringify(result) });
  } catch (error) {
    console.error(error);
    callback(error);
  }
};

exports.handlerReportToday = async (_event, _, callback) => {
  try {
    console.log(`Maybe call from Scheduler tick`);
    const result = await scheduler();
    console.log(`result`, result);
    callback(null, { statusCode: 200, body: JSON.stringify(result) });
  } catch (error) {
    console.error(error);
    callback(error);
  }
};
