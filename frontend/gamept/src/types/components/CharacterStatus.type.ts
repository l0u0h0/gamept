import { IStatObject } from './CharacterCard.types';

export interface ICharacterStatus {
  nickname: string;
  race: string;
  job: string;
  imgCode: string;
  statList: IStatObject[];
}
