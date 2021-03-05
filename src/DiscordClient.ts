import Discord, {
  MessageAttachment,
  TextChannel,
  AwaitReactionsOptions,
  User,
  MessageReaction,
} from 'discord.js';
import {
  CurrentGamemode,
  DemocracyTimeout,
  DiscordChannelId,
  Prefix,
} from './Config';
import { GameboyClient } from './GameboyClient';
import { Gamemode } from './Gamemode';
import { Reaction } from './Reaction';

interface CollectedReactions {
  [key: string]: Set<string>;
}

interface ReactionsCounter {
  [key: string]: number;
}

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
      // if (!this.sendingMessage) {
      //   this.sendingMessage = true;
      await this.postFrameAndReact();
      // }
    });
    this.client.login(this.token);
  }

  async postFrameAndReact() {
    const buffer = this.gameboyClient.getFrame();
    const attachment = new Discord.MessageAttachment(buffer, 'frame.png');

    if (!this.channel) {
      this.sendingMessage = false;
      return;
    }
    const message = await this.sendMessage(
      'Which button do you want to press?',
      attachment
    );

    let awaitReactionOptions: AwaitReactionsOptions = {};
    if (CurrentGamemode === Gamemode.Anarchy) {
      awaitReactionOptions.max = 1;
    } else {
      awaitReactionOptions.time = DemocracyTimeout;
      // awaitReactionOptions.errors = ['time'];
    }
    const filter = (reaction: MessageReaction, user: User) => {
      const reactionName =
        Reaction[reaction.emoji.name as keyof typeof Reaction];
      return Object.values(Reaction).includes(reactionName) && !user.bot;
    };

    const collector = message.createReactionCollector(
      filter,
      awaitReactionOptions
    );

    const collectedReactions: CollectedReactions = {};

    collector.on('collect', (reaction, user) => {
      console.info(`Collected ${reaction.emoji.name} from ${user.tag}`);
      if (!collectedReactions.hasOwnProperty(reaction.emoji.name)) {
        collectedReactions[reaction.emoji.name] = new Set();
      }
      collectedReactions[reaction.emoji.name].add(user.tag);
    });

    collector.on('end', (collected) => {
      const reactionsCounter: ReactionsCounter = {};
      let maxValue = 0;
      Object.keys(collectedReactions).forEach((reaction) => {
        const { size } = collectedReactions[reaction];
        reactionsCounter[reaction] = size;
        if (size > maxValue) {
          maxValue = size;
        }
      });

      const topReactions = Object.keys(reactionsCounter).filter(
        (reaction) => reactionsCounter[reaction] === maxValue
      );
      console.log('reactionsCounter', reactionsCounter, maxValue, topReactions);

      if (topReactions.length === 0) {
        this.sendMessage(`No choice was made. type \`${Prefix}frame\``);
      } else {
        const action: Reaction = topReactions[
          Math.floor(Math.random() * topReactions.length)
        ] as Reaction;

        this.gameboyClient.pressKey(action);
      }
      this.sendingMessage = false;
    });

    Object.values(Reaction).forEach(
      async (reaction) => await message.react(reaction)
    );
  }

  async sendMessage(text: string, attachment?: MessageAttachment) {
    if (attachment) {
      return this.channel.send(text, attachment);
    } else {
      return this.channel.send(text);
    }
  }
}
