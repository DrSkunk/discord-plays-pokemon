import Discord, {
  AttachmentBuilder,
  EmbedBuilder,
  TextChannel,
  GatewayIntentBits,
  ActivityType,
  Interaction,
  REST,
  Routes,
} from 'discord.js';
import glob from 'glob';
import { promisify } from 'util';
import { DiscordChannelId, DiscordToken, DiscordGuildId } from './Config';
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
      intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
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
        this._client.user.setActivity('Discord Plays Pokemon', {
          type: ActivityType.Playing,
        });
        Log.info('Activity set to Discord Plays Pokemon');
      }

      // Load commands
      const commandFiles = await globPromise(`${__dirname}/commands/*.{js,ts}`);
      const commands = [];

      for (const file of commandFiles) {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const command = require(file) as Command;
        Log.info('Added command', command.data.name);
        this._commands.push(command);
        commands.push(command.data.toJSON());
      }

      // Register slash commands
      const rest = new REST({ version: '10' }).setToken(DiscordToken);
      try {
        Log.info('Started refreshing application (/) commands.');
        if (this._client.user) {
          await rest.put(
            Routes.applicationGuildCommands(
              this._client.user.id,
              DiscordGuildId
            ),
            { body: commands }
          );
        }
        Log.info('Successfully reloaded application (/) commands.');
      } catch (error) {
        Log.error('Error registering slash commands:', error);
      }
    });

    this._client.on('interactionCreate', async (interaction: Interaction) => {
      // Handle button interactions from the frame command
      if (
        interaction.isButton() &&
        interaction.customId.startsWith('pokemon_')
      ) {
        // This will be handled by the Frame command's interaction handler
        return;
      }

      // Handle slash commands
      if (!interaction.isChatInputCommand()) return;

      const command = this._commands.find(
        (c) => c.data.name === interaction.commandName
      );
      if (!command) {
        Log.error(`No command matching ${interaction.commandName} was found.`);
        return;
      }

      try {
        await command.execute(interaction);
      } catch (error) {
        Log.error('Error executing command:', error);
        const errorMessage = {
          content: 'There was an error while executing this command!',
          ephemeral: true,
        };

        if (interaction.replied || interaction.deferred) {
          await interaction.followUp(errorMessage);
        } else {
          await interaction.reply(errorMessage);
        }
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
