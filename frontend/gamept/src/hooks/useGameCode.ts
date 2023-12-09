// import { useIndexedDB } from 'react-indexed-db-hook';
import { useAtom } from 'jotai';
import { useCallback, useEffect } from 'react';
import { gameCodeAtom } from '@/jotai/MakeGameAtom';

export const useGameCode: () => [string, (gameCode: string) => void] = () => {
  // const db = useIndexedDB('codeStore');
  const [getGameCodeAtom, setGameCodeAtom] = useAtom(gameCodeAtom);

  useEffect(() => {
    // const checkGameCode = async () => {
    //   if (getGameCodeAtom === '') {
    //     const dbDatas = await db.getAll();
    //     // const test = await db.getByIndex('gameCode')
    //     // console.log('시시시시시시', test);
    //     const dbData = dbDatas[0].gameCode;
    //     setGameCodeAtom(dbData);
    //     setGameCode(dbData);
    //     return;
    //   }
    //   // code가 남아있을 때 새로 채우기
    //   setGameCode(getGameCodeAtom);
    // };
    // console.log('??????', getGameCodeAtom);
    // checkGameCode();

    if (getGameCodeAtom === '') {
      const localData = localStorage.getItem('gameCode');
      if (localData === null) return;
      setGameCodeAtom(localData);
      setGameCode(localData);
      return;
    }
    setGameCode(getGameCodeAtom);
  }, [getGameCodeAtom]);

  const setGameCode = useCallback(
    async (gameCode: string) => {
      // 기존의 db에 저장된 값을 지우고 새로운 값 갱신, atom에도 갱신\
      // db.clear();
      // db.add({ gameCode: gameCode });
      // await db.add({ playerCode: '' });
      // const playerID = await db.getAll();
      // console.log('플레이어코드 ID 확인', playerID);
      // setGameCodeAtom(gameCode);

      localStorage.setItem('gameCode', gameCode);
      setGameCodeAtom(gameCode);
    },
    [setGameCodeAtom]
  );
  return [getGameCodeAtom, setGameCode];
};
