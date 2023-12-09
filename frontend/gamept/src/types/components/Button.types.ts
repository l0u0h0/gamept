export interface IIngameButton {
  width: string;
  height: string;
  type: string;
  text: string;
  onClickEvent: () => void;
}

export interface ITextButton {
  text: string;
  onClickEvent: () => void;
}

export interface ISelectButton {
  width: string;
  height: string;
  text: string;
  isShadow?: boolean;
  disabled?: boolean;
  onClickEvent: () => void;
}
