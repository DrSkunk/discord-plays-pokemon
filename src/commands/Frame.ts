import Discord, {
  Message,
  AwaitReactionsOptions,
  User,
  MessageReaction,
} from 'discord.js';
import { CurrentGamemode, DemocracyTimeout, Prefix } from '../Config';
import { getDiscordInstance } from '../DiscordClient';
import { Gamemode } from '../enums/Gamemode';
import { Reaction } from '../enums/Reaction';
import { getGameboyInstance } from '../GameboyClient';
import { CollectedReactions } from '../types/CollectedReactions';
import { Command } from '../types/Command';
import { ReactionsCounter } from '../types/ReactionsCounter';

const command: Command = {
  name: 'frame',
  description: 'Frame!',
  execute,
};

async function execute(msg: Message, args: string[]) {
  const buffer = getGameboyInstance().getFrame();
  const attachment = new Discord.MessageAttachment(buffer, 'frame.png');
  const client = getDiscordInstance()!;

  const message = await client.sendMessage(
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
    const reactionName = Reaction[reaction.emoji.name as keyof typeof Reaction];
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
    if (topReactions.length === 0) {
      client.sendMessage(`No choice was made. type \`${Prefix}frame\``);
    } else {
      const action: Reaction = topReactions[
        Math.floor(Math.random() * topReactions.length)
      ] as Reaction;
      const actionMap = {
        [Reaction['➡️']]: 'RIGHT',
        [Reaction['⬅️']]: 'LEFT',
        [Reaction['⬆️']]: 'UP',
        [Reaction['⬇️']]: 'DOWN',
        [Reaction['🅰️']]: 'A',
        [Reaction['🅱']]: 'B',
        [Reaction['👆']]: 'SELECT',
        [Reaction['▶️']]: 'START',
      };
      const actionKey = actionMap[action];
      getGameboyInstance().pressKey(actionKey);
    }
    client.sendingMessage = false;
  });
  Object.values(Reaction).forEach(
    async (reaction) => await message.react(reaction)
  );
}

export = command;
