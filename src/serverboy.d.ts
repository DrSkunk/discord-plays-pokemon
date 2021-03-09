declare module 'serverboy' {
  namespace serverboy {}
  export default class Gameboy {
    constructor();

    loadRom(rom: Buffer): void;
    doFrame(): void;
    pressKey(key: string): void;
    getScreen(): number[];
    saveState(): void;
    returnFromState(saveState: number[]): void;
  }
  export type KEYMAP = {
    [key: string]: number;
  };
}
