import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";

import reportBySchedule from "./reportBySchedule.js";
import reportOwner from "./reportOwner.js";
import reportTrending from "./reportTrending.js";
import slackOwnerConnect from "./env/slackOwnerConnect.js";
import slackTrendingConnect from "./env/slackTrendingConnect.js";

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
    reportTrending(
      {
        language,
        period,
      },
      slackTrendingConnect
    )
  );
}

export async function handleReportOwner(
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> {
  const { owner = "" } = event.pathParameters ?? {};
  console.info({ owner }, `Start to report owner`);
  return await handleBase(() =>
    reportOwner(
      {
        owner,
      },
      slackOwnerConnect
    )
  );
}

export async function handleSchedulerByApi(): Promise<APIGatewayProxyResultV2> {
  console.info("Start to report by scheduler");
  return await handleBase(() =>
    reportBySchedule({
      watchOwner: true,
      watchTrending: true,
      slackConnect: slackTrendingConnect,
    })
  );
}

export async function handleOwnerSchedulerByApi(): Promise<APIGatewayProxyResultV2> {
  console.info("Start to report by scheduler");
  return await handleBase(() =>
    reportBySchedule({
      watchOwner: true,
      watchTrending: false,
      slackConnect: slackTrendingConnect,
    })
  );
}

export async function handleTrendingSchedulerByApi(): Promise<APIGatewayProxyResultV2> {
  console.info("Start to report by scheduler");
  return await handleBase(() =>
    reportBySchedule({
      watchOwner: false,
      watchTrending: true,
      slackConnect: slackTrendingConnect,
    })
  );
}

export async function handleScheduler(): Promise<void> {
  console.info("Start to report by scheduler");
  await handleBase(() =>
    reportBySchedule({
      watchOwner: true,
      watchTrending: true,
      slackConnect: slackTrendingConnect,
    })
  );
}
