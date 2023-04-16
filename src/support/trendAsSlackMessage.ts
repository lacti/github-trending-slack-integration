import Repository from "../models/Repository.js";
import capitalize from "./capitalize.js";

export default function trendAsSlackMessage(
  language: string,
  period: string,
  repositories: Repository[]
) {
  return {
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
          .join("\n"),
      },
    ],
  };
}
