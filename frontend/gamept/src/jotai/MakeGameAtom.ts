/**
 * 싱글/멀티 여부 및 스토리 종류 관리하는 atom
 * gameModeAtom : 싱글/멀티 여부를 boolean으로 관리
 *  true : single / muilty : false
 * gameStoryAtom : 스토리 종류 관리하는 atom
 *  문자열 코드로 관리?
 */

import { atom, useAtomValue } from 'jotai';

export const gameModeAtom = atom(0);
export const gameCodeAtom = atom('');
export const playerCodeAtom = atom('');

export const selectGameModeAtom = atom(
  (get) => get(gameModeAtom),
  (_get, set, selectedMode: number) => {
    set(gameModeAtom, () => selectedMode);
    // console.log('게임모드 값 ', selectedMode);
  }
);

export const selectGameCodeAtom = atom(
  (get) => get(gameCodeAtom),
  (_get, set, gameCode: string) => {
    set(gameCodeAtom, () => gameCode);
    // console.log('게임코드값', gameCode);
  }
);

// export const selectPlayerCodeAtom = atom(
//   (get) => get(playerCodeAtom),
//   (_get, set, playerCode: string) => {
//     set(playerCodeAtom, () => playerCode);
//     console.log('플코값', playerCodeAtom);
//   }
// );

export const useGetGameCode = () => useAtomValue(gameCodeAtom);
