/**
 * MultyplayModal 구현
 * 게임 생성 및 join 시 atom 값 변경 후 스토리 단계로 변경
 * @param
 * onClose: () => void;
 * onGoSelectStory: () => void;
 * @returns
 */

import SelectButton from '@/atoms/SelectButton';
import { IMultiPlayModal } from '@/types/components/MultiPlayModal.types';
import Input from '@/atoms/Input';
import { useRef, useEffect } from 'react';
import { useAtom } from 'jotai';
import { gameModeAtom } from '@/jotai/MakeGameAtom';

const MultiplayModal = (props: IMultiPlayModal) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [, setSelectMode] = useAtom(gameModeAtom);
  const handleModalClose = (e: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      props.onClose();
    }
  };

  // 이벤트리스너 관리
  useEffect(() => {
    document.addEventListener('mousedown', handleModalClose);
    return () => {
      document.removeEventListener('mousedown', handleModalClose);
    };
  }, []);

  return (
    <div className="w-full h-full absolute bg-black/30 top-0 left-0">
      <div
        ref={modalRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-hol w-[590px] border-[3px] pt-10 border-primary h-[470px] rounded-[10px] bg-backgroundDeep/80"
      >
        <div className="flex flex-col items-center gap-10 caret-transparent ">
          <div className=" text-primary text-28 mb-10 ">멀티 플레이</div>
          <SelectButton
            height="72px"
            text="+ 멀티플레이 생성"
            width="420px"
            onClickEvent={() => {
              setSelectMode(MULTY);
              props.onGoSelectStory();
            }}
          />
        </div>
        <div>
          <div className="text-primary text-28 my-10 caret-transparent text-center">
            멀티 플레이 참여
          </div>
          <Input
            height="40px"
            onClickEvent={() => {
              setSelectMode(MULTY);
              props.onGoSelectStory();
            }}
            placeholder="참여 코드를 입력해주세요."
            value=""
            setValue={() => {}}
            width="436px"
          />
        </div>
      </div>
    </div>
  );
};

const MULTY = 1;
export default MultiplayModal;
