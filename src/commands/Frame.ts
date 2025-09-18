import Discord, {
  AwaitReactionsOptions,
  User,
  MessageReaction,
  AttachmentBuilder,
} from 'discord.js';
import fs from 'fs/promises';
import { CurrentGamemode, DemocracyTimeout, Prefix } from '../Config';
import { MAX_FAILED_ATTEMPTS } from '../Constants';
import { getDiscordInstance } from '../DiscordClient';
import { Gamemode } from '../enums/Gamemode';
import { ButtonReaction, ReverseButtonReaction } from '../enums/ButtonReaction';
import { getGameboyInstance } from '../GameboyClient';
import { Log } from '../Log';
import { CollectedReactions } from '../types/CollectedReactions';
import { Command } from '../types/Command';
import { ReactionsCounter } from '../types/ReactionsCounter';
import { RepeatReaction } from '../enums/RepeatReaction';

const command: Command = {
  names: ['frame', 'f'],
  description: 'Show the latest frame and listen for buttons to press.',
  execute,
  adminOnly: false,
};

function execute(): void {
  const client = getDiscordInstance();
  if (client) {
    if (client.sendingMessage) {
      client.sendMessage('Please use the previous message.');
    } else {
      postFrame();
    }
  }
}

async function postFrame() {
  let reactionsLoaded = false;
  const buffer = getGameboyInstance().getFrame();
  const attachment = new AttachmentBuilder(buffer, { name: 'frame.png' });
  const client = getDiscordInstance();
  if (!client) {
    throw new Error('Discord client not initialised');
  }

  const message = await client.sendMessage(
    'Which button do you want to press?\n🔄 gives a new frame',
    attachment
  );

  try {
    await fs.writeFile(
      `./frames/current/${new Date().toISOString()}.png`,
      buffer
    );
  } catch (error) {
    Log.error('Failed to write frame to disk');
  }

  const awaitReactionOptions: AwaitReactionsOptions = {
    time:
      DemocracyTimeout +
      (Object.values(ButtonReaction).length +
        Object.values(RepeatReaction).length) *
        1000,
    dispose: true,
  };
  if (CurrentGamemode === Gamemode.Anarchy) {
    awaitReactionOptions.max = 1;
  }
  const filter = (reaction: MessageReaction, user: User) => {
    const buttonReaction =
      ButtonReaction[reaction.emoji.name as keyof typeof ButtonReaction];
    const repeatReaction =
      RepeatReaction[reaction.emoji.name as keyof typeof RepeatReaction];
    return (
      (Object.values(ButtonReaction).includes(buttonReaction) ||
        Object.values(RepeatReaction).includes(repeatReaction)) &&
      !user.bot
    );
  };
  const collector = message.createReactionCollector({
    filter,
    ...awaitReactionOptions,
  });
  const collectedReactions: CollectedReactions = {};

  collector.on('collect', (reaction, user) => {
    Log.info(`Collected ${reaction.emoji.name} from ${user.tag}`);
    if (!collectedReactions.hasOwnProperty(reaction.emoji.name!)) {
      collectedReactions[reaction.emoji.name!] = new Set();
    }
    collectedReactions[reaction.emoji.name!].add(user.tag);
  });

  collector.on('remove', (reaction, user) => {
    Log.info(`Removed ${reaction.emoji.name} from ${user.tag}`);
    collectedReactions[reaction.emoji.name!].delete(user.tag);
  });

  collector.on('end', () => {
    const actionReactionsCounter: ReactionsCounter = {};
    let maxActionValue = 0;
    // Get top action
    Object.keys(collectedReactions)
      .filter((reaction) => Object.keys(ButtonReaction).includes(reaction))
      .forEach((reaction) => {
        const { size } = collectedReactions[reaction];
        actionReactionsCounter[reaction] = size;
        if (size > maxActionValue) {
          maxActionValue = size;
        }
      });
    const topReactions = Object.keys(actionReactionsCounter).filter(
      (reaction) => actionReactionsCounter[reaction] === maxActionValue
    );

    // See if it's a repeated action, if so how much
    const repeatReactionsCounter: ReactionsCounter = {};
    let maxRepeatValue = 0;
    Object.keys(collectedReactions)
      .filter((reaction) => Object.keys(RepeatReaction).includes(reaction))
      .forEach((reaction) => {
        const { size } = collectedReactions[reaction];
        repeatReactionsCounter[reaction] = size;
        if (size > maxRepeatValue) {
          maxRepeatValue = size;
        }
      });
    const topRepeat = Object.keys(repeatReactionsCounter).filter(
      (reaction) => repeatReactionsCounter[reaction] === maxRepeatValue
    );

    if (topReactions.length === 0 || maxActionValue === 0) {
      client.sendMessage(`No choice was made.`);
      client.failedAttempts++;
    } else {
      client.failedAttempts = 0;
      const action: ReverseButtonReaction = topReactions[
        Math.floor(Math.random() * topReactions.length)
      ] as ReverseButtonReaction;
      if (action === ReverseButtonReaction['🔄']) {
        client.sendMessage('Giving new frame');
      } else {
        let repeat = 1;
        if (topRepeat.length !== 0) {
          client.failedAttempts = 0;
          const repeatString =
            topRepeat[Math.floor(Math.random() * topRepeat.length)];
          repeat = RepeatReaction[repeatString];
        }
        const actionKey = ButtonReaction[action];

        getGameboyInstance().pressKey(actionKey, repeat);
        client.sendMessage(`Pressed ${action} ${repeat} time(s)`);
      }
    }
    client.sendingMessage = false;
    // Wait a bit so the keys are registered
    if (reactionsLoaded) {
      setTimeout(postNewFrame, 5000);
    }
  });

  const emojis = Object.keys(ButtonReaction);
  if (CurrentGamemode === Gamemode.Democracy) {
    emojis.push(...Object.keys(RepeatReaction));
  }

  client.sendingMessage = true;
  const reactionsPromise = emojis.map((reaction) => message.react(reaction));

  Promise.all(reactionsPromise).then(() => {
    reactionsLoaded = true;
    if (!client.sendingMessage) {
      postNewFrame();
    }
  });
}

function postNewFrame() {
  const client = getDiscordInstance();
  if (!client) {
    throw new Error('Discord client not initialised');
  }
  if (client.failedAttempts >= MAX_FAILED_ATTEMPTS) {
    client.failedAttempts = 0;
    client.sendMessage(`No choice was made after ${MAX_FAILED_ATTEMPTS} attempts, stopping automatic frame posting.
Use command \`${Prefix}frame\` to start again.`);
  } else {
    postFrame();
  }
}

export = command;
