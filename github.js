// github.js

const axios = require("axios");

// Function to fetch GitHub activity using Personal Access Token
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

module.exports = {
  getGitHubActivity,
};
