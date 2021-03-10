import { Message } from 'discord.js';
import { Prefix, setGameMode } from '../Config';
import { getDiscordInstance } from '../DiscordClient';
import { Gamemode } from '../enums/Gamemode';
import { Command } from '../types/Command';

const command: Command = {
  names: ['mode', 'm'],
  description:
    'Change the mode to **Anarchy** or **Democracy** mode. with _Anarchy mode_ the first action is executed, with _Democracy mode_ the action with the most votes is executed',
  execute,
  adminOnly: true,
};

function execute(_msg: Message, args: string[]): void {
  const client = getDiscordInstance();
  if (!client) {
    throw new Error('Discord did not initialize');
  }
  const newMode = args[0]?.toUpperCase();
  if (args.length === 0) {
    client.sendMessage('No mode given');
  } else if (newMode !== Gamemode.Anarchy && newMode !== Gamemode.Democracy) {
    client.sendMessage(
      `Supply either _Anarchy_ or _Democracy_ as parameter, case insensitive.
E.g.: \`${Prefix}mode democracy\``
    );
  } else {
    setGameMode(newMode);
    client.sendMessage('Mode set to `' + newMode + '`');
  }
}
export = command;
