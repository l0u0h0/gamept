/**
 * 게임 생성 페이지
 * isSelectStory 값에 따라 싱글/멀티 선택 or 스토리 선택 단계 표현
 * @params props
 * @returns void
 */

import Logo from '@/atoms/Logo';
import SelectGameMode from '@/organisms/SelectGameMode';
import SelectGameStory from '@/organisms/SelectGameStory';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { fetchGetStories } from '@/services/CreateGameService';

const CreateGamePage = () => {
  const [isSelectStory, setIsSelectStory] = useState(false);

  const { data, isSuccess } = useQuery({
    queryKey: ['getStories'],
    queryFn: () => fetchGetStories(),
  });

  const goSelectStory = () => {
    setIsSelectStory(true);
  };

  // if (isSuccess) {
  //   console.log(data);
  // }

  return (
    <div className="w-screen h-screen bg-backgroundDeep max-h-[750px] relative flex flex-col justify-center">
      <Logo />
      {!isSelectStory && data && (
        <SelectGameMode onGoSelectStory={goSelectStory} />
      )}
      {isSelectStory && data && <SelectGameStory stories={data} />}
      {!data && isSuccess && (
        <div className="font-hol m-auto text-32 text-center">
          요청에 문제가 발생했습니다. 새로고침해주세요!
        </div>
      )}
    </div>
  );
};

export default CreateGamePage;
