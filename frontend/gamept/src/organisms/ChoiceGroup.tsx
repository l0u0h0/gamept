import IngameButton from '@/atoms/IngameButton';
import { IActsType, IChoiceGroup } from '@/types/components/Prompt.types';

const ChoiceGroup = (props: IChoiceGroup) => {
  const sendEvent = (e: IActsType) => {
    if (props.onClickEvent) props.onClickEvent(e);
  }

  return (
    <div className="w-3/4 h-3/4 flex py-4 flex-wrap gap-3 my-auto justify-center overflow-y-scroll items-center text-black">
      {props.data && props.data.map((e, i) => (
        <IngameButton
          key={`${i}_choice_button`}
          width="49%"
          height="fit-content"
          type={props.gameType}
          text={e.actName}
          onClickEvent={() => sendEvent(e)}
        />
      ))}
    </div>
  );
};

export default ChoiceGroup;
