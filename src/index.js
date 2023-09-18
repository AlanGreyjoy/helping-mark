require('dotenv').config();
const { Client, GatewayIntentBits, MessageEmbed } = require('discord.js');
const fs = require('fs');
const path = require('path');

const commands = require('./commands');

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN; // Replace with your actual bot token
const GUILD_ID = process.env.GUILD_ID; // Replace with your actual guild ID

const commandsNo = [
  {
    name: 'race',
    description: 'Add or remove a race time for a course',
    type: 'CHAT_INPUT',
    options: [
      {
        name: 'command',
        description: 'Command: add or remove',
        type: 'STRING',
        required: true,
        choices: [
          { name: 'add', value: 'add' },
          { name: 'remove', value: 'remove' },
        ],
      },
      {
        name: 'time',
        description: 'Race time (use format HH:MM:SS)',
        type: 'STRING',
        required: false,
      },
      {
        name: 'course',
        description: 'Course name',
        type: 'STRING',
        required: false,
        choices: [], // Add your course choices here
      },
    ],
  },
  {
    name: 'leaderboard',
    description: 'Manage course leaderboards',
    type: 'CHAT_INPUT',
    options: [
      {
        name: 'command',
        description: 'Command: add, remove, or show',
        type: 'STRING',
        required: true,
        choices: [
          { name: 'add', value: 'add' },
          { name: 'remove', value: 'remove' },
          { name: 'show', value: 'show' },
        ],
      },
      {
        name: 'course',
        description: 'Course name',
        type: 'STRING',
        required: false,
      },
    ],
  },
];

const rest = new REST({ version: '10' }).setToken(BOT_TOKEN);

const leaderboardMessages = {};
const raceTimes = {};
const courses = new Set();
const addedCourses = [...courses];

/**
 * Creates a leaderboard embedded message.
 */
client.once('ready', async () => {
  client.commands = commands;
  console.log(`Logged in as ${client.user.tag} - ${client.user.id}`);
});

/**
 * Handles interaction events.
 */
client.on('messageCreate', async (message) => {
  // Your message handling logic here...
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  if (commandName === 'race') {
    const command = interaction.options.getString('command');
    const time = interaction.options.getString('time');
    const course = interaction.options.getString('course');

    client.on('interactionCreate', async (interaction) => {
      if (!interaction.isCommand()) return;

      const { commandName } = interaction;

      console.log(commandName);

      if (commandName === 'race') {
        const command = interaction.options.getString('command');
        const time = interaction.options.getString('time');
        const course = interaction.options.getString('course');

        // Check if the provided course name is registered
        if (course && !courses.has(course)) {
          await interaction.reply({
            content: 'Course not found. Please use a registered course name.',
            ephemeral: true,
          });
          return;
        }

        if (command === 'add') {
          // Your logic to add a race time...
          // Check if the time belongs in the top ten
          if (timeBelongsInTopTen(course, time)) {
            // Edit the embedded message in the thread to include the updated leaderboard
            await editLeaderboardMessage(interaction, course);
          }
        } else if (command === 'remove') {
          // Your logic to remove a race time...
        }
      }
    });

    function timeBelongsInTopTen(courseName, time) {
      // Check if the provided time belongs in the top ten for the specified course
      // You can implement your logic to compare times here
      return true; // Replace with your logic
    }

    async function editLeaderboardMessage(interaction, courseName) {
      // Edit the embedded message in the thread to include the updated leaderboard
      const thread = interaction.guild.threads.cache.find(
        (thread) => thread.name === courseName
      );

      if (thread) {
        const leaderboardEmbed = createLeaderboardEmbed(courseName); // Generate the updated leaderboard
        const firstMessage = await thread.messages.fetchPinned().first();

        if (firstMessage) {
          await firstMessage.edit({ embeds: [leaderboardEmbed] });
        }
      }
    }

    function createLeaderboardEmbed(courseName) {
      // Generate the updated leaderboard as an embedded message
      // You can implement your logic to format the leaderboard here
      const leaderboardEmbed = new MessageEmbed()
        .setTitle(`Leaderboard for ${courseName}`)
        .setDescription('Updated leaderboard goes here.');

      return leaderboardEmbed;
    }
  } else if (commandName === 'leaderboard') {
    const command = interaction.options.getString('command');
    const course = interaction.options.getString('course');

    // Your /leaderboard logic...
    const courses = new Set();
    const leaderboardMessages = new Map();

    client.on('interactionCreate', async (interaction) => {
      if (!interaction.isCommand()) return;

      const { commandName } = interaction;

      if (commandName === 'leaderboard') {
        const command = interaction.options.getString('command');
        const course = interaction.options.getString('course');

        if (command === 'add') {
          if (!course) {
            await interaction.reply({
              content:
                'Incomplete /leaderboard add command. Usage: /leaderboard add <course>',
              ephemeral: true,
            });
            return;
          }

          // Your logic to add a course to the leaderboard
          const courseName = course.toLowerCase();
          if (courses.has(courseName)) {
            await interaction.reply({
              content: 'Course already exists.',
              ephemeral: true,
            });
          } else {
            courses.add(courseName);

            // Create a placeholder message in the same channel
            const leaderboardMessage = await interaction.channel.send({
              embeds: [createLeaderboardEmbed(courseName)],
            });

            await interaction.reply(`Course ${courseName} added.`);

            // Store the message ID for future reference
            leaderboardMessages.set(courseName, leaderboardMessage.id);

            // Create a sub-thread for the course
            const category = interaction.guild.channels.cache.find(
              (channel) =>
                channel.type === 'GUILD_CATEGORY' &&
                channel.name === 'Leaderboards'
            ); // Adjust the category name
            const threadName = courseName;
            const autoArchiveDuration = 1440; // Adjust as needed

            const subThread = await interaction.guild.channels.create(
              threadName,
              {
                type: 'GUILD_PUBLIC_THREAD',
                parent: category,
                autoArchiveDuration: autoArchiveDuration,
              }
            );

            await subThread.send(
              `Welcome to the leaderboard for ${courseName}!`
            );

            // Edit the leaderboard message to include the updated leaderboard
            await editLeaderboardMessage(interaction, courseName);
          }
        }
      }
    });
  }
});

client.login(BOT_TOKEN);
