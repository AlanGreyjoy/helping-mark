const { SlashCommandBuilder } = require('@discordjs/builders')
const generators = require('../utils/generators')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('Manage course leaderboards')
    .addStringOption((option) =>
      option.setName('add').setDescription('Create a new leaderboard for a course').setRequired(true).addChoices(
        {
          name: 'Add',
          value: 'add',
        },
        {
          name: 'Remove',
          value: 'remove',
        },
        {
          name: 'Show',
          value: 'show',
        }
      )
    ),

  async execute(interaction) {
    const players = [
      { name: 'Alice', score: 100 },
      { name: 'Bob', score: 85 },
      { name: 'Charlie', score: 120 },
    ]

    const table = generators.generateLeaderBoard(players)

    await interaction.reply(table)
  },
}
