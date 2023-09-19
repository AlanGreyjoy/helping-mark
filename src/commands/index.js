/**
 * Command Auto Loader
 *
 * This file will automatically load all commands from the commands folder that end with .js
 */

const { Collection } = require('discord.js')
const fs = require('fs')
const path = require('path')

const commandsPath = path.join(__dirname, './')
const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'))

module.exports.getCommands = async () => {
  const collection = new Collection()

  for (const file of commandFiles) {
    if (file === 'index.js') continue

    const filePath = path.join(commandsPath, file)
    const command = require(filePath)

    if ('data' in command && 'execute' in command) {
      collection.set(command.data.name, command)
      console.log(`[INFO] Loaded command ${command.data.name} from ${filePath}`)
    } else {
      console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`)
    }
  }

  return collection
}
