import {
  EmbedBuilder,
  SlashCommandBuilder,
  ChatInputCommandInteraction,
} from 'discord.js';
import { getDiscordInstance } from '../DiscordClient';
import { Command } from '../types/Command';

const command: Command = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Display help information about Discord Plays Pokemon'),
  execute,
};

async function execute(
  interaction: ChatInputCommandInteraction
): Promise<void> {
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
    const data = command.data;
    const description = data.description;

    embed.addFields({
      name: `/${data.name}`,
      value: description,
    });
  });

  embed.setFooter({
    text: 'Made with ❤️ by Sebastiaan Jansen / DrSkunk',
    iconURL: 'https://i.imgur.com/RPKkHMf.png',
  });

  await interaction.reply({ embeds: [embed] });
}

export = command;
