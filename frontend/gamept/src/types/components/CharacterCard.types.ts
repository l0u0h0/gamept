export interface IStatObject {
  statName: string;
  statValue: number;
}

export interface ICharacterCard {
  type: string;
  gender?: number;
  name: string;
  code: string;
  baseStats: IStatObject[];
  correctionStats: Array<{ statName: string; statBonus: number }>;
  onNextLevel?: () => void;
  onSetCharacter?: (
    gender: number,
    imgCode: string,
    select: string,
    code: string,
    statList: IStatObject[] | Array<{ statName: string; statBonus: number }>
  ) => void;
  raceCode?: string;
  idx: number;
}

export interface ISwitchGender {
  gender: number;
  onClickEvent: (event: React.MouseEvent) => void;
}

export interface ICharacterResponse {
  codeName: string;
  stats: IStatObject[];
}
