import Repository from "../models/Repository";
import capitalize from "./capitalize";

export default function asSlackMessage(
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
