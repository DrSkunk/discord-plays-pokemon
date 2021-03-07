import { Gamemode } from './Gamemode';

const Prefix = process.env.PREFIX as string;
const DiscordToken = process.env.DISCORD_TOKEN as string;
const DiscordGuildId = process.env.DISCORD_GUILD_ID as string;
const DiscordChannelId = process.env.DISCORD_CHANNEL_ID as string;
const Romfile = process.env.ROMFILE as string;
const loadedGamemode = process.env.MODE as string;
const DemocracyTimeoutString = process.env.DEMOCRACY_MODE_TIMEOUT as string;
const ScaleString = process.env.SCALE as string;

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

const CurrentGamemode: Gamemode = loadedGamemode;

let Scale: number;
try {
  Scale = Number.parseInt(ScaleString);
} catch (error) {
  throw new Error('The scale is not an integer');
}
if (Scale < 1 || Scale > 6) {
  throw new Error('The scale must be between 1 and 6 inclusive');
}

export {
  Prefix,
  DiscordToken,
  DiscordGuildId,
  DiscordChannelId,
  Romfile,
  CurrentGamemode,
  DemocracyTimeout,
  Scale,
};
