require('dotenv').config();
const fs = require("fs").promises;
const Discord = require("discord.js");
const DiscordCommandParser = require("discord-command-parser");

const client = new Discord.Client();
client.commands = new Discord.Collection();

client.once('ready', (test, a) => {
  console.log('Bot is ready :)');
});

client.on("message", (message) => {
  if (client.user.id === message.author.id) return;

  const parsed = DiscordCommandParser.parse(message, process.env.BOT_COMMAND_PREFIX, { allowSpaceBeforeCommand: true });
  if (!parsed.success) return;

  if (!client.commands.has(parsed.command)) {
    return message.reply("Command not found :(");
  }
  const command = client.commands.get(parsed.command);

  if (!command) return;

  if (message.channel.type === "dm" && !command.allowInDMChannel) {
    return message.reply("Sorry this command not allowed in DM");
  }

  if (message.channel.type === "text" && !command.allowInTextChannel) {
    return message.reply("Sorry this command not allowed in TextChannel");
  }

  if ("allowBots" in command) {
    if (message.author.bot !== command.allowBots) {
      return message.reply("This command is not for bots, sorry :(");
    }
  }

  return command.execute(client, message);
});


fs.readdir('./commands')
  .then((files) => {
    console.log("Commands loading!");
    files = files.filter((file) => file.endsWith('.js'));

    files.forEach((file) => {
      import(`./commands/${file}`)
        .then(({ default: commandFile }) => {
          client.commands.set(commandFile.name, commandFile)
        }).catch(() => {
          console.log(`./commands/${file} is not founded!`);
        });
    });

    return client.login(process.env.BOT_DISCORD_TOKEN)
      .then(() => {
        console.log("Login successful");
      })
      .catch(() => {
        console.log("Oops!, Token does not work!!");
      });
  }).catch(() => {
    console.log('commands are not loaded!');
  });

