import Discord, { MessageAttachment, TextChannel } from 'discord.js';
import glob from 'glob'; // included by discord.js
import { promisify } from 'util';
import { DiscordChannelId, Prefix } from './Config';
import { Log } from './Log';
import { Command } from './types/Command';

const globPromise = promisify(glob);

class DiscordClient {
  getChannel() {
    throw new Error('Method not implemented.');
  }
  private _token: string;
  private _client: Discord.Client;
  private _channel: Discord.TextChannel;
  private commands: Command[];
  public sendingMessage: boolean;

  constructor(token: string) {
    this._token = token;
    this._client = new Discord.Client();
    this._channel = this._client.channels.cache.get(
      DiscordChannelId
    ) as TextChannel;
    this.commands = [];
    this.sendingMessage = false;
  }

  start() {
    this._client.on('ready', async () => {
      Log.info(`Logged in!`);
      this._channel = this._client.channels.cache.get(
        DiscordChannelId
      ) as TextChannel;
      if (this._client.user) {
        this._client.user
          .setActivity(`${Prefix}help`, { type: 'LISTENING' })
          .then((presence) =>
            Log.info(`Activity set to ${presence.activities[0].name}`)
          )
          .catch(console.error);
      }
      const commandFiles = await globPromise(`${__dirname}/commands/*.{js,ts}`);

      for (const file of commandFiles) {
        const command = require(file) as Command;
        Log.info('Added command', command.name);
        this.commands.push(command);
      }
    });

    this._client.on('message', async (message) => {
      if (
        message.author.bot ||
        message.channel.id !== DiscordChannelId ||
        !message.content.startsWith(Prefix)
      ) {
        return;
      }

      const [commandName, ...args] = message.content
        .slice(Prefix.length)
        .split(/ +/);

      const command = this.commands.find((c) => c.name === commandName);

      if (command) {
        command.execute(message, args);
      }
      // const args = msg.content.slice(Prefix.length).trim().split(/ +/);
      // if (args === undefined || args.length == 0) {
      //   return;
      // }
      // const command = args[0].toLowerCase();
      // switch (command) {
      //   case 'frame':
      //     await this.postFrameAndReact();
      //     break;
      //   case 'save':
      //     if (args.length > 1) {
      //       this.gameboyClient.newSaveState(args[1]);
      //     } else {
      //       this.gameboyClient.newSaveState();
      //     }
      //     break;
      //   default:
      //     this.sendMessage(
      //       `Unrecognized command. Type \`${Prefix}help\` for the list of commands.`
      //     );
      //     break;
      // }

      // if (!this.sendingMessage) {
      //   this.sendingMessage = true;
      // }
    });
    this._client.login(this._token);
  }

  async sendMessage(text: string, attachment?: MessageAttachment) {
    if (attachment) {
      return this._channel.send(text, attachment);
    } else {
      return this._channel.send(text);
    }
  }
}

let instance: DiscordClient | null = null;

export function initDiscord(token: string) {
  instance = new DiscordClient(token);
}

export function getDiscordInstance(): DiscordClient | null {
  return instance;
}
