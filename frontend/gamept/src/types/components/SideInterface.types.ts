export interface ISideInterface {
  sendChat?: (text: string) => void;
  sendEventStat: (statCode: string) => void;
  deleteItem: (itemCode: string) => void;
  chat?: string[] | null;
}

export interface IChattingTab {
  sendChat?: (text: string) => void;
  chat?: string[] | null;
}