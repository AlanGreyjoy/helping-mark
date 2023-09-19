require('dotenv').config()
const { Client, GatewayIntentBits, MessageEmbed, Collection, Events } = require('discord.js')
const { getCommands } = require('./commands')
const config = require('./config')

const BOT_TOKEN = config.BOT_TOKEN
const GUILD_ID = config.GUILD_ID

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
})

startDiscordBot()

/**
 * Client Ready Event
 */
client.on(Events.ClientReady, async () => {
  console.log(`[INFO] Logged in as ${client.user.tag} - ${client.user.id}`)
})

/**
 * Client Interaction Create Event
 */
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return

  const command = interaction.client.commands.get(interaction.commandName)

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`)
    return
  }

  try {
    console.log(`[INFO] Running command: ${interaction.commandName}...`)
    await command.execute(interaction, this)
  } catch (error) {
    console.error(error)
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true })
    } else {
      await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true })
    }
  }
})

async function startDiscordBot() {
  client.commands = await getCommands()
  client.login(BOT_TOKEN)
}
