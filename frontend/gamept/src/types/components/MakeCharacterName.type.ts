import { ICharacterStatus } from './MakeGameProcess.type';

export interface IMakeCharacterName {
  characterStatus: ICharacterStatus;
  setCharacterName: React.Dispatch<React.SetStateAction<ICharacterStatus>>;
  onNextLevel: () => void;
}
