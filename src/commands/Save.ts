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

function execute(_msg: Message, args: string[]): void {
  const client = getDiscordInstance();
  if (!client) {
    throw new Error('Discord did not initialize');
  }
  let savedFileLocation: string;
  if (args.length === 0) {
    savedFileLocation = getGameboyInstance().newSaveState();
  } else {
    const filename = args.join('_');
    savedFileLocation = getGameboyInstance().newSaveState(filename);
  }
  client.sendMessage(`Saved to \`${savedFileLocation}\``);
}
export = command;
