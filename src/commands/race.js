const { SlashCommandBuilder } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('race')
    .setDescription('Add or remove a race time for a course')
    .addStringOption((option) =>
      option.setName('command').setDescription('Command: add or remove').setRequired(true).addChoices(
        {
          name: 'Add',
          value: 'add',
        },
        {
          name: 'Remove',
          value: 'remove',
        }
      )
    )
    .addStringOption((option) =>
      option.setName('time').setDescription('Race time (use format HH:MM:SS)').setRequired(true)
    )
    .addStringOption((option) => option.setName('course').setDescription('Course name').setRequired(true).addChoices()),

  async execute(interaction) {
    const command = interaction.options.getString('command')
    const time = interaction.options.getString('time')

    console.log(`[INFO] Running command: ${interaction.commandName}...`)
    console.log(`[INFO] Command: ${command}`)
    console.log(`[INFO] Time: ${time}`)

    //Have fun!

    await interaction.reply('[INFO] This command is not yet implemented.')
  },
}
