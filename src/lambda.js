const scheduler = require("./scheduler");
const report = require("./report");

exports.handler = async (event, _, callback) => {
  try {
    const result = await (async () => {
      if (event.pathParameters) {
        console.log(`Maybe call manually from API Gateway`);
        const { language, period } = event.pathParameters;
        if (!language || !period) {
          throw new Error(
            `Invalid language[${language}] and period[${period}]`
          );
        }
        return report(language, period);
      } else {
        console.log(`Maybe call from Scheduler tick`);
        return scheduler();
      }
    })();
    console.log(`result`, result);
    callback(null, { statusCode: 200, body: JSON.stringify(result) });
  } catch (error) {
    console.error(error);
    callback(error);
  }
};
