import Gameboy from 'serverboy';
import { KEYMAP } from 'serverboy';
import { PNG } from 'pngjs';
import { Reaction } from './Reaction';
import fs from 'fs';

// TODO send audio to voice channel
export class GameboyClient {
  gameboy: any;
  timer: NodeJS.Timeout | null;
  public static Keymap: KEYMAP;

  constructor() {
    this.gameboy = new Gameboy();
    this.timer = null;
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
  }

  stop() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  pressKey(key: Reaction) {
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
    this.gameboy.pressKey(actionMap[key]);
  }

  getFrame() {
    const screen = this.gameboy.getScreen();

    const scale = 3;
    const width = 160;
    const height = 144;
    const png = new PNG({ width: width * scale, height: height * scale });

    // TODO fix this inefficient code

    let rows: number[][] = [];
    for (let i = 0; i < height; i++) {
      const row = screen.splice(0, width * 4);

      let newRow: number[] = [];
      for (let j = 0; j < width; j++) {
        const pixel = row.splice(0, 4);
        for (let scalerIndex = 0; scalerIndex < scale; scalerIndex++) {
          newRow.push(pixel);
        }
      }
      for (let scalerIndex = 0; scalerIndex < scale; scalerIndex++) {
        rows.push(newRow.flat());
      }
    }
    png.data = Buffer.from(rows.flat());

    const buffer = PNG.sync.write(png);
    fs.writeFileSync('./test.png', buffer);
    return buffer;
  }
}
