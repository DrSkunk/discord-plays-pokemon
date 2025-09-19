import Discord, {
  AttachmentBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  ComponentType,
  ButtonInteraction,
  SlashCommandBuilder,
  ChatInputCommandInteraction,
} from 'discord.js';
import fs from 'fs/promises';
import { CurrentGamemode } from '../Config';
import { getDiscordInstance } from '../DiscordClient';
import { Gamemode } from '../enums/Gamemode';
import { ButtonReaction } from '../enums/ButtonReaction';
import { getGameboyInstance } from '../GameboyClient';
import { Log } from '../Log';
import { Command } from '../types/Command';

const command: Command = {
  data: new SlashCommandBuilder()
    .setName('frame')
    .setDescription('Show the latest frame and listen for buttons to press'),
  execute,
};

async function execute(
  interaction: ChatInputCommandInteraction
): Promise<void> {
  const client = getDiscordInstance();
  if (client) {
    if (client.sendingMessage) {
      await interaction.reply({
        content: 'Please use the previous message.',
        ephemeral: true,
      });
    } else {
      await interaction.deferReply();
      await interaction.deleteReply(); // Delete the deferred reply since we'll create our own message
      await postFrame();
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

// Track the current collector to avoid creating multiple collectors
let currentCollector: Discord.InteractionCollector<ButtonInteraction> | null = null;

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
      setupButtonCollector(message);
    }
  } else {
    message = await client.sendMessageWithComponents(
      content,
      attachment,
      components
    );
    client.currentFrameMessage = message;
    setupButtonCollector(message);
  }

  client.sendingMessage = false;
}

function setupButtonCollector(message: Discord.Message) {
  // Clean up existing collector if any
  if (currentCollector) {
    currentCollector.stop();
  }

  // Set up interaction collector for instant responses
  currentCollector = message.createMessageComponentCollector({
    componentType: ComponentType.Button,
    // Remove time limit - keep collecting indefinitely
  });

  currentCollector.on('collect', async (interaction: ButtonInteraction) => {
    if (!interaction.customId.startsWith('pokemon_')) return;

    const buttonAction = interaction.customId.replace('pokemon_', '');
    Log.info(`Instant button press: ${buttonAction} from ${interaction.user.tag}`);

    // Acknowledge the interaction silently (no visible response)
    await interaction.deferUpdate();

    // Process the button press immediately
    await processButtonPress(buttonAction);
  });
}

async function processButtonPress(buttonAction: string) {
  // Map button actions to game inputs
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

  if (buttonAction === 'REFRESH') {
    // Just show new frame, don't press any game button
    Log.info('Refreshing frame');
  } else if (buttonAction.endsWith('x')) {
    // Handle repeat buttons (2x, 3x, etc.) - for democracy mode
    const repeatCount = parseInt(buttonAction.replace('x', ''));
    Log.info(`Repeat button pressed: ${repeatCount}x - but ignoring in instant mode`);
    // In instant mode, we ignore repeat buttons
    return;
  } else {
    // Press the game button
    const actionKey = ButtonReaction[buttonToEmoji[buttonAction] as keyof typeof ButtonReaction];
    if (actionKey) {
      getGameboyInstance().pressKey(actionKey, 1);
      Log.info(`Pressed game button: ${buttonAction}`);
    }
  }

  // Immediately update with new frame (this will update the existing message)
  await postFrame();
}

export = command;
