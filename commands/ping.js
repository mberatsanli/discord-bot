module.exports = {
  name: "ping",
  allowBots: false,
  allowInDMChannel: false,
  allowInTextChannel: true,
  execute: (client, message) => {
    return message.reply("pong");
  }
};
