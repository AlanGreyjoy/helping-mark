const { SlashCommandBuilder } = require('@discordjs/builders')
const generators = require('../utils/generators')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('Manage course leaderboards')
    .addStringOption((option) => option.setName('course').setDescription('Course name').setRequired(false)),
  async execute(interaction) {
    const players = [
      { name: 'Alice', score: 100 },
      { name: 'Bob', score: 85 },
      { name: 'Charlie', score: 120 },
    ]

    const table = generators.generateLeaderboard(players)

    await interaction.reply(table)
  },
}
