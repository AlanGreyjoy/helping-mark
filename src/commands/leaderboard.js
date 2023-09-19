const { SlashCommandBuilder, EmbedBuilder, ChannelType } = require('discord.js')

const generators = require('../utils/generators')

//Globals
const courses = new Set()
const leaderboardMessages = new Map()

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
    .addStringOption((option) => option.setName('course').setDescription('Course name').setRequired(false)),

  async execute(interaction) {
    const command = interaction.options.getString('command')
    const course = interaction.options.getString('course')

    switch (command) {
      case 'add':
        if (!course) {
          await interaction.reply({
            content: 'Incomplete /leaderboard add command. Usage: /leaderboard add <course>',
            ephemeral: true,
          })
          return
        }

        addCourse(course, interaction)
        break

      case 'remove':
        removeCourse(course, interaction)
        break

      case 'show':
        showCourse(course, interaction)
        break
    }
  },
}

/**
 * Add a course to the leaderboard
 * @param {String} courseName
 * @param {Interaction Instance} interaction
 * @returns
 */
async function addCourse(courseName, interaction) {
  console.log(`[INFO] Adding course ${courseName}...`)

  const course = courseName.toLowerCase()

  if (courses.has(course)) {
    await interaction.reply({
      content: 'Course already exists.',
      ephemeral: true,
    })

    return
  }

  courses.add(course)

  // Create a placeholder message in the same channel
  const leaderboardMessage = await interaction.channel.send({
    embeds: [await createLeaderboardEmbed(course)],
  })

  leaderboardMessages.set(course, leaderboardMessage)

  await interaction.reply(`Course ${course} added.`)

  // Store the message ID for future reference
  leaderboardMessages.set(course, leaderboardMessage.id)

  // Create a sub-thread for the course
  const category = interaction.guild.channels.cache.find(
    (channel) => channel.type === 'GUILD_CATEGORY' && channel.name === 'Leaderboards'
  )

  console.log(`[INFO] Found category ${category}`)

  // Adjust the category name
  const threadName = courseName
  const autoArchiveDuration = 1440 // Adjust as needed

  const thread = await interaction.channel.threads.create({
    name: threadName,
    autoArchiveDuration: autoArchiveDuration,
  })

  await thread.send(`Welcome to the leaderboard for ${courseName}!`)

  return Promise.resolve()
}

/**
 * Remove a course from the leaderboard
 * @param {*} courseName
 */
async function removeCourse(courseName, interaction) {
  console.log(`[INFO] Removing course ${courseName}...`)
}

/**
 * Show a course from the leaderboard
 * @param {*} courseName
 */
async function showCourse(courseName, interaction) {
  console.log(`[INFO] Showing course ${courseName}...`)
}

/**
 * Create a leaderboard embed
 * @param {*} courseName
 * @returns
 */
async function createLeaderboardEmbed(courseName, interaction) {
  const leaderboardEmbed = new EmbedBuilder()
    .setTitle(`Leaderboard for ${courseName}`)
    .setDescription('Updated leaderboard goes here.')

  return leaderboardEmbed
}

/**
 * Edit the leaderboard message
 * @param {*} interaction
 * @param {*} courseName
 */
async function editLeaderboardMessage(interaction, courseName) {
  // Edit the embedded message in the thread to include the updated leaderboard
  const thread = interaction.guild.threads.cache.find((thread) => thread.name === courseName)

  if (thread) {
    const leaderboardEmbed = createLeaderboardEmbed(courseName) // Generate the updated leaderboard
    const firstMessage = await thread.messages.fetchPinned().first()

    if (firstMessage) {
      await firstMessage.edit({ embeds: [leaderboardEmbed] })
    }
  }
}
