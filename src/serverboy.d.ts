// TODO type definitions
declare module 'serverboy' {
  namespace serverboy {}
  export default class Gameboy {
    constructor();
    public static KEYMAP: {
      [key: string]: number;
    };
    loadRom(): string;
  }
  export type KEYMAP = {
    [key: string]: number;
  };
}
