/**
 * 엔딩 페이지
 * 배경 이미지 작업은 백과 협의가 필요
 * prompt 높이를 endingpage에 맞게 확대
 * @params props
 * @returns
 */

import Prompt from '@/atoms/Prompt';
import Logo from '@/atoms/Logo';
import SelectButton from '@/atoms/SelectButton';
import { useNavigate } from 'react-router-dom';
import { useIndexedDB } from 'react-indexed-db-hook';
import { useEffect, useRef, useState } from 'react';
import { CompatClient, Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useGameCode } from '@/hooks/useGameCode';
import { usePlayerCode } from '@/hooks/usePlayerCode';
import { IPromptHistory } from '@/types/components/Prompt.types';

const EndingPage = () => {
  const db = useIndexedDB('prompt');
  const client = useRef<CompatClient | null>(null);
  const navigate = useNavigate();
  const [gameCode] = useGameCode();
  const [playerCode] = usePlayerCode();
  const [promptData, setPromptData] = useState<IPromptHistory[][] | null>(null);
  const [isFetching, setIsFetching] = useState<boolean>(true);

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

      client.current.subscribe(`/topic/ending/${gameCode}`, async (message) => {
        const body = JSON.parse(message.body);

        if (body.content !== undefined && body.role !== undefined) {
          const prompt = body.content.split('\n').map((e: string) => {
            return { msg: e, role: body.role };
          });

          setPromptData([prompt]);
          setIsFetching(false);
        }
      });

      client.current.send(
        `/ending/${gameCode}`,
        {},
        JSON.stringify({
          playerCode,
        })
      );
    });
  };

  const handleFinishGame = () => {
    localStorage.removeItem('gameCode');
    localStorage.removeItem('playerCode');
    localStorage.removeItem('characterStatus');
    db.clear();
    navigate('/');
  };

  useEffect(() => {
    if (client.current === null && gameCode !== '' && playerCode !== '') {
      connectHandler();
    }
  }, [gameCode, playerCode]);

  return (
    <div className="font-hol relative w-screen h-screen mx-auto bg-backgroundDeep">
      <div className="text-primary flex flex-col items-center w-full h-full gap-10 pt-10">
        <Logo className="relative mx-auto" />
        <Prompt data={promptData} type="ending" isFetching={isFetching} now='' />
        <SelectButton
          height="70px"
          onClickEvent={handleFinishGame}
          text="메인으로"
          width="305px"
          isShadow
        />
      </div>
    </div>
  );
};

export default EndingPage;
