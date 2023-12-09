/**
 *
 */

import { LoadingText } from '@/atoms/LoadingText';

export const LoadingBeforeCharacterSet = () => {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <LoadingText />
    </div>
  );
};
