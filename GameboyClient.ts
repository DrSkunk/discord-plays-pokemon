import Gameboy from 'serverboy';
import { PNG } from 'pngjs';

export class GameboyClient {
  gameboy: any;
  timer: NodeJS.Timeout | null;

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

  getFrame() {
    const screen = this.gameboy.getScreen();
    const png = new PNG({ width: 160, height: 144 });
    for (let i = 0; i < screen.length; i++) {
      png.data[i] = screen[i];
    }

    return PNG.sync.write(png);
  }
}
