import Gameboy from 'serverboy';
// eslint-disable-next-line @typescript-eslint/no-var-requires
// const Gameboy = require('../../serverboy.js/src/interface.js');
import fs from 'fs/promises';
import { KEYMAP } from 'serverboy';
import { PNG } from 'pngjs';
import { Scale } from './Config';
import {
  FRAME_WAIT,
  KEY_HOLD_DURATION,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
} from './Constants';
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
  private _keyRepeat: number;
  private _waitFrameCounter: number;

  constructor() {
    this._gameboy = new Gameboy();
    this._timer = null;
    this._rendering = false;
    this._buffer = Buffer.from([]);
    this._keysToPress = {};
    this._keyRepeat = 0;
    this._waitFrameCounter = 0;
  }

  loadRom(rom: Buffer): void {
    this._gameboy.loadRom(rom);
  }

  doFrame(): void {
    this._gameboy.doFrame();

    if (this._waitFrameCounter > 0) {
      this._waitFrameCounter--;
    } else {
      // This is to hold the button for multiple frames to aid button registration
      Object.keys(this._keysToPress).forEach((key) => {
        if (this._keysToPress[key] > 0) {
          this._keysToPress[key]--;
          this._gameboy.pressKey(key);
        }
      });
      const sum = Object.values(this._keysToPress).reduce(
        (acc, val) => acc + val,
        0
      );
      if (this._keyRepeat > 0 && sum === 0) {
        this._waitFrameCounter = FRAME_WAIT;
        this._keyRepeat--;
        Object.keys(this._keysToPress).forEach((key) => {
          this._keysToPress[key] = KEY_HOLD_DURATION;
        });
      }
    }
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

  pressKey(key: string, repeat = 1): void {
    for (const member in this._keysToPress) delete this._keysToPress[member];

    Log.info(`Pressing ${key}`);
    this._keysToPress[key] = KEY_HOLD_DURATION;
    this._keyRepeat = repeat - 1;
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
  async newSaveState(fileName?: string): Promise<string> {
    let savePath = fileName;
    if (savePath) {
      savePath.replace(/[^\w\s]/gi, '');
    } else {
      savePath = new Date().toISOString();
    }
    savePath = './saves/' + savePath + '.sav';
    const saveState = this._gameboy.saveState();
    await fs.writeFile(savePath, JSON.stringify(saveState));
    Log.info('Saved new savefile to ', savePath);
    return savePath;
  }

  async loadSaveState(fileName: string): Promise<void> {
    const saveState = JSON.parse(
      await fs.readFile('./saves/' + fileName, { encoding: 'utf-8' })
    );
    this._gameboy.returnFromState(saveState);
  }

  async getSaveStates(): Promise<string[]> {
    const dir = './saves/';
    const saveStatesPromise = (await fs.readdir(dir))
      .filter((filename) => filename.endsWith('.sav'))
      .map(async (filename) => ({
        filename,
        time: (await fs.stat(dir + filename)).mtime.getTime(),
      }));
    const saveStates = await Promise.all(saveStatesPromise);

    saveStates.sort((a, b) => b.time - a.time);

    return saveStates.map(({ filename }) => filename);
  }

  getStats(): Stats {
    const memory = new MemoryReader(Object.values(this._gameboy.getMemory()));
    return memory.readStats();
  }

  setFastRead(): void {
    this._gameboy.getMemory()[0xd355] = 0x00;
  }
}

const instance = new GameboyClient();

export function getGameboyInstance(): GameboyClient {
  return instance;
}
