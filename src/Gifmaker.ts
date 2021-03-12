import fs from 'fs';
import GIFEncoder from 'gifencoder';
import Discord from 'discord.js';
import glob from 'glob';
import pngFileStream from 'png-file-stream';
import dayjs from 'dayjs';
import { promisify } from 'util';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from './Constants';
import { getDiscordInstance } from './DiscordClient';
import { Log } from './Log';
const globPromise = promisify(glob);

export async function makeGif(): Promise<void> {
  console.log('Making GIF');

  const encoder = new GIFEncoder(SCREEN_WIDTH, SCREEN_HEIGHT);

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
        fs.createWriteStream(outputFilename).on('finish', function () {
          postGif(outputFilename, frameCounter);
          imageFiles.forEach((file) => {
            fs.renameSync(file, file.replace('current', 'old'));
          });
        })
      );
  }
}

function postGif(filePath: string, frameCounter: number): void {
  const client = getDiscordInstance();
  if (!client) {
    throw new Error('Discord client not initialised');
  }
  const buffer = fs.readFileSync(filePath);
  const attachment = new Discord.MessageAttachment(buffer, 'summary.gif');
  client.sendMessage(
    `Summary of the last two hours. ${frameCounter} moves were made.`,
    attachment
  );
}
