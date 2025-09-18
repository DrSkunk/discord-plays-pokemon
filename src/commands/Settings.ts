import { EmbedBuilder } from 'discord.js';
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
  const emulatorEmbed = new EmbedBuilder();

  emulatorEmbed.addFields(
    { name: 'Prefix', value: '`' + Prefix + '`' },
    {
      name: 'Current mode',
      value: CurrentGamemode.charAt(0) + CurrentGamemode.slice(1).toLowerCase(),
    },
    {
      name: 'Time to choose',
      value: DemocracyTimeout / 1000 + ' seconds',
    },
    { name: 'Romfile', value: '`' + Romfile + '`' },
    { name: 'Image scale', value: 'x' + Scale },
    {
      name: 'Autosave interval',
      value: `Every ${SaveStateInterval} minute(s)`,
    }
  );
  emulatorEmbed.setFooter({
    text: 'Made with ❤️ by Sebastiaan Jansen / DrSkunk',
    iconURL: 'https://i.imgur.com/RPKkHMf.png',
  });

  client.sendMessage(emulatorEmbed);
}
export = command;
