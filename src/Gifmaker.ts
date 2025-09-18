import fs from 'fs/promises';
import { createWriteStream } from 'fs';
import GIFEncoder from 'gifencoder';
import Discord from 'discord.js';
import glob from 'glob';
import pngFileStream from 'png-file-stream';
import dayjs from 'dayjs';
import { promisify } from 'util';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from './Constants';
import { getDiscordInstance } from './DiscordClient';
import { Log } from './Log';
import { Scale } from './Config';
const globPromise = promisify(glob);

export async function makeGif(): Promise<void> {
  console.log('Making GIF');

  const encoder = new GIFEncoder(SCREEN_WIDTH * Scale, SCREEN_HEIGHT * Scale);

  const outputFilename = `./frames/summary/${dayjs().format(
    'YYYY-MM-DDTHH:mm'
  )}.gif`;
  const imageFiles = await globPromise(`./frames/current/*.png`);
  const frameCounter = imageFiles.length;

  if (frameCounter <= 1) {
    Log.info(`Counted ${frameCounter} frame(s), not needed to post a gif.`);
  } else {
    pngFileStream(`./frames/current/*.png`)
      .pipe(
        encoder.createWriteStream({ repeat: 0, delay: 1000 / 10, quality: 10 })
      )
      .pipe(
        createWriteStream(outputFilename).on('finish', function () {
          postGif(outputFilename, frameCounter);
          imageFiles.forEach((file) => {
            fs.rename(file, file.replace('current', 'old'));
          });
        })
      );
  }
}

async function postGif(filePath: string, frameCounter: number): Promise<void> {
  const client = getDiscordInstance();
  if (!client) {
    throw new Error('Discord client not initialised');
  }
  const buffer = await fs.readFile(filePath);
  const attachment = new Discord.AttachmentBuilder(buffer, { name: 'summary.gif' });
  client.sendMessage(
    `Summary of the last two hours. ${frameCounter} moves were made.`,
    attachment
  );
}
