import SockJS from 'sockjs-client';
import { CompatClient, Stomp } from '@stomp/stompjs';
import React, { useState, useRef, useEffect } from 'react';
import Logo from '@/assets/logo/logo.png';
import SideInterface from '@/organisms/SideInterface';
import PromptInterface from '@/organisms/PromptInterface';
import TextButton from '@/atoms/TextButton';
import ProfileInterface from '@/organisms/ProfileInterface';
import { useIndexedDB } from 'react-indexed-db-hook';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import usePrompt from '@/hooks/usePrompt';
import { usePromptAtom } from '@/jotai/PromptAtom';
import {
  IEventType,
  IActsType,
  IGetPromptType,
  ISubtaskType,
} from '@/types/components/Prompt.types';
import DiceModal from '@/organisms/DiceModal';
import { IDice } from '@/types/components/Dice.types';
import { useAtom } from 'jotai';
import {
  characterStatusAtom,
  useUpdateItemListAtom,
} from '@/jotai/CharacterStatAtom';
import axios from 'axios';

const MemoizedDiceModal = React.memo<{
  dice: IDice;
  setIsShowDice: (flag: boolean) => void;
}>(({ dice, setIsShowDice }) => {
  return (
    <DiceModal
      dice1={dice.dice1}
      dice2={dice.dice2}
      dice3={dice.dice3}
      onClose={() => setIsShowDice(false)}
    />
  );
});

const MultiPlayPage = () => {
  const [chat, setChat] = useState<string[] | null>(null);
  const [event, setEvent] = useState<IEventType | null>(null);
  const [blockInput, setBlockInput] = useState<boolean>(false);
  const [isPromptFetching, setIsPromptFetching] = useState<boolean>(false);
  const [isShowDice, setIsShowDice] = useState<boolean>(false);
  const [dice, setDice] = useState<IDice>({
    dice1: 0,
    dice2: 0,
    dice3: 0,
  });
  const client = useRef<CompatClient | null>(null);
  const [_getPrompt, setPrompt] = usePrompt();
  const promptAtom = usePromptAtom();
  const itemUpdateAtom = useUpdateItemListAtom();
  const [status, _setStatus] = useAtom(characterStatusAtom);
  const gameCode = 'rUUGH0';
  const playerCode = 'rUUGH0-WiY7oG';
  const db = useIndexedDB('prompt');
  const navigate = useNavigate();

  const endingEvent = (text: string) => {
    Swal.fire({
      title: '죽음',
      text: `${text}`,
      width: 600,
      padding: '2rem',
      color: '#FBCB73',
      background: '#240903',
      confirmButtonText: '확인',
      confirmButtonColor: '#F0B279',
      allowEnterKey: true,
      customClass: {
        container: 'font-hol',
        popup: 'rounded-lg',
        title: 'text-48 mb-8',
        htmlContainer: 'text-36',
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        disConnected();
        navigate('/ending');
      }
    });
  };

  useEffect(() => {
    if (event) {
      console.log(event);
      setBlockInput(true);
      if (event.eventName == '죽음') {
        console.log('Game Over ==== Y');
        console.log(promptAtom);
        let str = ``;
        promptAtom[promptAtom.length - 1].forEach(
          (e) => (str += `${e.msg + '\n'}`)
        );
        endingEvent(str);
        return;
      }
    } else setBlockInput(false);
  }, [event]);

  // 웹소캣 객체 생성
  const connectHandler = () => {
    const sock = new SockJS(import.meta.env.VITE_SOCKET_URL);
    client.current = Stomp.over(() => sock);

    // 웹 소켓 연결 정보 콘솔에 안뜨게 하기 >> 코드 프리징 시 주석 풀기
    // client.current.debug = () => null;

    client.current.connect({}, () => {
      if (client.current == null) {
        console.log('Error');
        return;
      }

      client.current.onStompError = function (frame) {
        console.log('Broker reported error: ' + frame.headers['message']);
        console.log('Additional details: ' + frame.body);
      };

      // 주사위 데이터 송수신용
      client.current.subscribe(
        `/topic/dice/${gameCode}`,
        (message) => {
          const body = JSON.parse(message.body);

          if (body.dice1 && !isShowDice) {
            console.log(body);
            setDice(body);
            setIsShowDice(true);
          }
        },
        {}
      );

      // 선택지 데이터 정보 송신용
      client.current.subscribe(
        `/topic/select/${gameCode}`,
        async (message) => {
          const body = JSON.parse(message.body);

          console.log(body);

          if (body.prompt !== undefined) {
            // 원본 데이터와 프롬프트 구분
            const prompt = body.prompt.split('\n').map((e: string) => {
              return { msg: e, role: 'assistant' };
            });

            setPrompt(prompt);
            setIsPromptFetching(false);
          }

          if (body.gameOverYn === 'Y') {
            console.log('Game Over ==== Y');
            endingEvent(body.prompt);
            return;
          }

          if (body.itemYn === 'Y') {
            // Item 획득 로직
            // 얻는다 버린다 두가지 선택지로 setEvent 해주기
            setEvent({
              acts: [
                {
                  actCode: `getItem_1_${body.itemCode}`,
                  actName: '얻는다.',
                  subtask: 'NONE',
                },
                {
                  actCode: `getItem_2_${body.itemCode}`,
                  actName: '버린다.',
                  subtask: 'NONE',
                },
              ],
            });

            console.log('Item 획득');
            const ChoiceFromDB = (await db.getAll())
              .filter((v) => v.choice !== undefined)
              .map((e) => e);

            // 직전 선택지 인덱스 디비에 저장
            if (ChoiceFromDB.length === 0) {
              await db.add({ choice: body });
            } else if (ChoiceFromDB.length <= 1) {
              await db.update({ choice: body, id: ChoiceFromDB[0].id });
            } else {
              for (let i = 0; i < ChoiceFromDB.length - 1; i++) {
                await db.deleteRecord(ChoiceFromDB[i].id);
              }
            }

            return;
          }

          const ChoiceFromDB = (await db.getAll())
            .filter((v) => v.choice !== undefined)
            .map((e) => e);

          // 직전 선택지 인덱스 디비에 저장
          if (ChoiceFromDB.length > 0) {
            for (let i = 0; i < ChoiceFromDB.length; i++) {
              await db.deleteRecord(ChoiceFromDB[i].id);
            }
          }
          setEvent(null);
        },
        {}
      );

      // 하위 선택지 조회 데이터 송수신용
      client.current.subscribe(
        `/topic/subtask/${gameCode}`,
        (message) => {
          // 하위 선택지 요청에 대한 데이터가 들어온다면
          // 선택지에다가 하위 선택지로 업데이트를 해줘야한다.
          const body = JSON.parse(message.body);

          const newActs: IActsType[] = body.map((e: ISubtaskType) => {
            return {
              actCode: e.code,
              actName: e.name,
              subtask: `isSubTask_${e.code.split('-')[0]}`,
            };
          });

          // event 상태를 업데이트
          // acts 부분만 body로 변경
          setEvent((prevEvent) => {
            if (prevEvent !== null) {
              return { ...prevEvent, acts: newActs };
            } else return null;
          });
        },
        {}
      );

      // 전투 이벤트 업데이트 시 정보 송수신용
      client.current.subscribe(
        `/topic/fight/${gameCode}`,
        async (message) => {
          const body = JSON.parse(message.body);

          console.log(body);

          if (body.prompt !== undefined) {
            // 원본 데이터와 프롬프트 구분
            const prompt = body.prompt.split('\n').map((e: string) => {
              return { msg: e, role: 'assistant' };
            });

            setPrompt(prompt);
            setIsPromptFetching(false);
          }

          const ChoiceFromDB = (await db.getAll())
            .filter((v) => v.choice !== undefined)
            .map((e) => e);

          // 직전 선택지 인덱스 디비에 저장
          if (ChoiceFromDB.length === 0) {
            await db.add({ choice: body });
          } else if (ChoiceFromDB.length <= 1) {
            await db.update({ choice: body, id: ChoiceFromDB[0].id });
          } else {
            for (let i = 0; i < ChoiceFromDB.length - 1; i++) {
              await db.deleteRecord(ChoiceFromDB[i].id);
            }
          }

          // 사망 여부 판별
          if (body.playerHp <= 0) {
            setEvent(null);
            endingEvent(body.prompt);
            return;
          }

          if (body.endYn === 'Y') {
            setEvent(null);
          }
        },
        {}
      );

      // 프롬프트 데이터 송수신용
      client.current.subscribe(
        `/topic/prompt/${gameCode}`,
        async (message) => {
          const body = JSON.parse(message.body);

          console.log(body);

          if (body.content !== undefined && body.role !== playerCode) {
            const prompt = body.content.split('\n').map((e: string) => {
              return { msg: e, role: body.role };
            });

            setPrompt(prompt);
            setIsPromptFetching(false);
          }

          // Event가 있다면
          if (body.event !== null && body.event !== undefined) {
            if (body.event.eventName == '죽음') {
              console.log('Game Over ==== Y');
              console.log(promptAtom);
              let str = ``;
              promptAtom[promptAtom.length - 1].forEach(
                (e) => (str += `${e.msg + '\n'}`)
              );
              endingEvent(str);

              return;
            }

            setEvent(body.event);

            const ChoiceFromDB = (await db.getAll())
              .filter((v) => v.choice !== undefined)
              .map((e) => e);

            // 직전 선택지 인덱스 디비에 저장
            if (ChoiceFromDB.length === 0) {
              await db.add({ choice: body });
            } else if (ChoiceFromDB.length <= 1) {
              await db.update({ choice: body, id: ChoiceFromDB[0].id });
            } else {
              for (let i = 0; i < ChoiceFromDB.length - 1; i++) {
                await db.deleteRecord(ChoiceFromDB[i].id);
              }
            }
          } else {
            setEvent(null);
            const ChoiceFromDB = (await db.getAll())
              .filter((v) => v.choice !== undefined)
              .map((e) => e);

            // 직전 선택지 인덱스 디비에 저장
            if (ChoiceFromDB.length > 0) {
              for (let i = 0; i < ChoiceFromDB.length; i++) {
                await db.deleteRecord(ChoiceFromDB[i].id);
              }
            }
          }
        },
        {}
      );

      client.current.subscribe(`/queue/${playerCode}/item`, async (message) => {
        const body = JSON.parse(message.body);
        console.log(body);
        itemUpdateAtom(body);
        setEvent(null);
        const ChoiceFromDB = (await db.getAll())
          .filter((v) => v.choice !== undefined)
          .map((e) => e);

        // 직전 선택지 인덱스 디비에 저장
        if (ChoiceFromDB.length > 0) {
          for (let i = 0; i < ChoiceFromDB.length; i++) {
            await db.deleteRecord(ChoiceFromDB[i].id);
          }
        }
      });

      // 채팅 구독
      client.current.subscribe(
        `/topic/chat/${gameCode}`,
        async (message) => {
          // 기존 대화 내역에 새로운 메시지 추가
          setChat((prevChat) => {
            return prevChat ? [...prevChat, message.body] : [message.body];
          });
        },
        {}
      );
    });
  };

  const disConnected = () => {
    if (client.current !== null) {
      try {
        client.current.debug = () => null;
        client.current.disconnect(() => {
          if (client.current) {
            client.current.unsubscribe('sub-0');
            client.current.unsubscribe('sub-1');
            client.current.unsubscribe('sub-2');
            client.current.unsubscribe('sub-3');
            client.current.unsubscribe('sub-4');
            client.current.unsubscribe('sub-5');
            client.current.unsubscribe('sub-6');
          }
        });
      } catch (err) {
        console.log('disconneted Failed');
      }
      client.current = null;
    } else console.log('Already Disconnected!!!');
  };

  const getDicesHandler = () => {
    if (client.current) {
      client.current.send(
        `/dice/${gameCode}`,
        {},
        JSON.stringify({
          playerCode,
        })
      );
    }
  };

  const sendPromptHandler = (text: string) => {
    // 사용자가 입력한 프롬프트 송신 메서드
    if (client.current) {
      client.current.send(
        `/prompt/${gameCode}`,
        {},
        JSON.stringify({
          playerCode,
          prompt: text,
        })
      );
      setIsPromptFetching(true);
      setPrompt([{ msg: text, role: playerCode }]);
    }
  };

  const getSubtaskHandler = (eventCode: string, subtask: string) => {
    if (client.current) {
      client.current.send(
        `/subtask/${gameCode}`,
        {},
        JSON.stringify({
          playerCode,
          eventCode,
          subtask,
        })
      );
    }
  };

  const sendEventHandler = async (choice: IActsType) => {
    // 주사위 돌리고 난 후
    // 선택지 선택 요청
    console.log(choice);
    console.log(promptAtom);
    // 사용자가 선택한 선택지 송신 메서드
    if (client.current) {
      // 직전 응답 Body 기록 가져오기
      const body: IGetPromptType = (await db.getAll())
        .filter((v) => v.choice !== undefined)
        .map((e) => e.choice)[0];

      const checkSub = choice.subtask.split('_');
      // SubTask를 선택했다면
      if (checkSub.length > 1 && checkSub[0] === 'isSubTask') {
        // 현재 subtask는 전투 이벤트에만 존재
        // 전투 이벤트 send
        // 주사위 값 받아와서 모달 보여주기
        getDicesHandler();
        setTimeout(() => {
          if (client.current) {
            client.current.send(
              `/fight/${gameCode}`,
              {},
              JSON.stringify({
                playerCode,
                actCode: choice.actCode,
                subtask: checkSub[1],
                fightingEnermyCode: body.monster ? body.monster.code : null,
              })
            );
          }
        }, 1000);
        setIsPromptFetching(true);
        setPrompt([
          { msg: `[${choice.actName}]을 선택하겠습니다.`, role: playerCode },
        ]);
        // 이벤트 핸들러 종료
        return;
      }

      // subtask가 있다면
      if (choice.subtask !== 'NONE') {
        console.log(event);
        // 아이템 subtask인데 현재 가진 아이템 개수가 0이라면 에러 출력
        if (choice.subtask === 'ITEM' && status.itemList.length === 0) {
          Swal.fire({
            title: '경고문',
            text: '가지고 계신 아이템이 없습니다! 다른 선택지를!',
            width: 600,
            padding: '2.5rem',
            color: '#FBCB73',
            background: '#240903',
            confirmButtonText: '확인',
            confirmButtonColor: '#F0B279',
            customClass: {
              container: 'font-hol',
              popup: 'rounded-lg',
              title: 'text-48 mb-8',
            },
          });
          return;
        }

        // event 상태가 있다면 실행 없다면? 안됨
        if (event?.eventCode)
          getSubtaskHandler(event.eventCode, choice.subtask);

        return;
      }

      if (event && event.eventName == '전투') {
        getDicesHandler();
        setTimeout(() => {
          if (client.current) {
            client.current.send(
              `/fight/${gameCode}`,
              {},
              JSON.stringify({
                playerCode,
                actCode: choice.actCode,
                subtask: choice.subtask,
                fightingEnermyCode: body.monster ? body.monster.code : null,
              })
            );
          }
        }, 1000);

        setIsPromptFetching(true);
        setPrompt([
          { msg: `[${choice.actName}]을 선택하겠습니다.`, role: playerCode },
        ]);
        return;
      }

      const checkItemSub = choice.actCode.split('_');
      if (checkItemSub[0] === 'getItem') {
        // 획득 전송
        if (checkItemSub[1] === '1') {
          client.current.send(
            `/item`,
            {},
            JSON.stringify({
              playerCode,
              gameCode,
            })
          );
        }
        return;
      }

      // 위에서 return에 안걸렸다면 일반 선택지 선택한 경우
      // select 채널에 send 해주기
      getDicesHandler();
      setTimeout(() => {
        if (client.current)
          client.current.send(
            `/select/${gameCode}`,
            {},
            JSON.stringify({
              actCode: choice.actCode,
              playerCode,
            })
          );
      }, 1000);
      setIsPromptFetching(true);
      setPrompt([
        { msg: `[${choice.actName}]을 선택하겠습니다.`, role: playerCode },
      ]);
    }
  };

  const sendChatHandler = (text: string) => {
    if (client.current)
      client.current.send(
        `/chat/${gameCode}`,
        {},
        JSON.stringify({
          playerCode,
          message: text,
        })
      );
  };

  const sendEventStat = (statCode: string) => {
    if (client.current) {
      client.current.send(`/stat-up/${gameCode}/${playerCode}/${statCode}`, {});
    }
  };

  const leaveGame = () => {
    Swal.fire({
      title: '경고문',
      text: '이 게임 정보가 삭제됩니다람쥐!',
      width: 600,
      padding: '2rem',
      color: '#FBCB73',
      background: '#240903',
      showDenyButton: true,
      confirmButtonText: '머무르기',
      confirmButtonColor: '#F0B279',
      denyButtonText: '나가기',
      denyButtonColor: '#C9C9C9',
      customClass: {
        container: 'font-hol',
        popup: 'rounded-lg',
        title: 'text-48 mb-8',
        htmlContainer: 'text-36',
      },
    }).then((result) => {
      if (result.isDenied) {
        disConnected();
        navigate('/ending');
      }
    });
  };

  const deleteItem = (itemCode: string) => {
    if (client.current) {
      client.current.send(
        `/item/${itemCode}`,
        {},
        JSON.stringify({
          playerCode,
          gameCode,
        })
      );
    }
  };

  useEffect(() => {
    const initializeGame = async () => {
      try {
        const res = await axios.get(
          `${
            import.meta.env.VITE_SERVER_URL
          }/prompt?gameCode=${gameCode}&playerCode=${playerCode}`
        );

        res.data.forEach((e: { role: string; content: string }) => {
          const arr = e.content.split('\n').map((v) => {
            return { msg: v, role: e.role };
          });
          setPrompt(arr);
        });
      } catch (error) {
        console.error(error);
      }
    };

    if (client.current === null) {
      connectHandler();
      const itemList = localStorage.getItem('characterStatus');

      if (itemList) {
        itemUpdateAtom(JSON.parse(itemList).itemList);
      }
      console.log(promptAtom);
      if (promptAtom.length <= 1) {
        db.getAll().then((value) => {
          if (value.length === 0) initializeGame();
        });
      }
    }

    const initializeEvent = async () => {
      const ChoiceFromDB = (await db.getAll())
        .filter((v) => v.choice !== undefined)
        .map((e) => e);

      // 직전 선택지 인덱스 디비에 저장
      if (ChoiceFromDB.length > 0) {
        setEvent(ChoiceFromDB[0].choice.event);
        console.log(ChoiceFromDB[0].choice);
      }
    };

    initializeEvent();

    return () => {
      disConnected();
    };
  }, []);

  return (
    <div className="w-screen h-screen flex font-hol bg-backgroundDeep text-primary max-h-[750px] my-auto">
      <div className="w-400 h-full flex flex-col justify-between items-start">
        <img src={Logo} alt="로고" className="w-[300px]" />
        <div className="w-full h-[400px] flex justify-center">
          <SideInterface
            sendChat={sendChatHandler}
            chat={chat}
            deleteItem={deleteItem}
            sendEventStat={sendEventStat}
          />
        </div>
        <ProfileInterface />
      </div>
      <div className="basis-3/4 h-full mr-2">
        <div className="w-full flex justify-end py-1 pr-10">
          <TextButton text="게임 나가기" onClickEvent={() => leaveGame()} />
        </div>
        <PromptInterface
          event={event}
          isFetching={isPromptFetching}
          gameType="single"
          block={blockInput}
          nowPrompt=""
          playerCode={playerCode}
          sendEventHandler={sendEventHandler}
          sendPromptHandler={sendPromptHandler}
        />
      </div>
      {isShowDice && (
        <MemoizedDiceModal dice={dice} setIsShowDice={setIsShowDice} />
      )}
    </div>
  );
};

export default MultiPlayPage;
