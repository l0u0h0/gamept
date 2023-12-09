export interface IInput {
  width: string;
  height: string;
  placeholder: string;
  value: string;
  disabled?: boolean;
  setValue: (value: string) => void;
  onClickEvent: () => void;
}