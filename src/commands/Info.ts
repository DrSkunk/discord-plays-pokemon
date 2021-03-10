import { MessageEmbed } from 'discord.js';
import {
  CurrentGamemode,
  DemocracyTimeout,
  Prefix,
  Romfile,
  SaveStateInterval,
  Scale,
} from '../Config';
import { getDiscordInstance } from '../DiscordClient';
import { Command } from '../types/Command';

const command: Command = {
  names: ['info', 'i'],
  description: 'Show the current loaded settings.',
  execute,
  adminOnly: false,
};

function execute(): void {
  const client = getDiscordInstance();
  if (!client) {
    throw new Error('Discord did not initialize');
  }
  const exampleEmbed = new MessageEmbed();

  exampleEmbed.addField('Prefix', '`' + Prefix + '`');
  exampleEmbed.addField(
    'Current mode',
    CurrentGamemode.charAt(0) + CurrentGamemode.slice(1).toLowerCase()
  );
  exampleEmbed.addField('Time to choose', DemocracyTimeout / 1000 + ' seconds');
  exampleEmbed.addField('Romfile', '`' + Romfile + '`');
  exampleEmbed.addField('Image scale', 'x' + Scale);
  exampleEmbed.addField(
    'Autosave interval',
    `Every ${SaveStateInterval} minute(s)`
  );
  exampleEmbed.setFooter(
    'Made with ❤️ by Sebastiaan Jansen / DrSkunk',
    'https://i.imgur.com/RPKkHMf.png'
  );

  client.sendMessage(exampleEmbed);
}
export = command;
