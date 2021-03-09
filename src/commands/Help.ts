import { Message, MessageEmbed } from 'discord.js';
import { Prefix } from '../Config';
import { getDiscordInstance } from '../DiscordClient';
import { Command } from '../types/Command';

const command: Command = {
  name: 'help',
  description: 'Display this help information',
  execute,
};

async function execute(msg: Message, args: string[]) {
  const client = getDiscordInstance()!;
  const exampleEmbed = new MessageEmbed();

  getDiscordInstance()!.commands.forEach((command) => {
    exampleEmbed.addField(Prefix + command.name, command.description);
  });

  exampleEmbed.setFooter(
    'Made with ❤️ by Sebastiaan Jansen / DrSkunk',
    'https://i.imgur.com/RPKkHMf.png'
  );

  client.sendMessage(exampleEmbed);
}
export = command;
