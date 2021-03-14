import dotenv from 'dotenv';
dotenv.config();
import fs from 'fs';
import cron from 'node-cron';
import {
  Prefix,
  DiscordToken,
  DiscordGuildId,
  DiscordChannelId,
  Romfile,
  CurrentGamemode,
  DemocracyTimeout,
  Scale,
  WebPort,
  SaveStateInterval,
} from './Config';
import { initDiscord, getDiscordInstance } from './DiscordClient';
import { getGameboyInstance } from './GameboyClient';
import { makeGif } from './Gifmaker';
import { Log } from './Log';
import { SocketServer } from './SocketServer';

Log.info('Starting Discord Plays Pokémon');

if (
  !Prefix ||
  !DiscordToken ||
  !DiscordGuildId ||
  !DiscordChannelId ||
  !Romfile ||
  !CurrentGamemode ||
  !DemocracyTimeout ||
  !Scale ||
  !WebPort ||
  !SaveStateInterval
) {
  Log.error(
    'Not all values are set in your .env file. See .env.example for all values'
  );
  process.exit(1);
}

let rom: Buffer;
try {
  rom = fs.readFileSync('./roms/' + Romfile);
} catch (error) {
  Log.error(
    `Rom file ${Romfile} could not be found in your './roms' directory`
  );
  process.exit(1);
}

const gameboyClient = getGameboyInstance();
gameboyClient.loadRom(rom);
gameboyClient.start();

initDiscord(DiscordToken);
const discordClient = getDiscordInstance();
if (!discordClient) {
  throw new Error('Discord did not initialize');
}
discordClient.start();

const socketServer = new SocketServer();

if (SaveStateInterval > 0) {
  setInterval(
    () => gameboyClient.newSaveState(),
    SaveStateInterval * 1000 * 60
  );
}

cron.schedule('0 */2 * * *', makeGif);

setInterval(() => {
  const imageString = getGameboyInstance().getFrame().toString('base64');
  socketServer.sendMessage(imageString);
}, 100); // send 10 frames each second

// TODO web view with discord reactions
// TODO fix race condition on rapid .frame call
// TODO map view command
// TODO faster text
// TODO show current XP of pokemon
// TODO show XP until next lvl
