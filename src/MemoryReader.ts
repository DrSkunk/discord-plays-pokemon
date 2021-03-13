import { CharMap } from './mapping/CharMap';
import { Moves } from './mapping/Moves';
import { Names } from './mapping/Names';
import { Log } from './Log';
import { Types } from './mapping/Types';

export class MemoryReader {
  private _memory: number[];
  constructor(memory: number[]) {
    this._memory = memory;
  }

  readStats(): any {
    // Mappings from https://datacrystal.romhacking.net/wiki/Pok%C3%A9mon_Red/Blue:RAM_map#Player
    const amountOfPokemon = this._memory[0xd163];
    const playerName = this.readString(this._memory, 0xd158);
    this.readPokemon(this._memory, 0);
    this.readPokemon(this._memory, 1);
    // D158 == 53592
    return {
      playerName,
      amountOfPokemon,
    };
    // const money;
  }

  private readPokemon(memory: number[], pokemonIndex: number) {
    // pokemon offset = 44
    const baseAddress = 0xd16b + 44 * pokemonIndex;
    const name = Names[memory[baseAddress] - 1];
    console.log('name', name);
    const hp = this.readDoubleNumber(baseAddress + 1);
    const status = this.getStatus(memory[baseAddress + 4]); //
    const type1 = Types[memory[baseAddress + 5]]; //
    const type2 = memory[baseAddress + 6];
    const Move1 = Moves[memory[baseAddress + 8] - 2]; // OK
    const Move2 = Moves[memory[baseAddress + 9] - 2]; // OK
    const Move3 = Moves[memory[baseAddress + 10] - 2]; // OK
    const Move4 = Moves[memory[baseAddress + 11] - 2]; // OK

    const PPMove1 = memory[baseAddress + 29]; // 30 OK
    const PPMove2 = memory[baseAddress + 30]; // 35 OK
    const PPMove3 = memory[baseAddress + 31];
    const PPMove4 = memory[baseAddress + 32];
    const level = memory[baseAddress + 33]; // 2 OK
    const maxHP = this.readDoubleNumber(baseAddress + 34); // OK
    const attack = this.readDoubleNumber(baseAddress + 36); // OK
    const defense = this.readDoubleNumber(baseAddress + 38); // OK
    const speed = this.readDoubleNumber(baseAddress + 40); // OK
    const special = this.readDoubleNumber(baseAddress + 42); // OK
    return { name, hp, maxHP };
    //
  }

  private readDoubleNumber(i: number) {
    return this._memory[i] * 256 + this._memory[i + 1];
  }

  private readTripleNumber(i: number) {
    return (
      this._memory[i] * 256 * 256 +
      this._memory[i + 1] * 256 +
      this._memory[i + 2]
    );
  }

  private getStatus(statusByte: number) {
    // bitmask from https://bulbapedia.bulbagarden.net/wiki/Pok%C3%A9mon_data_structure_(Generation_I)
    // bit  value condition
    //  3 	0x04 	Asleep
    //  4 	0x08 	Poisoned
    //  5 	0x10 	Burned
    //  6 	0x20 	Frozen
    //  7 	0x40 	Paralyzed
    const status = {
      asleep: (statusByte & (1 << 2)) !== 0,
      poisoned: (statusByte & (1 << 3)) !== 0,
      burned: (statusByte & (1 << 4)) !== 0,
      frozen: (statusByte & (1 << 5)) !== 0,
      Paralyzed: (statusByte & (1 << 6)) !== 0,
    };
    return status;
  }

  private readString(memory: number[], start: number) {
    const end = start + 10;
    // 0x50 end of string
    const stringTerminatorIndex = memory.slice(start, end).indexOf(0x50);
    if (stringTerminatorIndex === -1) {
      Log.error(
        'Trying to read string in invalid range, does not contain string terminator'
      );
      return '';
    }
    let stringBuffer = '';
    for (let i = start; i < start + stringTerminatorIndex; i++) {
      stringBuffer += CharMap[memory[i]];
    }

    return stringBuffer;
  }
}
