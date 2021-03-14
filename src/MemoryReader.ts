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
    // TODO catch when no data has been set like in the start of the game
    // Mappings from https://datacrystal.romhacking.net/wiki/Pok%C3%A9mon_Red/Blue:RAM_map#Player
    const amountOfPokemon = this._memory[0xd163];
    const playerName = this.readString(0xd158);
    const rivalName = this.readString(0xd34a);
    const pokemon = [];
    for (let i = 0; i < amountOfPokemon; i++) {
      pokemon.push(this.readPokemon(i));
    }

    const money = this.readMoney();
    const totalHours = this.readDoubleNumber(0xda40);
    const hours = Math.floor(totalHours % 24);
    const minutes = this.readDoubleNumber(0xda42);
    const time = `${this.leadingZero(hours)}:${this.leadingZero(minutes)}`;

    return {
      playerName,
      rivalName,
      pokemon,
      money,
      time,
    };
  }

  private leadingZero(input: number) {
    if (input > 10) {
      return input.toString();
    }
    return '0' + input.toString();
  }

  private readPokemon(pokemonIndex: number): Pokemon {
    // pokemon offset = 44
    const baseAddress = 0xd16b + 44 * pokemonIndex;

    const name = Names[this._memory[baseAddress] - 1];
    const imageName = name.toLowerCase().replace('♂', '-m').replace('♀', '-f');
    const image = `https://img.pokemondb.net/sprites/bank/normal/${imageName}.png`;
    const hp = this.readDoubleNumber(baseAddress + 1);
    const status = this.getStatus(this._memory[baseAddress + 4]);

    const types = [Types[this._memory[baseAddress + 5]]];
    const type2 = Types[this._memory[baseAddress + 6]];
    if (type2 !== types[0]) {
      types.push(type2);
    }
    const moves = [];
    const move1 = Moves[this._memory[baseAddress + 8] - 1];
    const move2 = Moves[this._memory[baseAddress + 9] - 1];
    const move3 = Moves[this._memory[baseAddress + 10] - 1];
    const move4 = Moves[this._memory[baseAddress + 11] - 1];
    if (move1) {
      move1.pp = this._memory[baseAddress + 29];
      moves.push(move1);
    }
    if (move2) {
      move2.pp = this._memory[baseAddress + 30];
      moves.push(move2);
    }
    if (move3) {
      move3.pp = this._memory[baseAddress + 31];
      moves.push(move3);
    }
    if (move4) {
      move4.pp = this._memory[baseAddress + 32];
      moves.push(move4);
    }

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
    return (this._memory[i] << 8) + this._memory[i + 1];
  }

  private readMoney(): number {
    // from https://gist.github.com/joaomaia/3892692
    const bcd2number = function (bcd: number[]) {
      let n = 0;
      let m = 1;
      for (let i = 0; i < bcd.length; i += 1) {
        n += (bcd[bcd.length - 1 - i] & 0x0f) * m;
        n += ((bcd[bcd.length - 1 - i] >> 4) & 0x0f) * m * 10;
        m *= 100;
      }
      return n;
    };

    const money = bcd2number([
      this._memory[0xd347],
      this._memory[0xd348],
      this._memory[0xd349],
    ]);
    return money;
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
