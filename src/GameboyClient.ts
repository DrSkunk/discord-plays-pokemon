// import Gameboy from 'serverboy';
const Gameboy = require('../../serverboy.js/src/interface.js');
import fs from 'fs';
import { KEYMAP } from 'serverboy';
import { PNG } from 'pngjs';
import { Scale } from './Config';
import { KEY_HOLD_DURATION, SCREEN_HEIGHT, SCREEN_WIDTH } from './Constants';
import { Log } from './Log';

type KeysToPress = {
  [key: string]: number;
};

// TODO send audio to voice channel
export class GameboyClient {
  gameboy: any;
  timer: NodeJS.Timeout | null;
  public static Keymap: KEYMAP;
  rendering: boolean;
  buffer: Buffer;
  keysToPress: KeysToPress;

  constructor() {
    this.gameboy = new Gameboy();
    this.timer = null;
    this.rendering = false;
    this.buffer = Buffer.from([]);
    this.keysToPress = {};
  }

  loadRom(rom: Buffer) {
    this.gameboy.loadRom(rom);
  }

  doFrame() {
    this.gameboy.doFrame();
    // This is to hold the button for multiple frames to aid button registration
    Object.keys(this.keysToPress).forEach((key) => {
      if (this.keysToPress[key] - 1 !== 0) {
        this.keysToPress[key] -= 1;
        this.gameboy.pressKey(key);
      }
    });
  }

  start() {
    // approximately 60 FPS
    this.timer = setInterval(() => this.doFrame(), 1000 / 60);
  }

  stop() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  pressKey(key: string) {
    Log.info(`Pressing ${key}`);
    this.keysToPress[key] = KEY_HOLD_DURATION;
  }

  getFrame() {
    if (!this.rendering) {
      this.rendering = true;
      const screen = this.gameboy.getScreen();

      const png = new PNG({
        width: SCREEN_WIDTH * Scale,
        height: SCREEN_HEIGHT * Scale,
      });

      if (Scale === 1) {
        for (let i = 0; i < screen.length; i++) {
          png.data[i] = screen[i];
        }
      } else {
        // TODO fix this inefficient code
        let rows: number[][] = [];
        for (let i = 0; i < SCREEN_HEIGHT; i++) {
          // Times 4 because of RGBA
          const row = screen.splice(0, SCREEN_WIDTH * 4);

          let newRow: number[] = [];
          for (let j = 0; j < SCREEN_WIDTH; j++) {
            const pixel = row.splice(0, 4);
            for (let scalerIndex = 0; scalerIndex < Scale; scalerIndex++) {
              newRow.push(pixel);
            }
          }
          for (let scalerIndex = 0; scalerIndex < Scale; scalerIndex++) {
            rows.push(newRow.flat());
          }
        }
        png.data = Buffer.from(rows.flat());
      }

      this.buffer = PNG.sync.write(png);
      this.rendering = false;
    }
    return this.buffer;
  }

  newSaveState(fileName?: string) {
    let savePath = fileName;
    if (savePath) {
      savePath.replace(/[^\w\s]/gi, '');
    } else {
      savePath = new Date().toISOString();
    }
    savePath = './saves/' + savePath + '.sav';
    const saveState = this.gameboy.saveState();
    fs.writeFileSync(savePath, JSON.stringify(saveState));
    Log.info('saved new savefile to ', savePath);
  }
}
