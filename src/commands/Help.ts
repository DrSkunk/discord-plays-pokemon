import { EmbedBuilder } from 'discord.js';
import { Prefix } from '../Config';
import { getDiscordInstance } from '../DiscordClient';
import { Command } from '../types/Command';

const command: Command = {
  names: ['help', 'h'],
  description: 'Display this help information',
  execute,
  adminOnly: false,
};

function execute(): void {
  const client = getDiscordInstance();
  if (!client) {
    throw new Error('Discord did not initialize');
  }
  const embed = new EmbedBuilder();

  embed.setTitle('Discord plays pokemon');
  embed.setDescription(
    'Visit https://github.com/DrSkunk/discord-plays-pokemon for source code'
  );
  embed.setURL('https://github.com/DrSkunk/discord-plays-pokemon');

  client.commands.forEach((command) => {
    let description = command.description;
    if (command.names.length > 1) {
      description += '\n Aliases: ';
      description += command.names
        .slice(1)
        .map((name) => `**${Prefix}${name}**`)
        .join(', ');
    }
    if (command.adminOnly) {
      description += '\n **Admin only**';
    }
    embed.addFields({
      name: Prefix + command.names[0],
      value: description,
    });
  });

  embed.setFooter({
    text: 'Made with ❤️ by Sebastiaan Jansen / DrSkunk',
    iconURL: 'https://i.imgur.com/RPKkHMf.png',
  });

  client.sendMessage(embed);
}
export = command;
