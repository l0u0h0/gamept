import { useState, useEffect } from 'react';
import { IGauge } from "@/types/components/Gauge.types";
import Gaugebar from "@/assets/gauge_bg.png";
import GaugeHp from "@/assets/gauge_red.png";
import GaugeExp from "@/assets/gauge_green.png";


interface IModifiedGaugeProps extends IGauge {
  onLevelUp?: () => void;
}

const Gauge = (props: IModifiedGaugeProps) => {
  const [currentValue, setCurrentValue] = useState(props.value);

  useEffect(() => {
    // 게이지 값이 변경될 때마다 현재 값을 업데이트
    setCurrentValue(props.value);

    // 경험치 게이지가 조건을 충족하는 경우 레벨업 콜백 함수 호출
    if (props.type === 'exp' && props.value >= props.total && props.onLevelUp) {
      props.onLevelUp();
    }
  }, [props.value, props.type, props.total, props.onLevelUp]);



  // 게이지 바의 너비를 계산
  const gaugeWidth = (currentValue / props.total) * 100;
  const clipPathValue = `polygon(0 0, ${gaugeWidth}% 0, ${gaugeWidth}% 100%, 0 100%)`;
  const gaugeImage = props.type === 'hp' ? GaugeHp : GaugeExp;

return (
  <div className="w-full h-[45px] relative flex items-center">
    <img className="w-full h-full object-contain" src={Gaugebar} alt={`gauge_${props.type}`} />
    <img
      className="absolute top-[50%] transform -translate-y-1/2 w-full h-full object-contain"
      style={{ clipPath: clipPathValue }}
      src={gaugeImage}
      alt={`gauge_${props.type}`}
    />
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-white">
      {currentValue}/{props.total}
    </div>
  </div>
);
}

export default Gauge;