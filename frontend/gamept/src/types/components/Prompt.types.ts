import { Dispatch, SetStateAction } from "react";

// Propmt Atoms Props Type
export interface IPropmpt {
  type: string;
  data: IPromptHistory[][] | null;
  now: string;
  playerCode?: string;
  isFetching: boolean;
  setNowPrompt?: Dispatch<SetStateAction<string>>;
}

export interface IPromptHistory {
  msg: string;
  role: string;
}

export interface IPromptInterface {
  gameType: string;
  isFetching: boolean;
  event: IEventType | null;
  nowPrompt: string;
  setNowPrompt?: Dispatch<SetStateAction<string>>;
  block?: boolean;
  blockChoice?: boolean;
  playerCode?: string;
  sendEventHandler?: (e: IActsType) => void;
  sendPromptHandler?: (text: string) => void;
}

export interface IChoiceGroup {
  gameType: string;
  data?: IActsType[] | null;
  onClickEvent?: (e: IActsType) => void;
}

export interface IMonsterType {
  code: string;
  level: number;
  attack: number;
  hp: number;
}

export interface IPromptType {
  role: string;
  content: string;
}

export interface IGetPromptType {
  gameCode: string;
  // promptList: IPromptType;
  itemYn: string | null;
  itemCode: string | null;
  monster: IMonsterType | null;
  event: IEventType;
}

export interface ISubtaskType {
  code: string;
  name: string;
  desc: string;
}

export interface IActsType {
  actCode: string;
  actName: string;
  subtask: string;
}

export interface IEventType {
  eventCode?: string;
  eventName?: string;
  acts: IActsType[] | null;
}

export interface ISendChoiceType {
  actCode: string;
  playerCode: string;
  gmonsterCode?: string;
  subtask?: string;
}
