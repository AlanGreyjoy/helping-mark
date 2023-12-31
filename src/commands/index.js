/**
 * Command Auto Loader
 *
 * This file will automatically load all commands from the commands folder that end with .js
 */

const { Collection, REST, Routes } = require('discord.js')
const fs = require('fs')
const path = require('path')
const config = require('../config')

const commandsPath = path.join(__dirname, './')
const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'))

module.exports.getCommands = async () => {
  const collection = new Collection()
  const commands = []

  for (const file of commandFiles) {
    if (file === 'index.js') continue

    const filePath = path.join(commandsPath, file)
    const command = require(filePath)

    if ('data' in command && 'execute' in command) {
      commands.push(command.data.toJSON())
      collection.set(command.data.name, command)
      console.log(`[INFO] Loaded command ${command.data.name} from ${filePath}`)
    } else {
      console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`)
    }
  }

  const rest = new REST().setToken(config.BOT_TOKEN)

  try {
    console.log(`[INFO] Started refreshing ${commands.length} slash (/) commands.`)

    const data = await rest.put(Routes.applicationGuildCommands(config.APPLICATION_ID, config.GUILD_ID), {
      body: commands,
    })

    console.log(`[INFO] Successfully reloaded ${data.length} application (/) commands.`)
  } catch (error) {
    console.error(error)
  }

  return collection
}
