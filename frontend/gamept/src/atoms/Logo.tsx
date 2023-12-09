/*
 * 로고 컴포넌트
 * 추후 클릭 시 보내질 페이지가 정해지면 추가로 구현
 * className 기본값으로 로고 위치가 지정되어 있으나,
 * 인게임 화면 페이지의 컴포넌트 구조에서 해당 className을 적용하기 불편할 경우,
 * 따로 props 보내주면 문제 없습니다.
 */

// import LogoImg from '../assets/GamePTLogo.svg';

const Logo = ({ className }: { className?: string }) => {
  const api = import.meta.env.VITE_SERVER_URL.split('api')[0];
  const LogoImg = api + 'GamePTLogo.png';
  return (
    <img
      src={LogoImg}
      className={`w-[245px] h-[65px] ${
        className ? className : 'absolute left-[30px] top-[30px]'
      }`}
      alt="GamePT 로고"
    />
  );
};

export default Logo;
