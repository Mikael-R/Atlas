"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getUserInformation = exports.changePreference = exports.invalidCommand = exports.ping = exports.createEmbed = void 0;

var _discord = _interopRequireDefault(require("discord.js"));

var _replaceAll = _interopRequireDefault(require("../utils/replaceAll"));

var _preferences = require("./preferences");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const createEmbed = (title, color) => {
  return new _discord.default.MessageEmbed().setTitle(title).setColor(color);
};

exports.createEmbed = createEmbed;

const invalidCommand = (embed, flag) => {
  const message = [];
  message.push(':purple_circle: Invalid command.');
  message.push(`:purple_circle: Use **${flag} help** to view command list.`);
  embed.setDescription(message.join('\n\n'));
  return embed;
};

exports.invalidCommand = invalidCommand;

const ping = (embed, msg, client) => {
  const message = [];
  message.push(':ping_pong: Pong!');
  message.push(`:purple_circle: Server: ${Date.now() - msg.createdTimestamp}ms`);
  message.push(`:purple_circle: Api: ${client.ws.ping}ms`);
  embed.setDescription(message.join('\n\n'));
  return embed;
};

exports.ping = ping;

const changePreference = (embed, command) => {
  if (!command[2] || !command[3]) {
    embed.setDescription(':purple_circle: Parameter not informed');
  } else if (!(0, _preferences.existPreference)(command[2])) {
    embed.setDescription(`:purple_circle: Parameter "${command[2]}" not found`);
  } else {
    const newValue = command.join(' ').match(/('|")(.*)('|")/) ? (0, _replaceAll.default)(command.join(' ').match(/('|")(.*)('|")/)[0], ['\'', '"'], '') : command[3];
    (0, _preferences.updatePreference)(command[2], newValue);
    embed.setDescription(`:purple_circle: Changed: **${command[2]}** to **${newValue}**`);
  }

  return embed;
};

exports.changePreference = changePreference;

const getUserInformation = (embed, msg) => {
  const user = msg.mentions.users.first() || msg.author;
  const userInformation = {
    tag: user.tag,
    name: user.username,
    discriminator: `#${user.discriminator}`,
    avatar: user.displayAvatarURL(),
    isBot: user.bot ? 'Yes' : 'No',
    id: user.id,
    status: user.presence.status,
    createAccount: user.createdAt.toLocaleDateString('en-US'),
    joined: msg.guild.members.resolve(user.id).joinedAt.toLocaleDateString('en-US')
  };
  embed.setAuthor(userInformation.tag, userInformation.avatar).setThumbnail(userInformation.avatar).addField('Name', userInformation.name, true).addField('Discriminator', userInformation.discriminator, true).addField('Status', userInformation.status, true).addField('Bot', userInformation.isBot, true).addField('Create Account', userInformation.createAccount, true).addField('Joined', userInformation.joined, true).addField('ID', userInformation.id, false);
  return embed;
};

exports.getUserInformation = getUserInformation;