import {
  EmbedBuilder,
  SlashCommandBuilder,
  ChatInputCommandInteraction,
} from 'discord.js';
import {
  CurrentGamemode,
  DemocracyTimeout,
  Romfile,
  SaveStateInterval,
  Scale,
} from '../Config';
import { getDiscordInstance } from '../DiscordClient';
import { Command } from '../types/Command';

const command: Command = {
  data: new SlashCommandBuilder()
    .setName('settings')
    .setDescription('Show the current loaded settings'),
  execute,
};

async function execute(
  interaction: ChatInputCommandInteraction
): Promise<void> {
  const client = getDiscordInstance();
  if (!client) {
    throw new Error('Discord did not initialize');
  }
  const emulatorEmbed = new EmbedBuilder();

  emulatorEmbed.addFields(
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

  await interaction.reply({ embeds: [emulatorEmbed] });
}
export = command;
