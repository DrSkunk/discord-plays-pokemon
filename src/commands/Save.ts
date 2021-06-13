import { Message } from 'discord.js';
import { getDiscordInstance } from '../DiscordClient';
import { getGameboyInstance } from '../GameboyClient';
import { Command } from '../types/Command';

const command: Command = {
  names: ['save', 's'],
  description:
    'Save the current state to a new file. Optionally supply a filename, otherwise the timestamp will be used',
  execute,
  adminOnly: true,
};

async function execute(_msg: Message, args: string[]): Promise<void> {
  const client = getDiscordInstance();
  if (!client) {
    throw new Error('Discord did not initialize');
  }
  let savedFileLocation: string;
  if (args.length === 0) {
    savedFileLocation = await getGameboyInstance().newSaveState();
  } else {
    const filename = args.join('_');
    savedFileLocation = await getGameboyInstance().newSaveState(filename);
  }
  client.sendMessage(`Saved to \`${savedFileLocation}\``);
}
export = command;
