import Discord, {
  AttachmentBuilder,
  EmbedBuilder,
  TextChannel,
  GatewayIntentBits,
  ActivityType,
  Interaction,
} from 'discord.js';
import glob from 'glob';
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
  private _commands: Command[];
  public sendingMessage: boolean;
  public failedAttempts: number;
  public currentFrameMessage: Discord.Message | null;

  get commands() {
    return this._commands;
  }

  constructor(token: string) {
    this._token = token;
    this._client = new Discord.Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
      ],
    });
    this._channel = this._client.channels.cache.get(
      DiscordChannelId
    ) as TextChannel;
    this._commands = [];
    this.sendingMessage = false;
    this.failedAttempts = 0;
    this.currentFrameMessage = null;
  }

  start() {
    this._client.on('ready', async () => {
      Log.info(`Logged in!`);
      this._channel = this._client.channels.cache.get(
        DiscordChannelId
      ) as TextChannel;
      if (this._client.user) {
        this._client.user.setActivity(`${Prefix}help`, {
          type: ActivityType.Listening,
        });
        Log.info(`Activity set to ${Prefix}help`);
      }
      const commandFiles = await globPromise(`${__dirname}/commands/*.{js,ts}`);

      for (const file of commandFiles) {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const command = require(file) as Command;
        Log.info('Added command', command.names[0]);
        this._commands.push(command);
      }
    });

    this._client.on('interactionCreate', async (interaction: Interaction) => {
      if (!interaction.isButton()) return;

      // Handle button interactions from the frame command
      if (interaction.customId.startsWith('pokemon_')) {
        // This will be handled by the Frame command's interaction handler
        return;
      }
    });

    this._client.on('message', async (message) => {
      if (
        !message.guild ||
        message.author.bot ||
        message.channel.id !== DiscordChannelId ||
        !message.content.startsWith(Prefix)
      ) {
        return;
      }

      const [commandName, ...args] = message.content
        .slice(Prefix.length)
        .split(/ +/);

      const command = this._commands.find((c) => c.names.includes(commandName));

      if (command) {
        const isAdmin = message.member?.hasPermission('ADMINISTRATOR');
        if (command.adminOnly && !isAdmin) {
          this.sendMessage('This command is for admins only');
        } else {
          command.execute(message, args);
        }
      } else {
        this.sendMessage(
          `Unrecognized command. Type \`${Prefix}help\` for the list of commands.`
        );
      }
    });
    this._client.login(this._token);
  }

  async sendMessage(
    text: string | EmbedBuilder,
    attachment?: AttachmentBuilder
  ) {
    if (!this._channel) {
      throw new Error(
        'Could not send message, text channel was not initialised yet.'
      );
    }
    if (attachment) {
      return this._channel.send({
        content: typeof text === 'string' ? text : undefined,
        embeds: typeof text === 'string' ? undefined : [text],
        files: [attachment],
      });
    } else {
      return this._channel.send({
        content: typeof text === 'string' ? text : undefined,
        embeds: typeof text === 'string' ? undefined : [text],
      });
    }
  }

  async updateMessage(
    message: Discord.Message,
    text: string | EmbedBuilder,
    attachment?: AttachmentBuilder,
    components?: Discord.ActionRowBuilder<Discord.ButtonBuilder>[]
  ) {
    if (attachment) {
      return message.edit({
        content: typeof text === 'string' ? text : undefined,
        embeds: typeof text === 'string' ? undefined : [text],
        files: [attachment],
        components: components || [],
      });
    } else {
      return message.edit({
        content: typeof text === 'string' ? text : undefined,
        embeds: typeof text === 'string' ? undefined : [text],
        components: components || [],
      });
    }
  }

  async sendMessageWithComponents(
    text: string | EmbedBuilder,
    attachment?: AttachmentBuilder,
    components?: Discord.ActionRowBuilder<Discord.ButtonBuilder>[]
  ) {
    if (!this._channel) {
      throw new Error(
        'Could not send message, text channel was not initialised yet.'
      );
    }

    if (attachment) {
      return this._channel.send({
        content: typeof text === 'string' ? text : undefined,
        embeds: typeof text === 'string' ? undefined : [text],
        files: [attachment],
        components: components || [],
      });
    } else {
      return this._channel.send({
        content: typeof text === 'string' ? text : undefined,
        embeds: typeof text === 'string' ? undefined : [text],
        components: components || [],
      });
    }
  }
}

let instance: DiscordClient | null = null;

export function initDiscord(token: string): void {
  instance = new DiscordClient(token);
}

export function getDiscordInstance(): DiscordClient | null {
  return instance;
}
