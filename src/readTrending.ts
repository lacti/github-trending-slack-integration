import Repository from "./models/Repository";
import TrendingParameter from "./models/TrendingParameters";
import fetch from "node-fetch";
import isAny from "./support/isAny";
import { parse as parseHtml } from "node-html-parser";

export default async function readTrending({
  language,
  period,
}: TrendingParameter): Promise<Repository[]> {
  let trendingUrl = `https://github.com/trending/`;
  if (!isAny(language)) {
    trendingUrl += encodeURIComponent(language!);
  }
  if (!isAny(period)) {
    trendingUrl += `?since=${period}`;
  }
  try {
    console.info({ trendingUrl }, "Read trendings from GitHub page");
    const response = await fetch(trendingUrl).then((r) => r.text());
    const html = parseHtml(response);
    return html.querySelectorAll(`.Box-row`).map((article) => {
      const a = article.querySelector(`h1 a`);
      const [, author, name] = a.attributes.href.trim().split("/");
      const repoLang = (
        article.querySelector(`span[itemprop=programmingLanguage]`)
          ?.innerText ?? "Unknown"
      ).trim();
      let description = (
        article.querySelector(`p.color-text-secondary`)?.innerText ?? ""
      ).trim();
      if (isAny(language)) {
        description = (`[${repoLang}] ` + description).trim();
      }
      return {
        author,
        name,
        url: `https://github.com/${author}/${name}`,
        description,
      };
    });
  } catch (error) {
    console.error({ trendingUrl, error }, "Cannot fetch from trendingUrl");
    return [];
  }
}

if (require.main === module) {
  const language = process.argv[2];
  const period = process.argv[3];
  readTrending({ language, period }).then(console.info);
}
