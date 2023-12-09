/**
 * 싱글/멀티플레이 선택 관련 organism 구성
 * multiplay 클릭 시 관련 모달 출현
 * 다음 단계로 넘어가는 로직 미구현
 * @params
 * @returns void
 */

import { useState } from 'react';
import GameModeCard from './GameModeCard';
import { IGameModeCard } from '@/types/components/GameModeCard.type';
import { ISelectGameMode } from '@/types/components/MakeGameProcess.type';
// import MultiplayModal from './MultiplayModal';
import CommingSoonModal from './CommingSoonModal';
import { gameModeAtom } from '@/jotai/MakeGameAtom';
import { useAtom } from 'jotai';
const SelectGameMode = (props: ISelectGameMode) => {
  const [isShowModal, setIsShowModal] = useState(false);
  const [, setSelectMode] = useAtom(gameModeAtom);

  return (
    <div className="pt-[100px] w-full h-full">
      <div className="text-primary text-32 text-center font-hol mb-[30px] caret-transparent ">
        게임 모드를 선택하세요.
      </div>
      <div className="flex flex-row gap-10 justify-center w-[60%] mx-auto">
        {response.map((card, idx) => (
          // 멀티플레이의 modal 컨트롤을 위해 wrapper 역할을 하는 div를 추가 설정
          <div
            className="w-full"
            onClick={
              idx === MULTY && !isShowModal
                ? () => {
                    setIsShowModal(true);
                  }
                : undefined
            }
            key={idx}
          >
            <GameModeCard
              imgUrl={card.imgUrl}
              modeName={card.modeName}
              modeType={card.modeType}
              onClickEvent={
                idx === SINGLE
                  ? () => {
                      setSelectMode(SINGLE);
                      props.onGoSelectStory();
                    }
                  : undefined
              }
              key={idx}
            />
          </div>
        ))}
      </div>
      {isShowModal && (
        <CommingSoonModal
          onClose={() => setIsShowModal(false)}
          // onGoSelectStory={props.onGoSelectStory}
        />
      )}
      {/* {isShowModal && (
        <MultiplayModal
          onClose={() => setIsShowModal(false)}
          onGoSelectStory={props.onGoSelectStory}
        />
      )} */}
    </div>
  );
};

const response: IGameModeCard[] = [
  {
    imgUrl: 'SinglePlay.svg',
    modeName: '싱글 플레이',
    modeType: 'AAA',
  },
  {
    imgUrl: 'MultiPlay.svg',
    modeName: '멀티 플레이',
    modeType: 'AAA',
  },
];

const [SINGLE, MULTY] = [0, 1];

export default SelectGameMode;
