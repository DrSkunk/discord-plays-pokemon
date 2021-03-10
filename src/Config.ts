import { Gamemode } from './enums/Gamemode';

const Prefix = process.env.PREFIX as string;
const DiscordToken = process.env.DISCORD_TOKEN as string;
const DiscordGuildId = process.env.DISCORD_GUILD_ID as string;
const DiscordChannelId = process.env.DISCORD_CHANNEL_ID as string;
const Romfile = process.env.ROMFILE as string;
const loadedGamemode = process.env.MODE as string;
const DemocracyTimeoutString = process.env.DEMOCRACY_MODE_TIMEOUT as string;
const ScaleString = process.env.SCALE as string;
const WebPortString = process.env.WEB_PORT as string;
const SaveStateIntervalString = process.env.SAVESTATE_INTERVAL as string;

if (
  loadedGamemode !== Gamemode.Anarchy &&
  loadedGamemode !== Gamemode.Democracy
) {
  throw new Error('Invalid gamemode loaded');
}
let DemocracyTimeout: number;
try {
  DemocracyTimeout = Number.parseInt(DemocracyTimeoutString);
} catch (error) {
  throw new Error('The democracy timeout is not a number');
}

let CurrentGamemode: Gamemode = loadedGamemode;

let Scale: number;
try {
  Scale = Number.parseInt(ScaleString);
} catch (error) {
  throw new Error('The scale is not an integer');
}
if (Scale < 1 || Scale > 6) {
  throw new Error('The scale must be between 1 and 6 inclusive');
}

let WebPort: number;
try {
  WebPort = Number.parseInt(WebPortString);
} catch (error) {
  throw new Error('The webport is not an integer');
}

let SaveStateInterval: number;
try {
  SaveStateInterval = Number.parseInt(SaveStateIntervalString);
} catch (error) {
  throw new Error('The savestate interval is not an integer');
}

function setGameMode(gamemode: Gamemode): void {
  CurrentGamemode = gamemode;
}

export {
  Prefix,
  DiscordToken,
  DiscordGuildId,
  DiscordChannelId,
  Romfile,
  CurrentGamemode,
  setGameMode,
  DemocracyTimeout,
  Scale,
  WebPort,
  SaveStateInterval,
};
