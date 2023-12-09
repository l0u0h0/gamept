export interface IGauge {
  value: number; // 현재 게이지 값
  total: number; // 최대 게이지 값
  type: 'hp' | 'exp'; // 게이지 타입
}
