import LoadingSpinner1 from '@/atoms/LoadingSpinner1';

const LoadingGameMake = () => {
  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center">
      <LoadingSpinner1 />
      <div className="text-primary text-32 font-hol">게임을 생성하는 중...</div>
    </div>
  );
};

export default LoadingGameMake;
