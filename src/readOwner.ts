import OwnerParameter from "./models/OwnerParameter";
import Repository from "./models/Repository";
import fetch from "node-fetch";

interface GitHubRepository {
  name: string;
  full_name: string;
  description: string;
  fork: boolean;
  url: string;
  html_url: string;
  updated_at: string;
  pushed_at: string;
  language?: string;
}

export default async function readOwner({
  owner: author,
}: OwnerParameter): Promise<Repository[]> {
  const repositoriesUrl = `https://api.github.com/users/${author}/repos?sort=pushed&direction=desc`;
  const baselineMillis = new Date().getTime() - 24 * 60 * 60 * 1000;
  try {
    console.info({ repositoriesUrl }, "Read repos via GitHub REST API");
    const repos: GitHubRepository[] = await fetch(repositoriesUrl).then((r) =>
      r.json()
    );

    return repos
      .filter(
        (repo) =>
          repo.pushed_at && new Date(repo.pushed_at).getTime() >= baselineMillis
      )
      .map((repo) => ({
        author,
        name: repo.name,
        url: repo.html_url,
        description: `[${repo.language ?? "Unknown"}] ${
          repo.description ?? ""
        }`.trim(),
      }));
  } catch (error) {
    console.error(
      { author, repositoriesUrl },
      "Cannot fetch from repositoriesUrl"
    );
    return [];
  }
}

if (require.main === module) {
  const owner = process.argv[2];
  readOwner({ owner })
    .then(console.log)
    .catch((error) => console.error(`Something is wrong`, error));
}
