import dotenv from 'dotenv';
dotenv.config();
import fs from 'fs';
import {
  CurrentGamemode,
  DemocracyTimeout,
  DiscordChannelId,
  DiscordGuildId,
  DiscordToken,
  Romfile,
} from './Config';
import { DiscordClient } from './DiscordClient';
import { GameboyClient } from './GameboyClient';
import { SocketServer } from './SocketServer';

console.log('Starting Discord Plays Pokémon');

if (
  !DiscordToken ||
  !DiscordGuildId ||
  !DiscordChannelId ||
  !Romfile ||
  !CurrentGamemode ||
  !DemocracyTimeout
) {
  console.error('Not all values are set in your .env file');
  process.exit(1);
}

let rom: Buffer;
try {
  rom = fs.readFileSync('./roms/' + Romfile);
} catch (error) {
  console.error(
    `Rom file ${Romfile} could not be found in your './roms' directory`
  );
  process.exit(1);
}

const gameboyClient = new GameboyClient();
gameboyClient.loadRom(rom);
gameboyClient.start();

const discordClient = new DiscordClient(DiscordToken, gameboyClient);
discordClient.start();

const socketServer = new SocketServer(gameboyClient);
socketServer.start();
