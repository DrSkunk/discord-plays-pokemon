import Discord, {
  MessageAttachment,
  TextChannel,
  AwaitReactionsOptions,
  User,
  MessageReaction,
} from 'discord.js';
import { CurrentGamemode, DemocracyTimeout, DiscordChannelId } from './Config';
import { GameboyClient } from './GameboyClient';
import { Gamemode } from './Gamemode';

export class DiscordClient {
  private token: string;
  client: Discord.Client;
  gameboyClient: GameboyClient;
  channel: Discord.TextChannel;
  sendingMessage: boolean;

  constructor(token: string, gameboyClient: GameboyClient) {
    this.token = token;
    this.client = new Discord.Client();
    this.gameboyClient = gameboyClient;
    this.sendingMessage = false;
    this.channel = this.client.channels.cache.get(
      DiscordChannelId
    ) as TextChannel;
  }

  start() {
    this.client.on('ready', () => {
      console.log(`Logged in!`);
      this.channel = this.client.channels.cache.get(
        DiscordChannelId
      ) as TextChannel;
    });

    this.client.on('message', async (msg) => {
      if (msg.author.bot || msg.channel.id !== DiscordChannelId) {
        return;
      }
      if (!this.sendingMessage) {
        this.sendingMessage = true;
        await this.postFrameAndReact();
      }
    });
    this.client.login(this.token);
  }

  async postFrameAndReact() {
    const buffer = this.gameboyClient.getFrame();
    const attachment = new Discord.MessageAttachment(buffer, 'frame.png');

    if (this.channel) {
      const message = await this.sendMessage('frame', attachment);

      let awaitReactionOptions: AwaitReactionsOptions = {};
      if (CurrentGamemode === Gamemode.Anarchy) {
        awaitReactionOptions.max = 1;
      } else {
        awaitReactionOptions.time = DemocracyTimeout;
        awaitReactionOptions.errors = ['time'];
      }
      const filter = (reaction: MessageReaction, user: User) => !user.bot;
      const collector = message.createReactionCollector(filter, {
        time: 15000,
      });

      collector.on('collect', (reaction, user) => {
        console.log(`Collected ${reaction.emoji.name} from ${user.tag}`);
      });

      collector.on('end', (collected) => {
        console.log(`Collected ${collected.size} items`);
      });

      message
        .awaitReactions(filter, awaitReactionOptions)
        .then((collected) =>
          this.sendMessage('```json\n' + JSON.stringify(collected) + '```')
        )
        .catch((collected) => {
          this.sendMessage(
            '```json\n//error\n' + JSON.stringify(collected) + '```'
          );
        });

      await message.react('⬆️');
      await message.react('⬇️');
      await message.react('⬅️');
      await message.react('➡️');
      await message.react('🅰️');
      await message.react('🅱');
      await message.react('🏁');
      await message.react('🔘');
    }
    this.sendingMessage = false;
  }

  async sendMessage(text: string, attachment?: MessageAttachment) {
    if (attachment) {
      return this.channel.send(text, attachment);
    } else {
      return this.channel.send(text);
    }
  }
}
