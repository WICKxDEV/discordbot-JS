const { Client, Intents, MessageEmbed } = require("discord.js");
const axios = require("axios");

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

const TOKEN =
  "MTIxNTI4NjY1NDQ4NzQ5NDcwNw.G9N5ua.WAnSACQOfygpZpbxp5wOMlY-frM5wVH1c_QMI4";
const GITHUB_TOKEN = "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";
const GITHUB_USERNAME = "WICKxDEV";
const CHANNEL_ID = "1161691734762328166"; // Replace with your Discord channel ID
const BANNER_IMAGE_URL =
  "https://cdn.discordapp.com/attachments/1026764838464139335/1251558736820961391/standard_2.gif?ex=666f0467&is=666db2e7&hm=b9ab2dbcfe7f2204cc94b26a1e2ce7ce7594557ba4612c15f416e8f086f482c8&";

let lastEventId = null;

client.once("ready", () => {
  console.log("Bot is ready!");
  client.user.setPresence({
    activities: [
      {
        name: "Connection with GitHub",
        type: "WATCHING", // Can be 'PLAYING', 'LISTENING', 'WATCHING', 'COMPETING'
      },
    ],
  });
  updateGitHubActivity();
  setInterval(updateGitHubActivity, 60000); // Check every minute
});

async function updateGitHubActivity() {
  const activity = await getGitHubActivity(GITHUB_TOKEN, GITHUB_USERNAME);
  if (activity) {
    const latestEvent = activity[0];
    if (latestEvent.id !== lastEventId) {
      lastEventId = latestEvent.id;
      const embed = await formatActivityEmbed(latestEvent);
      const channel = await client.channels.fetch(CHANNEL_ID);
      if (channel && channel.isText()) {
        await channel.send({ embeds: [embed] });
        console.log("Sent GitHub activity to Discord channel");
      } else {
        console.error(
          `Channel with ID ${CHANNEL_ID} not found or not a text channel.`
        );
      }
    } else {
      console.log("No new activity.");
    }
  } else {
    console.error("Error fetching GitHub activity.");
  }
}

async function getGitHubActivity(token, username) {
  try {
    const response = await axios.get(
      `https://api.github.com/users/${username}/events`,
      {
        headers: {
          Authorization: `token ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching GitHub activity:", error);
    return null;
  }
}

async function getRepoContributors(token, repoName) {
  try {
    const response = await axios.get(
      `https://api.github.com/repos/${repoName}/contributors`,
      {
        headers: {
          Authorization: `token ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching repository contributors:", error);
    return [];
  }
}

async function formatActivityEmbed(event) {
  const repoUrl = `https://github.com/${event.repo.name}`;
  const contributors = await getRepoContributors(GITHUB_TOKEN, event.repo.name);

  const embed = new MessageEmbed()
    .setColor("#1c6feb")
    .setTitle(`New GitHub Event: ${event.type}`)
    .setDescription(
      `Here is the latest GitHub activity for ${GITHUB_USERNAME}.`
    )
    .addField("Event Type", event.type, true)
    .addField("Repository", `[${event.repo.name}](${repoUrl})`, true)
    .addField("Timestamp", new Date(event.created_at).toLocaleString(), true)
    .setImage(BANNER_IMAGE_URL) // Add the banner image here
    .setFooter(
      "GitHub Bot by WICKxDEV",
      "https://cdn.discordapp.com/attachments/1026764838464139335/1251558736820961391/standard_2.gif?ex=666f0467&is=666db2e7&hm=b9ab2dbcfe7f2204cc94b26a1e2ce7ce7594557ba4612c15f416e8f086f482c8&"
    )
    .setTimestamp();

  // Adding contributors with names and links to profiles
  if (contributors.length > 0) {
    const contributorList = contributors
      .map((contributor) => {
        return `[${contributor.login}](${contributor.html_url})`;
      })
      .join("\n");

    embed.addField("Contributors", contributorList);
  } else {
    embed.addField("Contributors", "No contributors found");
  }

  switch (event.type) {
    case "PushEvent":
      embed.addField(
        "Commits",
        event.payload.commits
          .map(
            (commit) =>
              `[\`${commit.sha.substring(0, 7)}\`](${commit.url}) ${
                commit.message
              }`
          )
          .join("\n")
      );
      break;
    case "PullRequestEvent":
      embed
        .addField("Action", event.payload.action)
        .addField("PR Title", event.payload.pull_request.title)
        .addField("URL", event.payload.pull_request.html_url)
        .addField(
          "Assignees",
          event.payload.pull_request.assignees
            .map((assignee) => assignee.login)
            .join(", ") || "No assignees"
        );
      break;
    default:
      embed.addField("Details", `[View Repository](${repoUrl})`);
  }

  return embed;
}

client.login(TOKEN);
