/**
 * CommingSoonModal 구현
 * 게임 생성 및 join 시 atom 값 변경 후 스토리 단계로 변경
 * @param
 * onClose: () => void;
 * onGoSelectStory: () => void;
 * @returns
 */

import SelectButton from '@/atoms/SelectButton';
import { ICommingSoonModal } from '@/types/components/CommingSoonModal.types';
// import Input from '@/atoms/Input';
import { useRef, useEffect } from 'react';
// import { useAtom } from 'jotai';
// import { gameModeAtom } from '@/jotai/MakeGameAtom';

const CommingSoonModal = (props: ICommingSoonModal) => {
  const modalRef = useRef<HTMLDivElement>(null);
  // const [, setSelectMode] = useAtom(gameModeAtom);
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
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-hol w-[590px] border-[3px] border-primary h-[470px] rounded-[10px] bg-backgroundDeep/80"
      >
        <div className="flex flex-col items-center gap-10 caret-transparent justify-center h-full">
          <div className=" text-primary text-28 mb-10 ">
            추후 업데이트 예정입니다.
          </div>
          <SelectButton
            height="72px"
            onClickEvent={props.onClose}
            text="돌아가기"
            width="420px"
          />
        </div>
      </div>
    </div>
  );
};

export default CommingSoonModal;
