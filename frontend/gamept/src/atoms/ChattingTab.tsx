import { useState, useRef, useEffect } from 'react';
import Input from './Input';
import { IChattingTab } from '@/types/components/SideInterface.types';

const ChattingTab = (props: IChattingTab) => {
  const [text, setText] = useState('');
  const lastMessageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // props.chat가 업데이트될 때마다 가장 마지막 메시지에 포커스를 줍니다.
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [props.chat]);


  const sendChatting = () => {
    if (props.sendChat) props.sendChat(text);
    setText('');
  };

  return (
    <div className="w-full h-full flex flex-col p-2 bg-transparent text-28 justify-between">
      <div className="overflow-y-scroll w-full h-[328px]">
        {props.chat &&
          props.chat.map((e, i) => (
            <div key={`chat_row_${i}`} className="flex mx-2 text-16"
            ref={props.chat && i === props.chat.length - 1 ? lastMessageRef : null}>
              <p>{e}</p>
            </div>
          ))}
      </div>
      <div>
        <Input
          width="334px"
          height="auto"
          placeholder="채팅을 입력해주세요."
          value={text}
          setValue={(e: string) => setText(e)}
          onClickEvent={() => sendChatting()}
        />
      </div>
    </div>
  );
};

export default ChattingTab;
