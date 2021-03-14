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
  names: ['settings'],
  description: 'Show the current loaded settings.',
  execute,
  adminOnly: false,
};

function execute(): void {
  const client = getDiscordInstance();
  if (!client) {
    throw new Error('Discord did not initialize');
  }
  const emulatorEmbed = new MessageEmbed();

  emulatorEmbed.addField('Prefix', '`' + Prefix + '`');
  emulatorEmbed.addField(
    'Current mode',
    CurrentGamemode.charAt(0) + CurrentGamemode.slice(1).toLowerCase()
  );
  emulatorEmbed.addField(
    'Time to choose',
    DemocracyTimeout / 1000 + ' seconds'
  );
  emulatorEmbed.addField('Romfile', '`' + Romfile + '`');
  emulatorEmbed.addField('Image scale', 'x' + Scale);
  emulatorEmbed.addField(
    'Autosave interval',
    `Every ${SaveStateInterval} minute(s)`
  );
  emulatorEmbed.setFooter(
    'Made with ❤️ by Sebastiaan Jansen / DrSkunk',
    'https://i.imgur.com/RPKkHMf.png'
  );

  client.sendMessage(emulatorEmbed);
}
export = command;
