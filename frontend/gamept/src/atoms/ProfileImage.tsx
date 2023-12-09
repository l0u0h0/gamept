/*
 * 프로필용 이미지 컴포넌트
 * props 설명
 * onClick? : 클릭했을때 연결되는 로직 - 멀티플레이어에서 파티원 상태창 열람할 경우 연결해서 사용
 * hasBorderAsset? : 테두리 asset이 적용되는지 T/F
 * imgCode : 이미지 코드값, 종족/직업/성별에 따라 이미지 코드를 생성 단계에서 부여하고, jotai를 통해 관리할 예정
 * size : 원하는 이미지 사이즈
 * alt : alt 텍스트
 * className: 위치 조정용 커스텀 className
 */
import ProfileBorder from '../assets/ProfileBorder.svg';
import { IProfileImage } from '@/types/components/Image.types';

const ProfileImage = (props: IProfileImage) => {
  const api = import.meta.env.VITE_SERVER_URL.split('api')[0];

  const profileImgUrl = api + 'profile/' + props.imgCode;
  return (
    <div
      onClick={props.onClickEvent}
      className={`relative ${props.className}`}
      style={{ width: props.size, height: props.size }}
    >
      <img
        src={profileImgUrl}
        className="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] rounded-full"
        style={{
          width: props.hasBorderAsset ? props.size - 10 : '100%',
          height: props.hasBorderAsset ? props.size - 10 : '100%',
        }}
        alt={props.alt}
      />
      {props.hasBorderAsset && (
        <img
          src={ProfileBorder}
          className="absolute "
          style={{ width: '100%', height: '100%' }}
          alt="프로필 테두리 이미지"
        />
      )}
    </div>
  );
};

export default ProfileImage;
