const https = require("https");
const url = require("url");

const capitalize = name => name.charAt(0).toUpperCase() + name.slice(1);

const readTrending = (language, period) =>
  new Promise((resolve, reject) =>
    https
      .get(
        `https://github-trending-api.now.sh/repositories?language=${language}&since=${period}`,
        response => {
          let data = "";
          response.on("data", chunk => {
            data += chunk;
          });
          response.on("end", () => {
            resolve(JSON.parse(data));
          });
        }
      )
      .on("error", reject)
  );
const asSlackMessage = (language, period, input) => ({
  username: `${capitalize(language)} ${capitalize(period)}`,
  attachments: [
    {
      color: "#eeeeee",
      text: input
        .map(
          (repo, index) =>
            `${index + 1}. <${repo.url}|${repo.author} / ${repo.name}> ${
              repo.description
            }`
        )
        .join("\n")
    }
  ]
});
const sendToSlack = async (slackHookUrl, message) => {
  const payload = JSON.stringify(message);
  const sent = await new Promise((resolve, reject) => {
    const postRequest = https
      .request(
        {
          host: "hooks.slack.com",
          port: "443",
          path: url.parse(slackHookUrl).path,
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Content-Length": Buffer.byteLength(payload)
          }
        },
        postResponse => {
          let data = "";
          postResponse.on("data", chunk => {
            data += chunk;
          });
          postResponse.on("end", () => {
            resolve(data);
          });
        }
      )
      .on("error", reject);

    postRequest.write(payload);
    postRequest.end();
  });
  if (sent !== "ok") {
    throw new Error(`Invalid response: ${sent}`);
  }
};
const reportTrending = async (language, period, slackHookUrl) => {
  if (!slackHookUrl) {
    slackHookUrl = process.env["SLACK_HOOK_URL"];
    if (!slackHookUrl) {
      throw new Error("Please set proper SLACK_HOOK_URL to env.");
    }
  }
  try {
    await sendToSlack(
      slackHookUrl,
      asSlackMessage(language, period, await readTrending(language, period))
    );
  } catch (error) {
    console.log("Something is wrong.");
    console.error(error);
  }
};
module.exports = reportTrending;

if (require.main === module) {
  const language = process.argv[2] || "golang";
  const period = process.argv[3] || "weekly";
  reportTrending(language, period);
}
