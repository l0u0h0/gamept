export interface ICardImage {
  url: string;
  alt: string;
}

export interface IProfileImage {
  onClickEvent?: any;
  hasBorderAsset?: boolean;
  size: number;
  imgCode: string;
  alt: string;
  className?: string;
}
