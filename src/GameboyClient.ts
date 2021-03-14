import Gameboy from 'serverboy';
// eslint-disable-next-line @typescript-eslint/no-var-requires
// const Gameboy = require('../../serverboy.js/src/interface.js');
import fs from 'fs';
import { KEYMAP } from 'serverboy';
import { PNG } from 'pngjs';
import { Scale } from './Config';
import { KEY_HOLD_DURATION, SCREEN_HEIGHT, SCREEN_WIDTH } from './Constants';
import { Log } from './Log';
import { KeysToPress } from './types/KeysToPress';
import { MemoryReader } from './MemoryReader';
import { Stats } from './types/Stats';

// TODO send audio to voice channel
class GameboyClient {
  private _gameboy: Gameboy;
  private _timer: NodeJS.Timeout | null;
  private _rendering: boolean;
  private _buffer: Buffer;
  private _keysToPress: KeysToPress;
  public static Keymap: KEYMAP;

  constructor() {
    this._gameboy = new Gameboy();
    this._timer = null;
    this._rendering = false;
    this._buffer = Buffer.from([]);
    this._keysToPress = {};
  }

  loadRom(rom: Buffer): void {
    this._gameboy.loadRom(rom);
  }

  doFrame(): void {
    this._gameboy.doFrame();
    // This is to hold the button for multiple frames to aid button registration
    Object.keys(this._keysToPress).forEach((key) => {
      if (this._keysToPress[key] - 1 !== 0) {
        this._keysToPress[key] -= 1;
        this._gameboy.pressKey(key);
      }
    });
  }

  start(): void {
    // approximately 60 FPS
    this._timer = setInterval(() => this.doFrame(), 1000 / 60);
  }

  stop(): void {
    if (this._timer) {
      clearInterval(this._timer);
    }
  }

  pressKey(key: string): void {
    Log.info(`Pressing ${key}`);
    this._keysToPress[key] = KEY_HOLD_DURATION;
  }

  getFrame(): Buffer {
    if (!this._rendering) {
      this._rendering = true;
      const screen = this._gameboy.getScreen();

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
        const rows: number[][] = [];
        for (let i = 0; i < SCREEN_HEIGHT; i++) {
          // Times 4 because of RGBA
          const row = screen.splice(0, SCREEN_WIDTH * 4);

          const newRow: number[] = [];
          for (let j = 0; j < SCREEN_WIDTH; j++) {
            const pixel = row.splice(0, 4);
            for (let scalerIndex = 0; scalerIndex < Scale; scalerIndex++) {
              newRow.push(...pixel);
            }
          }
          for (let scalerIndex = 0; scalerIndex < Scale; scalerIndex++) {
            rows.push(newRow.flat());
          }
        }
        png.data = Buffer.from(rows.flat());
      }

      this._buffer = PNG.sync.write(png);
      this._rendering = false;
    }
    return this._buffer;
  }
  // TODO only save when savefile changed
  newSaveState(fileName?: string): string {
    let savePath = fileName;
    if (savePath) {
      savePath.replace(/[^\w\s]/gi, '');
    } else {
      savePath = new Date().toISOString();
    }
    savePath = './saves/' + savePath + '.sav';
    const saveState = this._gameboy.saveState();
    fs.writeFileSync(savePath, JSON.stringify(saveState));
    Log.info('Saved new savefile to ', savePath);
    return savePath;
  }

  loadSaveState(fileName: string) {
    const saveState = JSON.parse(
      fs.readFileSync('./saves/' + fileName).toString()
    );
    this._gameboy.returnFromState(saveState);
  }

  getSaveStates(): string[] {
    const saveStates = fs
      .readdirSync('./saves')
      .filter((file) => file.endsWith('.sav'));
    return saveStates;
  }

  getStats(): Stats {
    const memory = new MemoryReader(Object.values(this._gameboy.getMemory()));
    return memory.readStats();
  }
}

const instance = new GameboyClient();

export function getGameboyInstance(): GameboyClient {
  return instance;
}
