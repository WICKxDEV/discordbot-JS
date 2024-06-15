// bot.js

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

client.once("ready", () => {
  console.log("Bot is ready!");
  updateGitHubActivity();
  setInterval(updateGitHubActivity, 3600000); // Update every 1 hour (adjust as needed)
});

async function updateGitHubActivity() {
  try {
    const activity = await getGitHubActivity(GITHUB_TOKEN, GITHUB_USERNAME);
    if (activity) {
      const embed = formatActivityEmbed(activity);
      const channel = await client.channels.fetch(CHANNEL_ID);
      if (channel && channel.isText()) {
        const lastMessage = await getLastBotMessage(channel);
        if (lastMessage) {
          await lastMessage.edit({ embeds: [embed] });
          console.log("Updated GitHub activity in Discord channel");
        } else {
          await channel.send({ embeds: [embed] });
          console.log("Sent initial GitHub activity to Discord channel");
        }
      } else {
        console.error(
          `Channel with ID ${CHANNEL_ID} not found or not a text channel.`
        );
      }
    } else {
      console.error("Error fetching GitHub activity.");
    }
  } catch (error) {
    console.error("Error updating GitHub activity in Discord channel:", error);
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

async function getLastBotMessage(channel) {
  try {
    const messages = await channel.messages.fetch({ limit: 1 });
    return messages.first();
  } catch (error) {
    console.error("Error fetching last bot message:", error);
    return null;
  }
}

function formatActivityEmbed(activity) {
  const latestEvent = activity[0];
  const embed = new MessageEmbed()
    .setColor("#1c6feb")
    .setTitle("Latest GitHub Activity")
    .setDescription(
      `Here is the latest GitHub activity for ${GITHUB_USERNAME}.`
    )
    .addField("Type", latestEvent.type, true)
    .addField("Repository", latestEvent.repo.name, true)
    .addField(
      "Timestamp",
      new Date(latestEvent.created_at).toLocaleString(),
      true
    )
    .setFooter("GitHub Bot by Your Name", "https://i.imgur.com/wSTFkRM.png")
    .setTimestamp();

  return embed;
}

client.login(TOKEN);
