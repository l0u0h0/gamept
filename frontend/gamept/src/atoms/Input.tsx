import { IInput } from '@/types/components/Input.types';
import inputButton from '@/assets/InputButton.svg';

/**
 * @param props
 * {
 * width, height => 너비와 높이
 * placeholder => 플레이스홀더
 * setValue => 인풋에 입력된 텍스트 값 부모 컴포넌트에 세팅할 메서드
 * onClickEvent => 버튼 클릭 시 호출될 메서드
 * }
 */
const Input = (props: IInput) => {
  const inputStyle = {
    width: props.width,
    height: props.height,
  };

  const onClickEvent = () => {
    props.onClickEvent();
    props.setValue('');
  };

  const onEnterkey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') props.onClickEvent();
  };

  return (
    <div
      className="min-w-400 min-h-[40px] mx-auto relative flex justify-end items-center"
      style={inputStyle}
    >
      <input
        disabled={props.disabled}
        value={props.value}
        placeholder={
          props.disabled ? `입력하실 수 없습니다.` : props.placeholder
        }
        className="w-full h-full mx-2 px-2 pr-7 bg-backgroud border-primary border-2 rounded-sm font-hol text-white text-18"
        onChange={(e) => props.setValue(e.target.value)}
        onKeyDown={onEnterkey}
      />
      {!props.disabled && (
        <img
          className="absolute w-auto h-1/2 mr-5 hover:scale-110 duration-normal"
          src={inputButton}
          alt="Input_Button"
          onClick={onClickEvent}
        />
      )}
    </div>
  );
};

export default Input;
