import { IIngameButton } from '@/types/components/Button.types';
import { useEffect, useRef, useState } from 'react';
// import ProfileImage from './ProfileImage';

/**
 * @param props
 *  width: string;
 *  height: string;
 *  type: string;
 *  text: string;
 *  onClickEvent: () => void;
 *
 * @returns void;
 */
const IngameButton = (props: IIngameButton) => {
  const [btnHeight, setBtnHeight] = useState(0);

  const buttonStyle = {
    width: props.width,
    height: props.height,
  };

  // 해당 선택지 버튼에 투표한 플레이어의 배열
  // 후에는 props로 받아와서 사용
  // 예상되는 저장 데이터 (플레이어 id, 플레이어 img URL)
  const dummyData = ['1', '2'];

  const buttonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const buttonElement = buttonRef.current;

    if (buttonElement) {
      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          if (entry.target === buttonElement) {
            setBtnHeight(entry.contentRect.height);
          }
        }
      });

      resizeObserver.observe(buttonElement);

      return () => {
        resizeObserver.unobserve(buttonElement);
        resizeObserver.disconnect();
      };
    }
  }, [buttonRef]);

  return (
    <div className="button-area" style={buttonStyle}>
      <button
        ref={buttonRef}
        className={`gamept-button text-left pr-2 ${
          btnHeight > 60 && `rounded-xl`
        }`}
        onClick={props.onClickEvent}
      >
        {props.type === 'multi' ? (
          <div className="flex w-full">
            <div className="flex flex-1">{props.text}</div>
            {/* 투표한 플레이어가 있다면 프로필 이미지 띄워주기. */}
            <div
              className={`w-[${
                dummyData.length * 36
              }px] flex flex-wrap justify-end items-center`}
            >
              {dummyData.length > 0 &&
                dummyData.map((e) => (
                  <img
                    key={`vote_player_${e}`}
                    className="max-w-[32px] max-h-[32px] mx-0.5"
                    src={`./src/assets/player_profile.png`}
                    alt="player_profile"
                  />
                ))}
            </div>
          </div>
        ) : (
          props.text
        )}
      </button>
    </div>
  );

  // Profile Image 컴포넌트를 사용한다며의 예시 코드
  // return (
  //   <div className="button-area" style={buttonStyle}>
  //     <button
  //       ref={buttonRef}
  //       className={`gamept-button text-left pr-2 ${
  //         btnHeight > 60 && `rounded-xl`
  //       }`}
  //       onClick={props.onClickEvent}
  //     >
  //       {props.type === 'multi' ? (
  //         <div className="flex w-full">
  //           <div className="flex flex-1">{props.text}</div>
  //           {/* 투표한 플레이어가 있다면 프로필 이미지 띄워주기. */}
  //           <div
  //             className={`w-[${
  //               dummyData.length * 36
  //             }px] flex flex-wrap justify-end items-center`}
  //           >
  //             {dummyData.map((e) => (
  //               <ProfileImage
  //                 size={32}
  //                 imgCode={Number(e)}
  //                 alt={`player${e}_img`}
  //                 hasBorderAsset
  //                 key={`vote_player_${e}`}
  //                 onClickEvent={() => {
  //                   console.log('클릭 시 좌측 탭에 포커스 된 플레이어가 변경');
  //                 }}
  //               />
  //             ))}
  //           </div>
  //         </div>
  //       ) : (
  //         props.text
  //       )}
  //     </button>
  //   </div>
  // );
};

export default IngameButton;
