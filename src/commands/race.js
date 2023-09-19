const { SlashCommandBuilder } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder().setName('race').setDescription('Add or remove a race time for a course'),
  async execute(interaction) {
    await interaction.reply('Hello world!')
  },
}
