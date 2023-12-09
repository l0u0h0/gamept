/*
 * 게임 생성 프로세스 중, 캐릭터 스탯 관련 카드에서 나타나는 스탯 패널 구현\
 * 스탯 text를 감싸는 div와 각 statType별 text를 담당하는 StatText로 이루어짐
 * 보정치와 기본 종족값은 항상 들어오나, 보정치가 없을 경우는 값을 0으로 설정
 * 힘/민/지/행/매 순으로, 스탯값만으로 이루어진 number 배열을 받는다고 가정했으나,
 * 실제로 어떻게 API가 response 보내는지는 백과 상의해야 함.
 */

// import { IStatObject } from '@/types/components/CharacterCard.types';
import {
  IMakeCharacterStat,
  IStatText,
} from '@/types/components/MakeCharacterStat.type';

const StatText = (props: IStatText) => {
  return (
    <div className="flex flex-row items-center text-white text-16 font-hol mx-auto relative">
      <div className="w-10 text-left grow-0">{props.statType}</div>
      <div className="grow-0">: {props.baseStat}</div>
      <div className="text-right text-12 grow text-primary leading-[16px] ml-2 absolute -right-7">
        {itoa(props.correctionStat)}
      </div>
    </div>
  );
};

const MakeCharacterStatContainer = (props: IMakeCharacterStat) => {
  return (
    <div className="bg-[url(./assets/MakeCharacterStatPanel.svg)] grid grid-cols-2 gap-y-1 w-[260px] h-[155px] p-5">
      {props.baseStats.map((stat, idx) => (
        <StatText
          statType={stat.statName}
          baseStat={stat.statValue}
          correctionStat={
            props.correctionStats &&
            props.correctionStats.find(
              (bonusStat) => bonusStat.statName === stat.statName
            )?.statBonus
          }
          key={idx}
        />
      ))}
    </div>
  );
};

const itoa = (input: number | undefined): string => {
  if (input === undefined) return '';
  if (input > 0) {
    return `(+${input})`;
  } else if (input < 0) {
    return `(-${-input})`;
  }
  return '';
};

// const selectBonusStat = (bonusStat: IStatObject[], statName: string) => {
//   bonusStat.find();
// };
export default MakeCharacterStatContainer;
