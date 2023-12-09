// DiceComponent PropsInterface
export interface IDice {
  throw?: boolean;
  dice1: number;
  dice2: number;
  dice3: number;
}

export interface IDiceFace {
  idx: number;
}

export interface IDiceModal {
  dice1: number;
  dice2: number;
  dice3: number;
  onClose: () => void;
}