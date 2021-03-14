export type Status = {
  asleep: boolean;
  poisoned: boolean;
  burned: boolean;
  frozen: boolean;
  Paralyzed: boolean;
  [key: string]: boolean;
};
