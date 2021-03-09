import { Message } from 'discord.js';
import { getDiscordInstance } from '../DiscordClient';
import { getGameboyInstance } from '../GameboyClient';
import { Command } from '../types/Command';

const command: Command = {
  names: ['load', 'l'],
  description:
    'Load a savefile. Run without a filename to list all available saves.',
  execute,
};

function execute(_msg: Message, args: string[]): void {
  const client = getDiscordInstance();
  if (!client) {
    throw new Error('Discord did not initialize');
  }
  const saveStates = getGameboyInstance().getSaveStates();
  if (args.length === 0) {
    const reply = `\`\`\`\
Available saves:
-------------------------
${saveStates.join('\n')}\`\`\``;
    client.sendMessage(reply);
  } else {
    let filename = args[0];
    if (!filename.endsWith('.sav')) {
      filename += '.sav';
    }
    if (saveStates.includes(filename)) {
      getGameboyInstance().loadSaveState(filename);
      client.sendMessage(`Loaded \`${filename}\``);
    } else {
      client.sendMessage('Invalid save given');
    }
  }
}
export = command;
