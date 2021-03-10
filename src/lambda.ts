import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";

import report from "./report";
import reportByTable from "./reportByTable";

export async function handleReport(
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> {
  try {
    console.log(`Maybe call manually from API Gateway`);
    const { language = "", period = "" } = event.pathParameters || {};
    if (!language || !period) {
      throw new Error(`Invalid language[${language}] and period[${period}]`);
    }
    const result = await report({
      language,
      period,
    });
    console.log(`result`, result);
    return { statusCode: 200, body: JSON.stringify(result) };
  } catch (error) {
    console.error(error);
    return { statusCode: 500, body: error.message };
  }
}

export async function handleReportToday(): Promise<APIGatewayProxyResultV2> {
  try {
    console.log(`Maybe call from Scheduler tick`);
    const result = await reportByTable();
    console.log(`result`, result);
    return { statusCode: 200, body: JSON.stringify(result) };
  } catch (error) {
    console.error(error);
    return { statusCode: 500, body: error.message };
  }
}
