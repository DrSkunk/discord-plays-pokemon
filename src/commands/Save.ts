import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { getDiscordInstance } from '../DiscordClient';
import { getGameboyInstance } from '../GameboyClient';
import { Command } from '../types/Command';

const command: Command = {
  data: new SlashCommandBuilder()
    .setName('save')
    .setDescription('Save the current state to a new file')
    .addStringOption((option) =>
      option
        .setName('filename')
        .setDescription(
          'Optional filename (timestamp will be used if not provided)'
        )
        .setRequired(false)
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

  const filename = interaction.options.getString('filename');
  let savedFileLocation: string;

  if (filename === null) {
    savedFileLocation = await getGameboyInstance().newSaveState();
  } else {
    savedFileLocation = await getGameboyInstance().newSaveState(filename);
  }

  await interaction.reply({
    content: `Saved to \`${savedFileLocation}\``,
  });
}
export = command;
