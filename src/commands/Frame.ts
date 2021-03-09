import Discord, {
  Message,
  AwaitReactionsOptions,
  User,
  MessageReaction,
} from 'discord.js';
import { CurrentGamemode, DemocracyTimeout, Prefix } from '../Config';
import { MAX_FAILED_ATTEMPTS } from '../Constants';
import { getDiscordInstance } from '../DiscordClient';
import { Gamemode } from '../enums/Gamemode';
import { Reaction } from '../enums/Reaction';
import { getGameboyInstance } from '../GameboyClient';
import { Log } from '../Log';
import { CollectedReactions } from '../types/CollectedReactions';
import { Command } from '../types/Command';
import { ReactionsCounter } from '../types/ReactionsCounter';

const command: Command = {
  name: 'frame',
  description: 'Show the latest frame and listen for buttons to press.',
  execute,
};

function execute(msg: Message, args: string[]) {
  const client = getDiscordInstance()!;
  if (client.sendingMessage) {
    client.sendMessage('Please use the previous message.');
  } else {
    postFrame();
  }
}

async function postFrame() {
  let reactionsLoaded = false;
  const buffer = getGameboyInstance().getFrame();
  const attachment = new Discord.MessageAttachment(buffer, 'frame.png');
  const client = getDiscordInstance()!;

  const message = await client.sendMessage(
    '.\nWhich button do you want to press?',
    attachment
  );
  let awaitReactionOptions: AwaitReactionsOptions = {
    time: DemocracyTimeout + Object.values(Reaction).length * 1000,
  };
  if (CurrentGamemode === Gamemode.Anarchy) {
    awaitReactionOptions.max = 1;
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
    Log.info(`Collected ${reaction.emoji.name} from ${user.tag}`);
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
      // TODO when X times no choice has been made, don't automatically post a new message
      client.sendMessage(`No choice was made.`);
      client.failedAttempts++;
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
      client.sendMessage('Pressed ' + action);
    }
    client.sendingMessage = false;
    // Wait a bit so the keys are registered
    if (reactionsLoaded) {
      setTimeout(postNewFrame, 500);
    }
  });

  client.sendingMessage = true;
  const reactionsPromise = Object.values(Reaction).map((reaction) =>
    message.react(reaction)
  );
  Promise.all(reactionsPromise).then(() => {
    reactionsLoaded = true;
    if (!client.sendingMessage) {
      postNewFrame();
    }
  });
}

function postNewFrame() {
  const client = getDiscordInstance()!;
  if (client.failedAttempts >= MAX_FAILED_ATTEMPTS) {
    client.failedAttempts = 0;
    client.sendMessage(`No choice was made after ${MAX_FAILED_ATTEMPTS} attempts, stopping automatic frame posting.
Use command \`${Prefix}frame\` to start again.`);
  } else {
    postFrame();
  }
}

export = command;
