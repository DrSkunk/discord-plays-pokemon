import { Message } from 'discord.js';

export interface Command {
  names: string[];
  description: string;
  execute(message: Message, args?: string[]): void;
  adminOnly: boolean;
}
