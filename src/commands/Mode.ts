import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { setGameMode } from '../Config';
import { getDiscordInstance } from '../DiscordClient';
import { Gamemode } from '../enums/Gamemode';
import { Command } from '../types/Command';

const command: Command = {
  data: new SlashCommandBuilder()
    .setName('mode')
    .setDescription('Change the mode to Anarchy or Democracy mode')
    .addStringOption((option) =>
      option
        .setName('gamemode')
        .setDescription('The game mode to set')
        .setRequired(true)
        .addChoices(
          { name: 'Anarchy (first action executed)', value: 'ANARCHY' },
          { name: 'Democracy (most votes executed)', value: 'DEMOCRACY' }
        )
    )
    .setDefaultMemberPermissions(0), // Require admin permissions
  execute,
};

async function execute(
  interaction: ChatInputCommandInteraction
): Promise<void> {
  const client = getDiscordInstance();
  if (!client) {
    throw new Error('Discord did not initialize');
  }

  const newMode = interaction.options.getString('gamemode');
  if (!newMode) {
    await interaction.reply({
      content: 'No game mode specified.',
      ephemeral: true,
    });
    return;
  }

  const mode = newMode.toUpperCase();

  if (mode !== Gamemode.Anarchy && mode !== Gamemode.Democracy) {
    await interaction.reply({
      content: 'Invalid game mode. Please select either Anarchy or Democracy.',
      ephemeral: true,
    });
    return;
  }

  setGameMode(mode as Gamemode);
  await interaction.reply({
    content: `Mode set to \`${mode}\``,
  });
}
export = command;
