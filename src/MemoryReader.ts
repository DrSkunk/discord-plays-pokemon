import { CharMap } from './mapping/CharMap';
import { Moves } from './mapping/Moves';
import { Names } from './mapping/Names';
import { Log } from './Log';
import { Types } from './mapping/Types';
import { Status } from './types/Status';
import { Stats } from './types/Stats';
import { Pokemon } from './types/Pokemon';

export class MemoryReader {
  private _memory: number[];
  constructor(memory: number[]) {
    this._memory = memory;
  }

  readStats(): Stats {
    // Mappings from https://datacrystal.romhacking.net/wiki/Pok%C3%A9mon_Red/Blue:RAM_map#Player
    const amountOfPokemon = this._memory[0xd163];
    const playerName = this.readString(0xd158);
    const rivalName = this.readString(0xd34a);
    const pokemon = [];
    for (let i = 0; i < amountOfPokemon; i++) {
      pokemon.push(this.readPokemon(i));
    }
    const money = this.readTripleNumber(this._memory[0xd347]);
    return {
      playerName,
      rivalName,
      pokemon,
      money,
    };
  }

  private readPokemon(pokemonIndex: number): Pokemon {
    // pokemon offset = 44
    const baseAddress = 0xd16b + 44 * pokemonIndex;

    const name = Names[this._memory[baseAddress] - 1];
    const image = `https://img.pokemondb.net/sprites/bank/normal/${name.toLowerCase()}.png`;
    const hp = this.readDoubleNumber(baseAddress + 1);
    const status = this.getStatus(this._memory[baseAddress + 4]);

    const types = [Types[this._memory[baseAddress + 5]]];
    const type2 = this._memory[baseAddress + 6];
    if (type2 !== types[0]) {
      types.push(type2);
    }
    const moves = [];
    const move1 = Moves[this._memory[baseAddress + 8] - 2];
    const move2 = Moves[this._memory[baseAddress + 9] - 2];
    const move3 = Moves[this._memory[baseAddress + 10] - 2];
    const move4 = Moves[this._memory[baseAddress + 11] - 2];
    if (move1) {
      moves.push(move1);
    }
    if (move2) {
      moves.push(move2);
    }
    if (move3) {
      moves.push(move3);
    }
    if (move4) {
      moves.push(move4);
    }
    // const PPMove1 = this._memory[baseAddress + 29];
    // const PPMove2 = this._memory[baseAddress + 30];
    // const PPMove3 = this._memory[baseAddress + 31];
    // const PPMove4 = this._memory[baseAddress + 32];
    const level = this._memory[baseAddress + 33];
    const maxHP = this.readDoubleNumber(baseAddress + 34);
    const attack = this.readDoubleNumber(baseAddress + 36);
    const defense = this.readDoubleNumber(baseAddress + 38);
    const speed = this.readDoubleNumber(baseAddress + 40);
    const special = this.readDoubleNumber(baseAddress + 42);

    // nickname offset = 11
    const nickname = this.readString(0xd2b5 + 11 * pokemonIndex);

    const url = 'https://pokemondb.net/pokedex/' + name.toLowerCase();

    return {
      name,
      image,
      nickname,
      status,
      types,
      moves,
      hp,
      maxHP,
      level,
      attack,
      defense,
      speed,
      special,
      url,
    };
  }

  private readDoubleNumber(i: number): number {
    return this._memory[i] * 256 + this._memory[i + 1];
  }

  private readTripleNumber(i: number) {
    return (
      this._memory[i] * 256 * 256 +
      this._memory[i + 1] * 256 +
      this._memory[i + 2]
    );
  }

  private getStatus(statusByte: number): Status {
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

  private readString(start: number): string {
    const end = start + 10;
    // 0x50 end of string
    const stringTerminatorIndex = this._memory.slice(start, end).indexOf(0x50);
    if (stringTerminatorIndex === -1) {
      Log.error(
        'Trying to read string in invalid range, does not contain string terminator'
      );
      return '';
    }
    let stringBuffer = '';
    for (let i = start; i < start + stringTerminatorIndex; i++) {
      stringBuffer += CharMap[this._memory[i]];
    }

    return stringBuffer;
  }
}
