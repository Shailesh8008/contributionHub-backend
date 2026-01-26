import axios from "axios";
import cron from "node-cron";
import issuesModel from "../models/issues";
import reposModel from "../models/repos";

let isRunning = false;
const fetchRepos = async () => {
  if (isRunning) return;
  isRunning = true;

  try {
    const uniqueRepos = await issuesModel.distinct("repo");
    console.log(uniqueRepos.length + " repos fetched");
    const existingRepos = await reposModel.find({
      fullName: { $in: uniqueRepos },
    });
    const repoMap = new Map(existingRepos.map((r) => [r.fullName, r]));

    const reposToFetch = uniqueRepos.filter((repo) => {
      const cached = repoMap.get(repo);
      if (!cached) return true;

      const ONE_DAY = 24 * 60 * 60 * 1000;
      if (!cached?.lastSynced) return true;

      return Date.now() - cached.lastSynced.getTime() > ONE_DAY;
    });

    for (const repoFullName of reposToFetch) {
      const res = await axios.get(
        `https://api.github.com/repos/${repoFullName}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
            Accept: "application/vnd.github.v3+json",
          },
        },
      );

      await reposModel.updateOne(
        { fullName: repoFullName },
        {
          $set: {
            stars: res.data.stargazers_count,
            language: res.data.language,
            lastSynced: new Date(),
          },
        },
        { upsert: true },
      );
    }

    const repos = await reposModel.find({
      fullName: { $in: uniqueRepos },
    });

    console.log("languages from " + repos.length + " to be updated in issues");

    const bulkOps = [];

    for (const repo of repos) {
      bulkOps.push({
        updateMany: {
          filter: { repo: repo.fullName },
          update: {
            $set: {
              stars: repo.stars,
              language: repo.language,
            },
          },
        },
      });
    }

    if (bulkOps.length) {
      await issuesModel.bulkWrite(bulkOps);
    }
  } catch (error) {
    console.log("Error fetching GitHub repos:", error);
  } finally {
    isRunning = false;
  }
};

//Cron-Job
const startGithubRepoCron = () => {
  cron.schedule("0 */12 * * *", () => {
    console.log("Running GitHub repo fetch cron job...");
    fetchRepos();
  });
  console.log("GitHub repo cron job started");
};

export { startGithubRepoCron, fetchRepos };
