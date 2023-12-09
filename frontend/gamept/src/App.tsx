/**
 * 카카오 로그인 하는지는 모르겠으나 일단 버튼 모양만 넣었습니다
 * 게임 저장 여부 판단하는 로직은 미구현입니다.
 */

// import Logo from '@/assets/logo/logo.png';
import SelectButton from './atoms/SelectButton';
import { useNavigate } from 'react-router-dom';
// import kakao from '@/assets/logo/kakaologo.svg';

function App() {
  const navigate = useNavigate();
  const api = import.meta.env.VITE_SERVER_URL.split('api')[0];
  const LogoImg = api + 'GamePTLogo_L.png';
  const handleCreateGame = () => {
    // game이 존재하는지 체크
    if (isExistGame()) {
      return;
    }

    navigate('/createGame');
  };

  return (
    <div className="w-screen h-screen bg-backgroundDeep flex flex-col items-center justify-center caret-transparent">
      <img src={LogoImg} alt="GamePT 로고" className="w-1/2 mb-5" />

      {/* <div className="w-[450px] h-[70px] bg-yKakao rounded-[16px] flex flex-row justify-between items-center mb-5 px-5">
        <img
          src={kakao}
          alt="카카오 로고"
          className="w-[35px] h-auto my-auto"
        />
        <span className="text-black font-hol text-24 font-bold inline-block w-full text-center">
          카카오 로그인
        </span>
      </div> */}
      <SelectButton
        height="70px"
        onClickEvent={handleCreateGame}
        text="게임 시작하기"
        width="450px"
        isShadow
      />
    </div>
  );
}

const isExistGame = () => {
  return false;
};

export default App;
