import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";

import reportBySchedule from "./reportBySchedule";
import reportOwner from "./reportOwner";
import reportTrending from "./reportTrending";

async function handleBase<R>(
  delegate: () => Promise<R>
): Promise<APIGatewayProxyResultV2> {
  try {
    const result = await delegate();
    console.log(`result`, result);
    return { statusCode: 200, body: JSON.stringify(result) };
  } catch (error) {
    console.error(error);
    return { statusCode: 500, body: error.message };
  }
}

export async function handleReportTrending(
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> {
  const { language = "", period = "" } = event.pathParameters ?? {};
  console.info({ language, period }, `Start to report trending`);
  return await handleBase(() =>
    reportTrending({
      language,
      period,
    })
  );
}

export async function handleReportOwner(
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> {
  const { owner = "" } = event.pathParameters ?? {};
  console.info({ owner }, `Start to report owner`);
  return await handleBase(() =>
    reportOwner({
      owner,
    })
  );
}

export async function handleScheduler(): Promise<APIGatewayProxyResultV2> {
  console.info("Start to report by scheduler");
  return await handleBase(() => reportBySchedule());
}
