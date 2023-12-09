/**
 * 게임 모드 선택 카드 구현
 * @param props
 * modeName : string;
 * modeType: number;
 * imgUrl: string;
 * onClickEvent: () => void;
 *
 * @returns void;
 * 백 API reponse 구성에 따라 변경될 여지가 있음
 */

import CardImage from '@/atoms/CardImage';
import { IGameModeCard } from '@/types/components/GameModeCard.type';

const GameModeCard = (props: IGameModeCard) => {
  return (
    <div
      className=" w-full h-[445px] bg-containerLight rounded-[10px] min-w-[250px] caret-transparent animate-rise hover:animate-bounce"
      onClick={props.onClickEvent}
    >
      <CardImage url={props.imgUrl} alt={`${props.modeName} 이미지`} />
      <div className="leading-[130px] h-[130px] font-hol text-28 text-primary shadow-lg text-center">
        {props.modeName}
      </div>
    </div>
  );
};

export default GameModeCard;
