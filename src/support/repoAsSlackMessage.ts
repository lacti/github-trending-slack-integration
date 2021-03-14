import Repository from "../models/Repository";
import capitalize from "./capitalize";

export default function repoAsSlackMessage(
  owner: string,
  repositories: Repository[]
) {
  return {
    username: `${capitalize(owner)}`,
    attachments: [
      {
        color: "#eeeeee",
        text: repositories
          .map(
            (repo, index) =>
              `${index + 1}. <${repo.url}|${repo.name}> ${repo.description}`
          )
          .join("\n"),
      },
    ],
  };
}
