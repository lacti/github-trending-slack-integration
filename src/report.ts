import fetch from "node-fetch";
import { HTMLElement, parse as parseHtml } from "node-html-parser";

export interface IRepository {
  url: string;
  author: string;
  name: string;
  description: string;
}

export interface ITrendingParameters {
  language?: string;
  period?: string;
}

const capitalize = (name: string) =>
  name.charAt(0).toUpperCase() + name.slice(1);

const isAny = (value?: string) => !value || /any/i.test(value);

const readTrending = async ({
  language,
  period
}: ITrendingParameters): Promise<IRepository[]> => {
  let trendingUrl = `https://github.com/trending/`;
  if (!isAny(language)) {
    trendingUrl += encodeURIComponent(language!);
  }
  if (!isAny(period)) {
    trendingUrl += `?since=${period}`;
  }
  const response = await fetch(trendingUrl).then(r => r.text());
  const html = parseHtml(response) as HTMLElement & { valid: boolean };
  if (!html.valid) {
    throw new Error(`InvalidHTML`);
  }

  return html.querySelectorAll(`.Box-row`).map(article => {
    const a = article.querySelector(`h1 a`);
    const [, author, name] = a.attributes.href.trim().split("/");

    const spans = article
      .querySelector(`div.text-gray span`)
      .querySelectorAll(`span`);
    const repoLang = spans.length >= 2 ? spans[1].text.trim() : "Unknown";
    const p = article.querySelector(`p`);
    let description = !!p ? p.text.trim() : "";
    if (isAny(language)) {
      description = `[${repoLang}] ` + description;
    }
    return {
      author,
      name,
      url: `https://github.com/${author}/${name}`,
      description
    };
  });
};

const asSlackMessage = (
  language: string,
  period: string,
  repositories: IRepository[]
) => ({
  username: `${capitalize(language)} ${capitalize(period)}`,
  attachments: [
    {
      color: "#eeeeee",
      text: repositories
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

const sendToSlack = async (
  slackHookUrl: string,
  message: ReturnType<typeof asSlackMessage>
) => {
  const sent = await fetch(slackHookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(message)
  }).then(r => r.text());
  if (sent !== "ok") {
    throw new Error(`Invalid response: ${sent}`);
  }
  return sent;
};

const report = async (params: ITrendingParameters, slackHookUrl?: string) => {
  if (!slackHookUrl) {
    slackHookUrl = process.env.SLACK_HOOK_URL!;
    if (!slackHookUrl) {
      throw new Error("Please set proper SLACK_HOOK_URL to env.");
    }
  }
  return sendToSlack(
    slackHookUrl,
    asSlackMessage(
      params.language || "any",
      params.period || "any",
      await readTrending(params)
    )
  );
};

export default report;

if (require.main === module) {
  const language = process.argv[2];
  const period = process.argv[3];
  report({ language, period })
    .then(console.log)
    .catch(error => console.error(`Something is wrong`, error));
}
