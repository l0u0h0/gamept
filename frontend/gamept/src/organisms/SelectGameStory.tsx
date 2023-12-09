/**
 * 스토리 선택 단계 organism 구현
 * setStory로 스토리 code 설정
 * 캐릭터 생성으로 navigate
 * @params props
 * onGoMakeCharacter : () => void // 캐릭터 생성 페이지로 navigate
 * @returns void
 */

import { ISelectGameStory } from '@/types/components/MakeGameProcess.type';
import { fetchPostGame } from '@/services/CreateGameService';
import { gameCodeAtom } from '@/jotai/MakeGameAtom';
import { useAtom } from 'jotai';
import { useNavigate } from 'react-router-dom';
import GameModeCard from './GameModeCard';
// import { useState } from 'react';
import { useGameCode } from '@/hooks/useGameCode';
import { useMutation } from 'react-query';
import { useEffect } from 'react';
import { LoadingBeforeCharacterSet } from './LoadingBeforeCharaceterSet';
const SelectGameStory = (props: ISelectGameStory) => {
  // const [selected, setSelected] = useState(0);
  const [, setGameCode] = useAtom(gameCodeAtom);
  const [_getGCode, setGCode] = useGameCode();
  const navigate = useNavigate();
  const { mutate, data, isLoading, isSuccess } = useMutation(fetchPostGame);
  const handleSelectStory = (storyCode: string) => {
    mutate(storyCode, {});
    // const setGameCodeFromAPI = async () => {
    // const gameCode = (await fetchPostGame(storyCode)).code;

    // };
    // setGameCodeFromAPI();
  };

  useEffect(() => {
    if (!isSuccess) return;
    setGameCode(data.code);
    setGCode(data.code);
    navigate('/createCharacter');
  }, [isSuccess]);

  return (
    <div className="pt-[100px] w-full h-full">
      {!isLoading ? (
        <>
          <div className="text-primary text-32 text-center font-hol mb-[30px] caret-transparent ">
            이야기 종류를 선택하세요.
          </div>
          <div className="flex flex-row gap-10 justify-center w-[80%] mx-auto">
            {props.stories.map((card, idx) => (
              <GameModeCard
                // API에서 url을 받아오지 않으므로 modeType을 파일명으로 만들어 url을 매핑시킬 예정
                // 추후 imgUrl로 넣기 직전에 확장자를 더해주는 작업을 해줘야함
                imgUrl={card.code + '.jpg'}
                modeName={card.name}
                modeType={card.code}
                onClickEvent={() => handleSelectStory(card.code)}
                key={idx}
              />
            ))}
          </div>
        </>
      ) : (
        <LoadingBeforeCharacterSet />
      )}
    </div>
  );
};

export default SelectGameStory;
