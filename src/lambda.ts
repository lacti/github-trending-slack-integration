import { APIGatewayProxyHandler } from "aws-lambda";
import report from "./report";
import scheduler from "./scheduler";

export const handlerReport: APIGatewayProxyHandler = async event => {
  try {
    console.log(`Maybe call manually from API Gateway`);
    const { language = "", period = "" } = event.pathParameters || {};
    if (!language || !period) {
      throw new Error(`Invalid language[${language}] and period[${period}]`);
    }
    const result = await report({
      language,
      period
    });
    console.log(`result`, result);
    return { statusCode: 200, body: JSON.stringify(result) };
  } catch (error) {
    console.error(error);
    return { statusCode: 500, body: error.message };
  }
};

export const handlerReportToday = async () => {
  try {
    console.log(`Maybe call from Scheduler tick`);
    const result = await scheduler();
    console.log(`result`, result);
    return { statusCode: 200, body: JSON.stringify(result) };
  } catch (error) {
    console.error(error);
    return { statusCode: 500, body: error.message };
  }
};
