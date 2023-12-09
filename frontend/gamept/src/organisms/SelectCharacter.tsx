/**
 * 종족/ 직업 선택 컴포넌트 구현
 * @praams props
 * type: string : 종족/직업 구분
 * apiURL : string : 종족/직업에 따라 전송할 api 경로
 * playerStats? : Array<{statType: string; statValue: number}> : 직업 선택시 전송할 기본 스탯
 * @returns void
 */

import { ISelectCharacter } from '@/types/components/MakeGameProcess.type';
import CharacterCard from './CharacterCard';

const SelectCharacter = (props: ISelectCharacter) => {
  const statList = props.statList ?? initData;

  return (
    <div className="w-screen">
      <div className="text-primary text-32 font-hol pt-[100px] text-center">
        당신의 {props.type}은 무엇입니까?
      </div>
      <div className="m-auto xl:w-full w-[50%] min-w-[850px] flex flex-row gap-10 justify-center my-[30px] flex-wrap">
        {props.data.map((character, idx) => (
          <CharacterCard
            baseStats={props.type === '종족' ? character.statList : statList}
            code={character.code}
            correctionStats={character.bonusList}
            onSetCharacter={props.onSetCharacter}
            type={props.type}
            name={character.name}
            gender={props.gender}
            onNextLevel={props.onNextLevel}
            raceCode={props.raceCode}
            key={character.code}
            idx={idx}
          />
        ))}
      </div>
      <div className="text-primary text-28 font-hol text-center">
        {props.type}에 따라 {props.type === '종족' ? '기본' : '추가'} 스탯이
        결정됩니다.
      </div>
    </div>
  );
};

const initData = [
  { statName: '건강', statValue: 10 },
  { statName: '힘', statValue: 10 },
  { statName: '민첩', statValue: 10 },
  { statName: '지능', statValue: 10 },
  { statName: '행운', statValue: 10 },
  { statName: '매력', statValue: 10 },
];
export default SelectCharacter;
