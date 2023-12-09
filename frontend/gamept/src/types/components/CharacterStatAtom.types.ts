export interface ICharacterStatusAtom {
  nickname: string;
  race: string;
  job: string;
  level: number;
  imgCode: string;
  gender?: string;
  hp: number;
  exp: number;
  statPoint: number;
  statList: Array<{ statName: string; statValue: number; statCode: string }>;
  skillList: Array<{ name: string; desc: string }>;
  itemList: Array<{ code: string; name: string; desc: string; weight: number }>;
}
