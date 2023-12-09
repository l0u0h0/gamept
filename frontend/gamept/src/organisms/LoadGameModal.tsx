/**
 * 게임 이어하기 모달
 * 로직은 미구현
 * @params props
 * @returns
 */
import SelectButton from '@/atoms/SelectButton';

const LoadGameModal = () => {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[590px] h-[470px] py-20 bg-backgroundDeep/80 border-primary text-black border-[3px] rounded-[10px] font-hol">
      <div className="text-primary text-[36px] mb-10">게임 이어하기</div>
      <div className="text-primary text-28 mb-10">
        이전에 했던 플레이의 기록이 있습니다.
        <br />
        이어하시겠습니까?
      </div>
      <div className="flex flex-row gap-[75px] justify-center">
        <SelectButton
          height="72px"
          onClickEvent={() => {}}
          text="이어하기"
          width="175px"
          isShadow
        />
        <SelectButton
          height="72px"
          onClickEvent={() => {}}
          text="새로하기"
          width="175px"
          isShadow
        />
      </div>
    </div>
  );
};

export default LoadGameModal;
