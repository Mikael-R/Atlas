"use strict";

var _discord = _interopRequireDefault(require("discord.js"));

require("dotenv/config");

var serviceCommands = _interopRequireWildcard(require("./service/commands"));

var _preferences = require("./service/preferences");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const client = new _discord.default.Client();
client.on('ready', () => {
  client.user.setActivity('love and happy!');
  console.log(`> Started: "${client.user.tag}"`);
});
client.on('guildCreate', guild => {
  console.log(`> Added: | Name${guild.name} | ID ${guild.id} | Members: ${guild.memberCount}`);
});
client.on('guildDelete', guild => {
  console.log(`> Removed: | Name: ${guild.name} | ID: ${guild.id} | Members: ${guild.memberCount}`);
});
client.on('message', msg => {
  const command = msg.content.replace(/\s{2,}/g, ' ').split(' ');
  const {
    flag,
    title,
    color
  } = (0, _preferences.getPreferences)();

  if (command[0] !== flag || msg.channel.type === 'dm' || msg.author.bot) {
    return;
  }

  const embed = serviceCommands.createEmbed(title, color);

  switch (command[1]) {
    case 'ping':
      msg.channel.send(serviceCommands.ping(embed, msg, client));
      break;

    case 'change':
      msg.channel.send(serviceCommands.changePreference(embed, command));
      break;

    case 'userinfo':
      msg.channel.send(serviceCommands.getUserInformation(embed, msg));
      break;

    default:
      msg.channel.send(serviceCommands.invalidCommand(embed, command[0]));
  }
});
client.login(process.env.TOKEN);