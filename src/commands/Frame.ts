import Discord, {
  AttachmentBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  ComponentType,
  ButtonInteraction,
} from 'discord.js';
import fs from 'fs/promises';
import { CurrentGamemode, DemocracyTimeout, Prefix } from '../Config';
import { MAX_FAILED_ATTEMPTS } from '../Constants';
import { getDiscordInstance } from '../DiscordClient';
import { Gamemode } from '../enums/Gamemode';
import { ButtonReaction } from '../enums/ButtonReaction';
import { getGameboyInstance } from '../GameboyClient';
import { Log } from '../Log';
import { CollectedInteractions } from '../types/CollectedInteractions';
import { Command } from '../types/Command';
import { ReactionsCounter } from '../types/ReactionsCounter';

const command: Command = {
  names: ['frame', 'f'],
  description: 'Show the latest frame and listen for buttons to press.',
  execute,
  adminOnly: false,
};

// Track collected button interactions
const collectedInteractions: CollectedInteractions = {};
const interactionTimeout: NodeJS.Timeout | null = null;

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

function createGameButtons(): ActionRowBuilder<ButtonBuilder>[] {
  // First row: D-pad
  const dpadRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId('pokemon_UP')
      .setLabel('↑')
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId('pokemon_DOWN')
      .setLabel('↓')
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId('pokemon_LEFT')
      .setLabel('←')
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId('pokemon_RIGHT')
      .setLabel('→')
      .setStyle(ButtonStyle.Primary)
  );

  // Second row: Action buttons
  const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId('pokemon_A')
      .setLabel('A')
      .setStyle(ButtonStyle.Success),
    new ButtonBuilder()
      .setCustomId('pokemon_B')
      .setLabel('B')
      .setStyle(ButtonStyle.Danger),
    new ButtonBuilder()
      .setCustomId('pokemon_START')
      .setLabel('Start')
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId('pokemon_SELECT')
      .setLabel('Select')
      .setStyle(ButtonStyle.Secondary)
  );

  // Third row: Special buttons
  const specialRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId('pokemon_REFRESH')
      .setLabel('🔄 New Frame')
      .setStyle(ButtonStyle.Secondary)
  );

  const rows = [dpadRow, actionRow, specialRow];

  // Add repeat buttons for democracy mode
  if (CurrentGamemode === Gamemode.Democracy) {
    const repeatRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId('pokemon_2x')
        .setLabel('2x')
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId('pokemon_3x')
        .setLabel('3x')
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId('pokemon_4x')
        .setLabel('4x')
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId('pokemon_5x')
        .setLabel('5x')
        .setStyle(ButtonStyle.Secondary)
    );
    rows.push(repeatRow);
  }

  return rows;
}

async function postFrame() {
  const buffer = getGameboyInstance().getFrame();
  const attachment = new AttachmentBuilder(buffer, { name: 'frame.png' });
  const client = getDiscordInstance();
  if (!client) {
    throw new Error('Discord client not initialised');
  }

  try {
    await fs.writeFile(
      `./frames/current/${new Date().toISOString()}.png`,
      buffer
    );
  } catch (error) {
    Log.error('Failed to write frame to disk');
  }

  const components = createGameButtons();
  const content = 'Which button do you want to press?';

  let message: Discord.Message;

  // Update existing message or create new one
  if (client.currentFrameMessage) {
    try {
      message = await client.updateMessage(
        client.currentFrameMessage,
        content,
        attachment,
        components
      );
    } catch (error) {
      Log.error('Failed to update existing message, creating new one');
      message = await client.sendMessageWithComponents(
        content,
        attachment,
        components
      );
      client.currentFrameMessage = message;
    }
  } else {
    message = await client.sendMessageWithComponents(
      content,
      attachment,
      components
    );
    client.currentFrameMessage = message;
  }

  // Clear previous collected interactions
  Object.keys(collectedInteractions).forEach((key) => {
    delete collectedInteractions[key];
  });

  client.sendingMessage = true;

  // Clear any existing timeout
  if (interactionTimeout) {
    clearTimeout(interactionTimeout);
  }

  // Set up interaction collector
  const collector = message.createMessageComponentCollector({
    componentType: ComponentType.Button,
    time: DemocracyTimeout + Object.keys(ButtonReaction).length * 1000,
  });

  if (CurrentGamemode === Gamemode.Anarchy) {
    collector.options.max = 1;
  }

  collector.on('collect', async (interaction: ButtonInteraction) => {
    if (!interaction.customId.startsWith('pokemon_')) return;

    const buttonAction = interaction.customId.replace('pokemon_', '');
    Log.info(`Collected ${buttonAction} from ${interaction.user.tag}`);

    // Acknowledge the interaction
    await interaction.deferReply({ ephemeral: true });
    await interaction.editReply({ content: `You pressed ${buttonAction}!` });

    if (!collectedInteractions[buttonAction]) {
      collectedInteractions[buttonAction] = new Set();
    }
    collectedInteractions[buttonAction].add(interaction.user.tag);
  });

  collector.on('end', () => {
    processInteractions();
  });
}

function processInteractions() {
  const client = getDiscordInstance();
  if (!client) {
    throw new Error('Discord client not initialised');
  }

  const actionInteractionsCounter: ReactionsCounter = {};
  let maxActionValue = 0;

  // Get top action (map button names to emoji equivalents)
  const buttonToEmoji: { [key: string]: string } = {
    UP: '⬆️',
    DOWN: '⬇️',
    LEFT: '⬅️',
    RIGHT: '➡️',
    A: '🅰️',
    B: '🅱',
    START: '▶️',
    SELECT: '👆',
    REFRESH: '🔄',
  };

  Object.keys(collectedInteractions)
    .filter((interaction) => Object.keys(buttonToEmoji).includes(interaction))
    .forEach((interaction) => {
      const { size } = collectedInteractions[interaction];
      actionInteractionsCounter[interaction] = size;
      if (size > maxActionValue) {
        maxActionValue = size;
      }
    });

  const topActions = Object.keys(actionInteractionsCounter).filter(
    (interaction) => actionInteractionsCounter[interaction] === maxActionValue
  );

  // See if it's a repeated action
  const repeatInteractionsCounter: ReactionsCounter = {};
  let maxRepeatValue = 0;
  const repeatMap: { [key: string]: number } = {
    '2x': 2,
    '3x': 3,
    '4x': 4,
    '5x': 5,
  };

  Object.keys(collectedInteractions)
    .filter((interaction) => Object.keys(repeatMap).includes(interaction))
    .forEach((interaction) => {
      const { size } = collectedInteractions[interaction];
      repeatInteractionsCounter[interaction] = size;
      if (size > maxRepeatValue) {
        maxRepeatValue = size;
      }
    });

  const topRepeats = Object.keys(repeatInteractionsCounter).filter(
    (interaction) => repeatInteractionsCounter[interaction] === maxRepeatValue
  );

  if (topActions.length === 0 || maxActionValue === 0) {
    client.sendMessage(`No choice was made.`);
    client.failedAttempts++;
  } else {
    client.failedAttempts = 0;
    const action = topActions[Math.floor(Math.random() * topActions.length)];

    if (action === 'REFRESH') {
      client.sendMessage('Giving new frame');
    } else {
      let repeat = 1;
      if (topRepeats.length !== 0) {
        const repeatAction =
          topRepeats[Math.floor(Math.random() * topRepeats.length)];
        repeat = repeatMap[repeatAction];
      }

      // Map button action to ButtonReaction enum value
      const actionKey =
        ButtonReaction[buttonToEmoji[action] as keyof typeof ButtonReaction];

      getGameboyInstance().pressKey(actionKey, repeat);
      client.sendMessage(`Pressed ${action} ${repeat} time(s)`);
    }
  }

  client.sendingMessage = false;
  // Wait a bit so the keys are registered
  setTimeout(postNewFrame, 5000);
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
