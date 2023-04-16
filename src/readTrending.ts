import Repository from "./models/Repository.js";
import TrendingParameter from "./models/TrendingParameters.js";
import fetch from "node-fetch";
import isAny from "./support/isAny.js";
import { parse as parseHtml } from "node-html-parser";
import translateBulk from "./translate/translateBulk.js";

export default async function readTrending({
  language,
  period,
}: TrendingParameter): Promise<Repository[]> {
  let trendingUrl = `https://github.com/trending/`;
  if (!isAny(language)) {
    trendingUrl += encodeURIComponent(language!);
  }
  trendingUrl += "?spoken_language_code=";
  if (!isAny(period)) {
    trendingUrl += `&since=${period}`;
  }
  try {
    console.info({ trendingUrl }, "Read trendings from GitHub page");
    const response = await fetch(trendingUrl).then((r) => r.text());
    const html = parseHtml(response);
    const trendings = html.querySelectorAll(`.Box-row`).map((article) => {
      const a = article.querySelector(`h2 a`);
      const [, author, name] = a!.attributes.href.trim().split("/");
      const repoLang = (
        article.querySelector(`span[itemprop=programmingLanguage]`)
          ?.innerText ?? "Unknown"
      ).trim();
      let description = (article.querySelector(`p`)?.innerText ?? "").trim();
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

    // Experimental: translate zh-CN description to en.
    await translateBulk({
      values: trendings,
      getText: (t) => t.description,
      setText: (trending, translated) => (trending.description = translated),
    });
    return trendings;
  } catch (error: any) {
    console.error({ trendingUrl, error }, "Cannot fetch from trendingUrl");
    return [];
  }
}
