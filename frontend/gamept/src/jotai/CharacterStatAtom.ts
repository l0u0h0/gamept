/**
 * 생성한 캐릭터의 스탯을 관리하는 atom
 * 싱글 플레이 기준으로 관리, 멀티 플레이가 개발된다면 atom을 객체 배열로 변경
 * name : 플레이어 이름
 * race : 종족
 * job : 직업
 * imgCode : 캐릭터 코드 - 프로필 이미지 불러오는 용도
 * stat : 스탯 배열
 */
import { GENDER } from '@/services/GetImgCode';
import { atom, useSetAtom, useAtomValue } from 'jotai';
import { IPlayerStatusResponse } from '@/types/components/MakeGameProcess.type';
import { ICharacterStatusAtom } from '@/types/components/CharacterStatAtom.types';
import { IProfileInterface } from '@/types/components/ProfileInterface.type';

export const characterStatusAtom = atom<ICharacterStatusAtom>({
  nickname: '',
  race: '',
  job: '',
  gender: '',
  imgCode: '',
  statPoint: 0,
  level: 0,
  hp: 0,
  exp: 0,
  statList: [],
  skillList: [],
  itemList: [],
});

const setLocal = (status: ICharacterStatusAtom) => {
  localStorage.setItem('characterStatus', JSON.stringify(status));
};

// 캐릭터 생성 시 캐릭터 정보 atom 초기화
export const initCharacterStatusAtom = atom(
  (get) => {
    let status = get(characterStatusAtom);
    const localData = localStorage.getItem('characterStatus');
    if (status.nickname === '' && localData) {
      // 새로고침했을 경우 로컬에 저장된 값 불러오기
      status = JSON.parse(localData);
    }
    return status;
  },
  (_get, set, status: IPlayerStatusResponse) => {
    // 갱신한 객체
    console.log('범인은 setStatALl');
    const nextStatus = {
      nickname: status.nickname,
      race: status.race.name,
      job: status.job.name,
      imgCode: '',
      statPoint: 0,
      hp: status.hp,
      level: status.level,
      exp: status.exp,
      statList: status.statList.map<{
        statName: string;
        statValue: number;
        statCode: string;
      }>((element) => ({
        statName: element.statName,
        statValue: element.statValue,
        statCode: element.statCode,
      })),
      skillList: status.job.skillList.map<{ name: string; desc: string }>(
        (element) => ({ ...element })
      ),
      itemList: status.itemList.map<{
        code: string;
        name: string;
        desc: string;
        weight: number;
      }>((element) => ({ ...element })),
    };
    // 로컬스토리지에 저장
    setLocal(nextStatus);
    // 아톰 갱신
    set(characterStatusAtom, nextStatus);
  }
);

// export const useInitCharacterStatus = () => useAtomValue(initCharacterStatusAtom)
// export const useSetCharacterStatus = () => useSetAtom(initCharacterStatusAtom)

// 이미지코드 초기화
export const initExtra = atom(
  null,
  (get, set, imgCode: string, gender: number) => {
    // 갱신된 객체
    const nextStatus = {
      ...get(characterStatusAtom),
      imgCode,
      gender: gender === GENDER.MALE ? '남성' : '여성',
    };
    // 로컬스토리지에 저장
    setLocal(nextStatus);
    // 아톰 갱신
    set(characterStatusAtom, nextStatus);
    // set(characterStatusAtom, (prev) => ({
    //   ...prev,
    //   imgCode,
    //   gender: gender === GENDER.MALE ? '남성' : '여성',
    // }));
  }
);

// get 캐릭터 스탯, set 캐릭터 스텟
export const statControlAtom = atom(
  (get) => {
    let statList = get(characterStatusAtom).statList;
    const localData = localStorage.getItem('characterStatus');
    if (statList.length === 0 && localData) {
      // 새로고침했을 경우 로컬에 저장된 값 불러오기
      statList = JSON.parse(localData).statList;
    }
    return statList;
  },
  (
    get,
    set,
    changedStat: Array<{
      statName: string;
      statValue: number;
      statCode: string;
    }>
  ) => {
    // 갱신할 객체
    console.log('범인은 stat');
    const nextStatus = {
      ...get(initCharacterStatusAtom),

      statList: changedStat.map<{
        statName: string;
        statValue: number;
        statCode: string;
      }>((element) => ({ ...element })),
    };
    // 로컬에 갱신
    setLocal(nextStatus);
    set(characterStatusAtom, nextStatus);
  }
);

// useStatAtom : statList 가져오기
// useUpdateStatAtom(statList) : 넣은 statList 기준으로 스탯 갱신
export const useStatAtom = () => useAtomValue(statControlAtom);
export const useUpdateStatAtom = () => useSetAtom(statControlAtom);

// 프로필 인터페이스 반영 및 가져오기
export const profileInterfaceControlAtom = atom(
  (get) => {
    const status = get(characterStatusAtom);
    return {
      hp: status.hp,
      exp: status.exp,
      level: status.level,
    };
  },
  (get, set, profileChanged: IProfileInterface) => {
    const nextStatus = {
      ...get(initCharacterStatusAtom),
      ...profileChanged,
    };
    setLocal(nextStatus);
    set(characterStatusAtom, nextStatus);
  }
);

export const useProfileAtom = () => useAtomValue(profileInterfaceControlAtom);
export const useUpdateProfileAtom = () =>
  useSetAtom(profileInterfaceControlAtom);

// 스킬 가져오기 필요시 구현

// 아이템 set 및 get은 추후 구현 (사용안할수도 있으니)
const controlItemListAtom = atom(
  (get) => get(characterStatusAtom).itemList,
  (
    get,
    set,
    changedItemList: Array<{
      code: string;
      name: string;
      desc: string;
      weight: number;
    }>
  ) => {
    const nextStatus = {
      ...get(initCharacterStatusAtom),
      itemList: changedItemList.map<{
        code: string;
        name: string;
        desc: string;
        weight: number;
      }>((element) => ({
        ...element,
      })),
    };
    setLocal(nextStatus);
    set(characterStatusAtom, nextStatus);
  }
);

// const deleteItem = atom(null, (get, set, usedItemCode: string) => {
//   const prev = get(characterStatusAtom);
//   const targetIdx = prev.itemList.findIndex(
//     (item) => item.code === usedItemCode
//   );
//   const itemList = prev.itemList.splice(targetIdx, 1);
//   const nextStatus = {
//     ...prev,
//     itemList: itemList.map<{
//       code: string;
//       name: string;
//       desc: string;
//       weight: number;
//     }>((item) => ({ ...item })),
//   };
//   setLocal(nextStatus);
//   set(characterStatusAtom, nextStatus);
// });
const deleteItem = atom(null, (get, set, usedItemCode: string) => {
  const prev = get(characterStatusAtom);
  const itemList = prev.itemList.filter((e) => e.code !== usedItemCode);
  const nextStatus = {
    ...prev,
    itemList: itemList.map<{
      code: string;
      name: string;
      desc: string;
      weight: number;
    }>((item) => ({ ...item })),
  };
  console.log(itemList);
  setLocal(nextStatus);
  set(characterStatusAtom, nextStatus);
});

export const useItemListAtom = () => useAtomValue(controlItemListAtom);
export const useUpdateItemListAtom = () => useSetAtom(controlItemListAtom);
export const useDeleteItemAtom = () => useSetAtom(deleteItem);

export const statObjectAtom = atom(
  (get) => {
    return {
      statList: get(characterStatusAtom).statList,
      statPoint: get(characterStatusAtom).statPoint,
    };
  },
  (
    get,
    set,
    changedStat: {
      statPoint: number;
      statList: Array<{
        statName: string;
        statValue: number;
        statCode: string;
      }>;
    }
  ) => {
    // 갱신할 객체
    const nextStatus = {
      ...get(initCharacterStatusAtom),
      statPoint: changedStat.statPoint,
      statList: changedStat.statList.map<{
        statName: string;
        statValue: number;
        statCode: string;
      }>((element) => ({ ...element })),
    };
    console.log("Next Status: ", nextStatus);
    // 로컬에 갱신
    setLocal(nextStatus);
    set(characterStatusAtom, nextStatus);
  }
);

export const useStatObjectAtom = () => useAtomValue(statObjectAtom);
export const useStatUpAtom = () => useSetAtom(statObjectAtom);
