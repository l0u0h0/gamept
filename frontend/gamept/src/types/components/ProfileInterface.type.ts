export interface IProfileInterface {
  hp?: number;
  exp?: number;
  level?: number;
}

export interface IItemInterface {
  itemList: Array<{ code: string; name: string; desc: string; weight: number }>;
}
