import Input from '@/atoms/Input';
import Prompt from '@/atoms/Prompt';
import { useEffect, useState } from 'react';
import ChoiceGroup from './ChoiceGroup';
import LoadingSpinner1 from '@/atoms/LoadingSpinner1';
import { IActsType, IPromptInterface } from '@/types/components/Prompt.types';
import { usePromptAtom } from '@/jotai/PromptAtom';

const PromptInterface = (props: IPromptInterface) => {
  const [text, setText] = useState('');
  const [isFetching, setIsFetching] = useState(true);
  const prompt = usePromptAtom();

  const sendEvent = (e: IActsType) => {
    if (props.sendEventHandler) props.sendEventHandler(e);
  };

  const sendPrompt = () => {
    if (props.sendPromptHandler) props.sendPromptHandler(text);
    setText('');
  };

  useEffect(() => {
    if (prompt) setIsFetching(false);
  }, [prompt]);

  return (
    <div className="relative max-w-[1110px] min-w-[500px] h-[657px] mx-auto border-primary border-4">
      <div className="absolute w-full inset-0 bg-[url(./assets/interface/PromptInterface.png)] bg-no-repeat bg-auto pointer-events-none z-10"></div>
      {isFetching ? (
        <div className="max-w-[1100px] min-w-[500px] h-[330px] mx-auto flex items-center justify-center relative bg-transparent">
          <LoadingSpinner1 />
        </div>
      ) : (
        <Prompt
          playerCode={props.playerCode}
          isFetching={props.isFetching}
          setNowPrompt={props.setNowPrompt}
          type="in-game"
          data={prompt}
          now={props.nowPrompt}
        />
      )}
      <div className="w-full h-[250px] flex justify-center self-center">
        {!props.blockChoice && <ChoiceGroup
          data={props.event && props.event.acts}
          gameType={props.gameType}
          onClickEvent={sendEvent}
        />}
      </div>
      <div className="absolute inset-x-0 bottom-0">
        <Input
          disabled={props.block}
          width="full"
          height="45px"
          placeholder="프롬프트를 입력해주세요."
          value={text}
          setValue={(e: string) => setText(e)}
          onClickEvent={() => sendPrompt()}
        />
      </div>
    </div>
  );
};

export default PromptInterface;
