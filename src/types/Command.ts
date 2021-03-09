import { Message } from 'discord.js';

export interface Command {
  name: string;
  description: string;
  execute(message: Message, args?: string[]): any;
}
