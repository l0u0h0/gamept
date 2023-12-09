import Gauge from '@/atoms/Gauge';
import axios from 'axios';
import {
  initCharacterStatusAtom,
  // useUpdateProfileAtom,
} from '@/jotai/CharacterStatAtom';
import { useAtom } from 'jotai';
// import { useRef, useEffect } from 'react';
// import SockJS from 'sockjs-client';
// import { CompatClient, Stomp } from '@stomp/stompjs';
// import { IProfileInterface } from '@/types/components/ProfileInterface.type';
// import { usePlayerCode } from '@/hooks/usePlayerCode';
import ProfileImage from '@/atoms/ProfileImage';

const ProfileInterface = () => {
  const [getStatusAtom] = useAtom(initCharacterStatusAtom);
  // const [playerCode] = usePlayerCode();
  // const client = useRef<CompatClient | null>(null);
  // const setProfileStat = useUpdateProfileAtom();
  // console.log('스테이터스', getStatusAtom);
  // const connectHandler = () => {
  //   const sock = new SockJS(import.meta.env.VITE_SOCKET_URL);
  //   client.current = Stomp.over(() => sock);

  //   // 웹 소켓 연결 정보 콘솔에 안뜨게 하기 >> 코드 프리징 시 주석 풀기
  //   // client.current.debug = () => null;

  //   client.current.connect({}, () => {
  //     if (client.current == null) {
  //       console.log('Error');
  //       return;
  //     }

  //     // hp, exp, level 받아오는 채널
  //     client.current.subscribe(
  //       `/queue/${playerCode}/status`,
  //       (message) => {
  //         console.log(JSON.parse(message.body));
  //         // message.body를 통해 데이터 받아서
  //         // 프로필 업데이트 로직 수행
  //         // 해당 방 구독하는 모든 플레이어들 데이터 저장하는 객체에다가 업데이트
  //         setProfileStat(message.body as IProfileInterface);
  //       },
  //       {}
  //     );
  //   });
  // };

  // const disConnected = () => {
  //   if (client.current !== null) {
  //     try {
  //       client.current.debug = () => null;
  //       client.current.disconnect(() => {
  //         if (client.current) {
  //           client.current.unsubscribe('sub-0');
  //         }
  //       });
  //     } catch (err) {
  //       console.log('disconneted Failed');
  //     }
  //     client.current = null;
  //   } else console.log('Already Disconnected!!!');
  // };

  // useEffect(() => {
  //   if (client.current === null) {
  //     connectHandler();
  //   }

  //   return () => {
  //     disConnected();
  //   };
  // }, []);

  const handleLevelUp = async () => {
    // 어차피 소켓을 통해 변동사항이 전달된다면 레벨업처리가 필요한가?
    try {
      const response = await axios.post('/api/level-up'); // 백엔드 엔드포인트를 적절하게 수정
      if (response.status === 200) {
        // 레벨업 성공한 경우 경험치 게이지를 초기화하거나 다른 조치를 취할 수 있음
      }
    } catch (error) {
      console.error('Failed to level up:', error);
    }
  };

  return (
    <div className="w-[400px] h-[173.58px] flex bg-[url(./assets/interface/profile_interface.png)] bg-cover">
      <div className="min-w-[174px] h-full flex justify-center items-center">
        <ProfileImage
          alt="player_profile"
          imgCode={getStatusAtom.imgCode}
          size={160}
        />
      </div>
      <div className="w-full h-full flex flex-col">
        <div className="w-full">
          <Gauge
            value={getStatusAtom.hp ?? 100}
            total={getHealthStat(getStatusAtom.statList) * GROW_FACTOR}
            type="hp"
          />
          <div style={{ marginTop: '-15px' }}>
            <Gauge
              value={getStatusAtom.exp ?? 0}
              total={10}
              type="exp"
              onLevelUp={handleLevelUp}
            />
          </div>
        </div>
        <div className="w-full my-auto text-left px-6">
          <p>{getStatusAtom.nickname}</p>
          <p>
            {getStatusAtom.race} / {getStatusAtom.job}
          </p>
          <p>Lv.{getStatusAtom.level ?? 1}</p>
        </div>
      </div>
    </div>
  );
};

const GROW_FACTOR = 10;

// 건강 스텟 가져와서 MaxHP 계산
const getHealthStat = (
  statList: Array<{ statName: string; statValue: number; statCode: string }>
) => {
  return (
    statList.find((element) => element.statName === '건강')?.statValue ?? 0
  );
};

export default ProfileInterface;
