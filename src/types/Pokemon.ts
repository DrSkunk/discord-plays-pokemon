import { Move } from './Move';
import { Status } from './Status';

export type Pokemon = {
  name: string;
  image: string;
  nickname: string;
  status: Status;
  types: string[];
  moves: Move[];
  hp: number;
  maxHP: number;
  level: number;
  attack: number;
  defense: number;
  speed: number;
  special: number;
  url: string;
};
