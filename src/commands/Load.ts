import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { getDiscordInstance } from '../DiscordClient';
import { getGameboyInstance } from '../GameboyClient';
import { Command } from '../types/Command';

const command: Command = {
  data: new SlashCommandBuilder()
    .setName('load')
    .setDescription('Load a savefile or list available saves')
    .addStringOption(
      (option) =>
        option
          .setName('filename')
          .setDescription(
            'Name of the save file to load (omit to list available saves)'
          )
          .setRequired(false)
          .setAutocomplete(true) // This could be enhanced to show available saves
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

  const saveStates = await getGameboyInstance().getSaveStates();
  const filename = interaction.options.getString('filename');

  if (filename === null) {
    // List available saves
    const reply = `\`\`\`
Available saves:
-------------------------
${saveStates.join('\n')}\`\`\``;
    await interaction.reply({ content: reply });
  } else {
    // Load specified save
    let saveFile = filename;
    if (!saveFile.endsWith('.sav')) {
      saveFile += '.sav';
    }

    if (saveStates.includes(saveFile)) {
      getGameboyInstance().loadSaveState(saveFile);
      await interaction.reply({
        content: `Loaded \`${saveFile}\``,
      });
    } else {
      await interaction.reply({
        content:
          'Invalid save given. Use `/load` without parameters to see available saves.',
        ephemeral: true,
      });
    }
  }
}
export = command;
