const { SlashCommandBuilder } = require('@discordjs/builders')
const generators = require('../utils/generators')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('Manage course leaderboards')
    .addStringOption((option) =>
      option.setName('command').setDescription('Create a new leaderboard for a course').setRequired(true).addChoices(
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
    )
    .addStringOption((option) => option.setName('course').setDescription('Course name').setRequired(true)),

  async execute(interaction) {
    const command = interaction.options.getString('command')
    const course = interaction.options.getString('course')

    const courses = []
    const leaderboardMessages = []

    await interaction.reply('[INFO] This command is not yet implemented.')
  },
}
