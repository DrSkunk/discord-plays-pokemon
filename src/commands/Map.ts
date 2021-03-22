import Canvas from 'canvas';
import { MessageAttachment } from 'discord.js';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../Constants';
import { getDiscordInstance } from '../DiscordClient';
import { getGameboyInstance } from '../GameboyClient';
import { Command } from '../types/Command';

const command: Command = {
  names: ['map', 'm'],
  description: 'Show the current position on the map of Kanto',
  execute,
  adminOnly: false,
};

async function execute(): Promise<void> {
  const client = getDiscordInstance();
  if (!client) {
    throw new Error('Discord did not initialize');
  }
  const { location } = getGameboyInstance().getStats();
  console.log('location', location);

  const canvas = Canvas.createCanvas(SCREEN_WIDTH, SCREEN_HEIGHT);
  const ctx = canvas.getContext('2d');
  const background = await Canvas.loadImage('./src/imgs/map_bg.png');
  const ash = await Canvas.loadImage('./src/imgs/ash.png');

  ctx.drawImage(background, 0, 0);
  ctx.drawImage(ash, location.location.x, location.location.y);
  ctx.font = '8px sans-serif';
  ctx.fillStyle = '#000000';
  ctx.fillText(location.location.name, 9, 8);
  const attachment = new MessageAttachment(canvas.toBuffer(), 'map.png');
  client.sendMessage(`Current location: **${location.name}**`, attachment);
}
export = command;
