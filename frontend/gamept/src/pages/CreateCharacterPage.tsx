/**
 *
 * @returns
 */

import Logo from '@/atoms/Logo';
import SelectCharacter from '@/organisms/SelectCharacter';
import MakeCharacterName from '@/organisms/MakeCharacterName';
import LoadingGameMake from '@/organisms/LoadingGameMake';
import { useState, useEffect } from 'react';
import { ICharacterStatus } from '@/types/components/MakeGameProcess.type';
import { useNavigate } from 'react-router-dom';
import { useAtom } from 'jotai';
// import { selectGameCodeAtom } from '@/jotai/MakeGameAtom';
import { useQuery } from 'react-query';
import {
  fetchGetRaces,
  fetchGetJobs,
  fetchPostPlayer,
  fetchGetPlayerInfo,
} from '@/services/CreateCharacterService';
import { IStatObject } from '@/types/components/CharacterCard.types';
import { useMutation } from 'react-query';
import { initCharacterStatusAtom, initExtra } from '@/jotai/CharacterStatAtom';
import { usePlayerCode } from '@/hooks/usePlayerCode';
// import { useGetGameCode } from '@/jotai/MakeGameAtom';
import { useGameCode } from '@/hooks/useGameCode';

const CreateCharacterPage = () => {
  const [gameCode, _setGameCode] = useGameCode();
  const [_playerCode, setPlayerCode] = usePlayerCode();
  // const getGameCodeAtom = useGetGameCode();

  const [characterStatus, setCharacterStatus] = useState<ICharacterStatus>({
    race: '',
    raceCode: '',
    job: '',
    jobCode: '',
    gender: 0,
    nickname: '',
    imgCode: '',
    statList: [],
    bonusList: [],
  });

  const [processLevel, setProcessLevel] = useState(0);
  const navigate = useNavigate();
  // const [gameCode] = useAtom(selectGameCodeAtom);
  const [, initCharacter] = useAtom(initCharacterStatusAtom);
  const [, initExtraData] = useAtom(initExtra);
  const { data: races, isSuccess: isRaceSuccess } = useQuery({
    queryKey: ['getRaces', gameCode],
    queryFn: () => fetchGetRaces(gameCode),
  });
  const { data: jobs, isSuccess: isJobSuccess } = useQuery({
    queryKey: ['getJobs', gameCode],
    queryFn: () => fetchGetJobs(gameCode),
  });
  const { mutate } = useMutation(fetchPostPlayer);
  const handleNextLevel = () => setProcessLevel(processLevel + 1);
  const handlePreviousLevel = () => setProcessLevel(processLevel - 1);
  const handleRaceSelect = (
    gender: number,
    imgCode: string,
    race: string,
    raceCode: string,
    statList: IStatObject[] | Array<{ statName: string; statBonus: number }>
  ) => {
    // statList 깊은 복사 해야하는데 일단 귀찮아서 그대로 넣음...
    setCharacterStatus({
      ...characterStatus,
      gender,
      imgCode,
      race,
      raceCode,
      statList: statList as IStatObject[],
    });
  };

  const handleClassSelect = (
    gender: number,
    imgCode: string,
    job: string,
    jobCode: string,
    statList: IStatObject[] | Array<{ statName: string; statBonus: number }>
  ) => {
    // bonusList 깊은 복사 해야 하는데 일단 귀찮아서 그대로 넣음...
    setCharacterStatus({
      ...characterStatus,
      gender,
      imgCode,
      job,
      jobCode,
      bonusList: statList as Array<{ statName: string; statBonus: number }>,
    });
  };

  const handleNextStage = (playerCode: string) => {
    const setSkillAtom = async () => {
      // 스킬을 위한 API 요청 보내기
      const playerInfo = await fetchGetPlayerInfo(gameCode, playerCode);

      // 받은 API를 atom에 초기화
      initCharacter(playerInfo);
      // API response에는 imgCode 없으니 따로 넣어줌
      initExtraData(characterStatus.imgCode, characterStatus.gender);

      // setTimeout(() => navigate('/singlePlay'), 3000);
      navigate('/singlePlay');
    };

    setSkillAtom();

    // navigate('/singlePlay');
  };

  useEffect(() => {
    if (processLevel < 3) return;

    mutate(
      {
        gameCode,
        raceCode: characterStatus.raceCode,
        jobCode: characterStatus.jobCode,
        nickname: characterStatus.nickname,
      },
      {
        onSuccess: (res) => {
          setPlayerCode(res.playerCode);

          handleNextStage(res.playerCode);
        },
        onError: () => {
          // console.log('에러 근데 검출이 안됨', err);
        },
      }
    );
  }, [processLevel]);

  const createCharacterProcess = [
    <SelectCharacter
      type="종족"
      onNextLevel={handleNextLevel}
      gender={characterStatus.gender}
      onSetCharacter={handleRaceSelect}
      onPreviosLevel={() => navigate('/createGame')}
      data={isRaceSuccess ? races : undefined}
      // 이전 페이지로 보내려면 결국 무슨 단계인지 알려주는 그 불리언 변수도 같이 넘겨줘야 한다.
    />,
    <SelectCharacter
      type="직업"
      onNextLevel={handleNextLevel}
      gender={characterStatus.gender}
      onPreviosLevel={handlePreviousLevel}
      onSetCharacter={handleClassSelect}
      data={isJobSuccess ? jobs : undefined}
      raceCode={characterStatus.raceCode}
      statList={characterStatus.statList}
    />,
    <MakeCharacterName
      characterStatus={characterStatus}
      setCharacterName={setCharacterStatus}
      onNextLevel={handleNextLevel}
    />,
  ];

  return (
    <div className="bg-backgroundDeep w-screen h-screen max-h-[750px] relative">
      <Logo />
      {isRaceSuccess && createCharacterProcess[processLevel]}
      {processLevel === 3 && <LoadingGameMake />}
    </div>
  );
};

export default CreateCharacterPage;
