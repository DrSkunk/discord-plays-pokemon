import dotenv, { config } from 'dotenv';
dotenv.config();
import fs from 'fs';
import {
  CurrentGamemode,
  DemocracyTimeout,
  DiscordChannelId,
  DiscordGuildId,
  DiscordToken,
  Romfile,
  SaveStateInterval,
} from './Config';
import { DiscordClient } from './DiscordClient';
import { GameboyClient } from './GameboyClient';
import { Log } from './Log';
import { SocketServer } from './SocketServer';

Log.info('Starting Discord Plays Pokémon');

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

if (SaveStateInterval > 0) {
  setInterval(
    () => gameboyClient.newSaveState(),
    SaveStateInterval * 1000 * 60
  );
}
