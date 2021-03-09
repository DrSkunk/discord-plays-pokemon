import { Message, MessageEmbed } from 'discord.js';
import { Prefix } from '../Config';
import { getDiscordInstance } from '../DiscordClient';
import { Command } from '../types/Command';

const command: Command = {
  names: ['help', 'h'],
  description: 'Display this help information',
  execute,
};

async function execute(msg: Message, args: string[]) {
  const client = getDiscordInstance()!;
  const exampleEmbed = new MessageEmbed();

  getDiscordInstance()!.commands.forEach((command) => {
    let description = command.description;
    if (command.names.length > 1) {
      description += '\n Aliases: ';
      description += command.names
        .slice(1)
        .map((name) => `**${Prefix}${name}**`)
        .join(', ');
    }
    exampleEmbed.addField(Prefix + command.names[0], description);
  });

  exampleEmbed.setFooter(
    'Made with ❤️ by Sebastiaan Jansen / DrSkunk',
    'https://i.imgur.com/RPKkHMf.png'
  );

  client.sendMessage(exampleEmbed);
}
export = command;
