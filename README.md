# GitHub Activity Discord Bot

This project is a Discord bot that monitors GitHub activity and posts updates to a specified Discord channel. It uses the GitHub API to fetch the latest events and formats them into rich embeds using Discord.js.

## Showcase

![Uploading #⛓-github-activity _ DEV-HUB - Discord 6_18_2024 10_09_55 PM.png…]()


## Features

- Monitors GitHub user activity and posts updates to a Discord channel.
- Includes detailed information about events such as pushes and pull requests.
- Periodically checks for new activity every minute.
- Supports slash commands, like `/ping`, to interact with the bot.

## Prerequisites

- Node.js (v14.0.0 or higher)
- npm (v6.0.0 or higher)
- A Discord bot token
- A GitHub personal access token

## Setup

1. **Clone the repository:**

   ```sh
   git clone https://github.com/your-username/github-activity-discord-bot.git
   cd github-activity-discord-bot
   ```

2. **Install dependencies:**

   ```sh
   npm install
   ```

3. **Configure environment variables:**

   fill in your credentials:

   ```
   DISCORD_TOKEN=your_discord_bot_token
   GITHUB_TOKEN=your_github_personal_access_token
   GITHUB_USERNAME=your_github_username
   CHANNEL_ID=your_discord_channel_id
   ```

4. **Run the bot:**
   ```sh
   node index.js
   ```

## Usage

Once the bot is running, it will:

- Post GitHub activity updates to the specified Discord channel.
- Respond to the `/ping` command with the bot's latency.

## Slash Commands

### `/ping`

- Responds with the bot's WebSocket latency.

## Code Overview

- `index.js`: Main entry point for the bot.
- `updateGitHubActivity()`: Fetches the latest GitHub activity and posts updates to Discord.
- `getGitHubActivity()`: Fetches user events from the GitHub API.
- `formatActivityEmbed()`: Formats a GitHub event into a Discord embed.
- `getRepoContributors()`: Fetches contributors of a repository from the GitHub API.

## Important Notes

- Make sure to keep your tokens secure and do not expose them publicly.
- Adjust the `setInterval` duration in `updateGitHubActivity()` to change the frequency of activity checks.

## Contributing

Feel free to submit issues and pull requests to help improve this project. Contributions are always welcome!

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
