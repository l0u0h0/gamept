import { useEffect, useState } from 'react';
// import { useEffect, useRef, useState } from 'react';
// import SockJS from 'sockjs-client';
import './SideInterface.css'; // Import your CSS file
import {
  StatValuesType,
  SkillValuesType,
  TabContent,
  StatObjectType,
} from '@/types/components/Tab.types';
// import { CompatClient, Stomp } from '@stomp/stompjs';
// import { CompatClient } from '@stomp/stompjs';

// import { useGameCode } from '@/hooks/useGameCode';
// import { usePlayerCode } from '@/hooks/usePlayerCode';
import ChattingTab from '@/atoms/ChattingTab';
import { ISideInterface } from '@/types/components/SideInterface.types';
import { TbNavigation } from 'react-icons/tb';
import { GiCardDiscard } from 'react-icons/gi';
import {
  useDeleteItemAtom,
  useItemListAtom,
  useStatAtom,
  useStatObjectAtom,
} from '@/jotai/CharacterStatAtom';
// import { useDeleteItemAtom, useItemListAtom, useStatAtom, useStatObjectAtom, useStatUpAtom } from '@/jotai/CharacterStatAtom';
// import { useUpdateStatAtom } from '@/jotai/CharacterStatAtom';
import { useAtomValue } from 'jotai';
import { characterStatusAtom } from '@/jotai/CharacterStatAtom';
// import { fetchGetPlayerInfo } from '@/services/CreateCharacterService';

// import { useStatAtom, useUpdateProfileAtom } from '@/jotai/CharacterStatAtom';

// const setProfileStat = useUpdateProfileAtom();
// const getStat = useStatAtom();

//////////////////////////////////////////////////////////////////////////
/* 빌드 에러 방지용 임시 주석
const fetchInitialStats = async () => {
  try {
    const response = await axios.get('/api/initial-stats'); // API 엔드포인트를 백엔드에 맞게 수정
    return response.data;
  } catch (error) {
    console.error('Failed to fetch initial stats:', error);
    return {}; // API 요청 실패 시 빈 객체 반환
  }
};
*/
/////////////////////////////////////////////////////////////////////////

type Props = {
  sendEventStat: (statCode: string) => void;
};

// const StatTab = () => {
const StatTab: React.FC<Props> = ({ sendEventStat }) => {
  // 현재 스탯 정보 불러오기
  const statList: StatValuesType[] = useStatAtom();
  const statObject: StatObjectType = useStatObjectAtom();
  // 스탯 업데이트 함수 불러오기
  // const setStatList = useUpdateStatAtom();
  // const [statPoints, setStatPoints] = useState(3);

  // 스탯 증가 함수
  // const increaseStat = (statCode: string) => {
  //   if (statPoints > 0) {
  //     // 새로운 상태 배열을 생성
  //     const newStats = statList.map(stat => {
  //       if (stat.statCode === statCode) {
  //         return { ...stat, statValue: stat.statValue + 1 };
  //       }
  //       return stat;
  //     });

  //     // setStatList에 새로운 배열을 직접 전달
  //     setStatList(newStats);
  //     setStatPoints(statPoints - 1);
  //   }
  // };

  return (
    <div className="w-full h-full flex flex-col p-8 py-10 bg-transparent text-xl justify-between">
      {statList.map((stat, i) => (
        <div key={`stat_${i}`} className="w-full flex">
          <p className="basis-1/4 text-center">{stat.statName}</p>
          <p className="basis-3/4 text-center">{stat.statValue}</p>
          {statObject.statPoint > 0 && (
            <button
              onClick={() => sendEventStat(stat.statCode)}
              className="bg-transparent px-0 py-0"
            >
              <TbNavigation />
            </button>
          )}
        </div>
      ))}
      <div className="text-base flex items-center justify-center">
        <p>스탯 포인트 :&nbsp;</p>
        <div className="border-2 shadow-md border-primary px-2">
          {statObject.statPoint}
        </div>
      </div>
    </div>
  );
};

const SkillTab = () => {
  const characterStatus = useAtomValue(characterStatusAtom);
  const skillList: SkillValuesType[] = characterStatus.skillList; // 타입 명시 추가

  useEffect(() => {
    // 서버에서 스킬 목록을 가져오는 함수
    // (생략 - 현재는 characterStatusAtom에서 이미 받아오고 있기 때문에 필요 없음)
  }, []);
  const api = import.meta.env.VITE_SERVER_URL.split('api')[0];
  const skillSrc = api + 'skill/';
  return (
    <div className="w-full h-full flex flex-col p-6 bg-transparent text-16 overflow-y-auto">
      {skillList.map((skill, i) => (
        <div key={`skill_${i}`} className="w-full flex my-2 items-center">
          <div className="border border-[#5C5C5C] rounded">
            <img
              className="w-[64px] rounded"
              src={`${skillSrc}${skill.img || `${skill.name}.png`}`}
              alt={`${i}_skill`}
            />
          </div>
          <p className="basis-3/4 text-left pl-4 text-white">
            {skill.name}: {skill.desc}
          </p>
        </div>
      ))}
    </div>
  );
};
const ItemTab = (props: { deleteItem: (itemCode: string) => void }) => {
  const itemListAtom = useItemListAtom();
  const deleteItemAtom = useDeleteItemAtom();
  const initList: {
    [key: string]: { img: string; desc: string; code: string };
  } = {};

  itemListAtom.forEach((e) => {
    initList[e.name] = {
      img: `${e.name}.png`,
      desc: e.desc,
      code: e.code,
    };
  });

  const [itemList, setItemList] = useState<{
    [key: string]: { code: string; img: string; desc: string };
  }>(initList);

  const [hoveredItem, setHoveredItem] = useState('');

  const handleMouseEnter = (itemName: string) => {
    setHoveredItem(itemName);
  };

  const handleMouseLeave = () => {
    setHoveredItem('');
  };

  const handleItemDelete = (itemName: string) => {
    const updatedItemList = { ...itemList };
    const code = itemList[itemName].code;
    delete updatedItemList[itemName];
    props.deleteItem(code);
    deleteItemAtom(code);
    setItemList(updatedItemList);
  };

  useEffect(() => {
    itemListAtom.forEach((e) => {
      initList[e.name] = {
        img: `${e.name}.png`,
        desc: e.desc,
        code: e.code,
      };
    });
    setItemList(initList);
  }, [itemListAtom]);

  return (
    <div className="w-full h-full flex flex-col p-6 bg-transparent text-16">
      {Object.keys(itemList).map((e, i) => (
        <div
          key={`item_${i}`}
          className="w-full flex my-2 items-center"
          onMouseEnter={() => handleMouseEnter(e)}
          onMouseLeave={handleMouseLeave}
        >
          <div className="border border-[#4F3F2B] rounded">
            <img
              className="w-[64px] rounded"
              src={`./src/assets/items/${itemList[e].img}`}
              alt={`${i}item`}
            />
          </div>
          <div className="basis-3/4 text-left pl-4 text-white">
            {e}: {itemList[e].desc}
          </div>
          {hoveredItem === e && (
            <button
              className="bg-transparent px-0 py-0 ml-2"
              onClick={() => handleItemDelete(e)}
            >
              <GiCardDiscard />
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

const SideInterface = (props: ISideInterface) => {
  // const client = useRef<CompatClient | null>(null);
  const [selectedTab, setSelectedTab] = useState('스탯'); // 초기 탭 설정
  const [selectedTabColor, setSelectedTabColor] = useState('#331812'); // 초기 탭 색상 설정
  // const gameCode = 'AHczIu';
  // const playerCode = 'AHczIu-kCZX8d';
  // 컴포넌트 함수 안에서 가져오기
  // const [getGameCode] = useGameCode(); // getGameCode -> 게임코드
  // const [getPlayerCode] = usePlayerCode(); // getPlayerCode -> 플레이어코드
  // const setStatList = useStatUpAtom();

  // useEffect(() => {
  //   connectHandler();
  //   fetchGetPlayerInfo(getGameCode, getPlayerCode)
  //   .then((playerInfo) => {
  //     console.log(playerInfo);
  //     setStatList({ statPoint: playerInfo.statPoint, statList: playerInfo.statList });
  //   });
  //   // sendEventHandler();
  // }, []);

  // const connectHandler = () => {
  //   const sock = new SockJS(import.meta.env.VITE_SOCKET_URL);
  //   client.current = Stomp.over(() => sock);

  // 웹 소켓 연결 정보 콘솔에 안뜨게 하기 >> 코드 프리징 시 주석 풀기
  // client.current.debug = () => null;

  // client.current.connect({}, () => {
  //   if (client.current == null) {
  //     console.log('Error');
  //     return;
  //   }

  // 멀티플레이 용
  // 유저 데이터 업데이트 시 정보 송수신용
  // client.current.subscribe(
  //   `/queue/${getPlayerCode}/stat`,
  //   (message) => {
  //     const playerStat = JSON.parse(message.body);
  //     const statList = playerStat.statList;
  //     const statPoint = playerStat.statPoint;

  // const newStats = statList.map((stat: StatValuesType) => {
  //   // if (stat.statCode === statCode) {
  //   //   return { ...stat, statValue: stat.statValue + 1 };
  //   // }
  //   // return stat;
  //   return {
  //     statCode: stat.statCode,
  //     statName: stat.statName,
  //     statValue: stat.statValue
  //   }
  // });

  // setStatList에 새로운 배열을 직접 전달
  // setStatList({ statPoint: statPoint, statList: statList });
  //     });
  //   });
  // };

  //////////////////////////////////////////////////////////////////////////
  /* 빌드 에러 방지용 임시 주석
  const disConnected = () => {
    if (client.current !== null) {
      try {
        client.current.debug = () => null;
        client.current.disconnect(() => {
          if (client.current) {
            client.current.unsubscribe('sub-0');
            client.current.unsubscribe('sub-1');
            client.current.unsubscribe('sub-2');
          }
        });
      } catch (err) {
        console.log('disconneted Failed');
      }
      client.current = null;
    } else console.log('Already Disconnected!!!');
  };
  */
  //////////////////////////////////////////////////////////////////////////

  // const sendEventStat = (statCode: string) => {
  //   if (client.current)
  //     client.current.send(
  //       `/stat-up/${getGameCode}/${getPlayerCode}/${statCode}`,
  //       {}
  //     );
  // };

  const tabContents: Record<string, TabContent> = props.sendChat
    ? {
        스탯: {
          content: <StatTab sendEventStat={props.sendEventStat} />,
          color: '#290E08',
        },
        스킬: {
          content: <SkillTab />,
          color: '#2E130D',
        },
        아이템: {
          content: <ItemTab deleteItem={props.deleteItem} />,
          color: '#331812',
        },
        채팅: {
          content: <ChattingTab chat={props.chat} sendChat={props.sendChat} />,
          color: '#422721',
        },
      }
    : {
        스탯: {
          content: <StatTab sendEventStat={props.sendEventStat} />,
          color: '#331812',
        },
        스킬: {
          content: <SkillTab />,
          color: '#381D17',
        },
        아이템: {
          content: <ItemTab deleteItem={props.deleteItem} />,
          color: '#3D221C',
        },
      };

  const changeTab = (tabName: string) => {
    setSelectedTab(tabName);
  };

  return (
    <div className="w-[350px] text-lg">
      <div className="tab-header w-full flex">
        {Object.keys(tabContents).map((e, i) => (
          <button
            key={`tabContent_${i}`}
            // className={`custom-button ${selectedTab === e ? 'active-tab' : ''}`}
            className={`p-[1.5%] border-none outline-none rounded-none rounded-t-md focus:outline-transparent focus:outline focus:outline-2`}
            style={{
              width: `${100 / Object.keys(tabContents).length}%`,
              backgroundColor: tabContents[e].color,
            }}
            onClick={() => {
              changeTab(e);
              setSelectedTabColor(tabContents[e].color);
            }}
          >
            {e}
          </button>
        ))}
      </div>

      <div className="tab-content">
        {selectedTab in tabContents && (
          <div
            className="content-area w-[350px] h-[368px]"
            style={{ backgroundColor: selectedTabColor }}
          >
            {tabContents[selectedTab].content}
          </div>
        )}
      </div>
    </div>
  );
};

export default SideInterface;
