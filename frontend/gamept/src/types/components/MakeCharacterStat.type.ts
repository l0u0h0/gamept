import { IStatObject } from './CharacterCard.types';

export interface IMakeCharacterStat {
  baseStats: IStatObject[];
  correctionStats: Array<{ statName: string; statBonus: number }>;
  cardType: string;
}

export interface IStatText {
  statType: string;
  baseStat: number;
  correctionStat?: number;
}
