import Repository from "../models/Repository.js";
import capitalize from "./capitalize.js";

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
