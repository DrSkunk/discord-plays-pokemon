import { Gym } from './Gym';
import { Pokemon } from './Pokemon';

export type Stats = {
  playerName: string;
  rivalName: string;
  pokemon: Pokemon[];
  money: number;
  time: string;
  gyms: Gym[];
  location: string;
};
