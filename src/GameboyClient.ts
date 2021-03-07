import Gameboy from 'serverboy';
import { KEYMAP } from 'serverboy';
import { PNG } from 'pngjs';
import { Reaction } from './Reaction';
import { Scale } from './Config';

// TODO send audio to voice channel
export class GameboyClient {
  gameboy: any;
  timer: NodeJS.Timeout | null;
  public static Keymap: KEYMAP;
  rendering: boolean;
  buffer: Buffer;

  constructor() {
    this.gameboy = new Gameboy();
    this.timer = null;
    this.rendering = false;
    this.buffer = Buffer.from([]);
  }

  loadRom(rom: Buffer) {
    this.gameboy.loadRom(rom);
  }

  doFrame() {
    this.gameboy.doFrame();
  }

  start() {
    // approximately 60 FPS
    this.timer = setInterval(() => this.doFrame(), 1000 / 60);
    // this.timer = setInterval(() => this.pressKey(Reaction['▶️']), 1000);
  }

  stop() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  pressKey(key: Reaction) {
    console.info(`Pressing ${key}`);
    const actionMap = {
      [Reaction['➡️']]: 'RIGHT',
      [Reaction['⬅️']]: 'LEFT',
      [Reaction['⬆️']]: 'UP',
      [Reaction['⬇️']]: 'DOWN',
      [Reaction['🅰️']]: 'A',
      [Reaction['🅱']]: 'B',
      [Reaction['👆']]: 'SELECT',
      [Reaction['▶️']]: 'START',
    };
    const actionKey = actionMap[key];
    this.gameboy.pressKey(actionKey);
  }

  getFrame() {
    if (this.rendering) {
      this.rendering = true;
      const screen = this.gameboy.getScreen();

      const width = 160;
      const height = 144;
      const png = new PNG({ width: width * Scale, height: height * Scale });

      if (Scale === 1) {
        for (let i = 0; i < screen.length; i++) {
          png.data[i] = screen[i];
        }
      } else {
        // TODO fix this inefficient code
        let rows: number[][] = [];
        for (let i = 0; i < height; i++) {
          const row = screen.splice(0, width * 4);

          let newRow: number[] = [];
          for (let j = 0; j < width; j++) {
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
}
