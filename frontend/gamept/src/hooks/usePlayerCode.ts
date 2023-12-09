// import { useIndexedDB } from 'react-indexed-db-hook';
import { useAtom } from 'jotai';
import { useCallback, useEffect } from 'react';
import { playerCodeAtom } from '@/jotai/MakeGameAtom';

export const usePlayerCode: () => [
  string,
  (playerCode: string) => void,
] = () => {
  // const db = useIndexedDB('codeStore');
  const [getPlayerCodeAtom, setPlayerCodeAtom] = useAtom(playerCodeAtom);

  useEffect(() => {
    // const checkGameCode = async () => {
    //   if (getPlayerCodeAtom.playerCode === '') {
    //     const dbDatas = await db.getAll();
    //     console.log('플레이어 코드 확인', dbDatas);
    //     const dbData = dbDatas[0].playerCode;
    //     setPlayerCodeAtom(dbData);
    //     setPlayerCode(dbData);
    //     return;
    //   }
    //   setPlayerCode(getPlayerCodeAtom);
    // };
    // checkGameCode();
    if (getPlayerCodeAtom === '') {
      const localData = localStorage.getItem('playerCode');
      if (localData === null) return;
      setPlayerCodeAtom(localData);
      setPlayerCode(localData);
      return;
    }
  }, [getPlayerCodeAtom]);

  const setPlayerCode = useCallback(
    (playerCode: string) => {
      // 기존의 db에 저장된 값을 지우고 새로운 값 갱신, atom에도 갱신
      // db.clear();
      // if (playerCode == undefined) return;
      // db.update({ playerCode: playerCode, id: 330 });
      // setPlayerCodeAtom(playerCode);
      localStorage.setItem('playerCode', playerCode);
      setPlayerCodeAtom(playerCode);
    },
    [setPlayerCodeAtom]
  );
  return [getPlayerCodeAtom, setPlayerCode];
};
