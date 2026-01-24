import cron from "node-cron";
import axios from "axios";
import issuesModel from "../models/issues";

const GITHUB_API_URL =
  "https://api.github.com/search/issues?q=is:issue+is:open+(label:%22good%20first%20issue%22+OR+label:%22help%20wanted%22)&sort=created&order=desc&per_page=100";

let isRunning = false;
const fetchGithubIssues = async () => {
  if (isRunning) return;
  isRunning = true;

  try {
    console.log("Fetching latest GitHub issues...");

    const MAX_PAGES = 3;
    let totalStored = 0;

    for (let page = 1; page <= MAX_PAGES; page++) {
      const response = await axios.get(`${GITHUB_API_URL}&page=${page}`, {
        headers: {
          Accept: "application/vnd.github.v3+json",
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        },
      });

      const items = response.data.items;
      if (!items || items.length === 0) break;

      // Prepare a bulk operation for MongoDB
      const bulkOps = items.map((item: any) => {
        const labels = item.labels.map((l: any) => l.name.toLowerCase());
        const difficulty = labels.includes("good first issue")
          ? "beginner"
          : labels.includes("help wanted")
            ? "intermediate"
            : "unknown";

        return {
          updateOne: {
            filter: { id: item.id },
            update: {
              $set: {
                title: item.title,
                description: item.body || "",
                repo: item.repository_url.replace(
                  "https://api.github.com/repos/",
                  "",
                ),
                difficulty,
                comments: item.comments,
                url: item.html_url,
                createdAt: item.created_at,
                updatedAt: item.updated_at,
              },
            },
            upsert: true,
          },
        };
      });

      await issuesModel.bulkWrite(bulkOps);
      totalStored += items.length;

      // await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    console.log(`Stored/updated ${totalStored} latest issues`);
  } catch (error) {
    console.error("Error fetching GitHub issues:", error);
  } finally {
    isRunning = false;
  }
};

// Run the cron job every day at midnight
const startGithubIssuesCron = () => {
  cron.schedule("*/14 * * * *", () => {
    console.log("Running GitHub issues fetch cron job...");
    fetchGithubIssues();
  });
  console.log("GitHub issues cron job started");
};

export { startGithubIssuesCron, fetchGithubIssues };
