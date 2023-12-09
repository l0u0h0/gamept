import { useEffect, useRef, useState } from 'react';
import Dice from '../atoms/Dice';
import { IDiceModal } from '@/types/components/Dice.types';
import SelectButton from '@/atoms/SelectButton';

const DiceModal = (props: IDiceModal) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const handleModalClose = (e: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      props.onClose();
    }
  };
  const [throwDice, setThrowDice] = useState(false);
  const [dice, setDice] = useState({
    dice1: 3,
    dice2: 1,
    dice3: 1,
  });

  useEffect(() => {
    if (!throwDice) {
      setTimeout(() => {
        setDice({
          dice1: props.dice1,
          dice2: props.dice2,
          dice3: props.dice3,
        });
        setThrowDice(true);
      }, 2000);
    }
  }, [props]);

  useEffect(() => {
    return () => props.onClose();
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleModalClose);
    return () => document.removeEventListener('mousedown', handleModalClose);
  }, []);

  return (
    <div className="w-full h-full absolute bg-black/30 flex items-center">
      <div
        ref={modalRef}
        className="relative card w-1/2 h-3/4 bg-backgroud/80 rounded-lg bg-opacity-80 border-primary mx-auto border-4 z-50 text-center"
      >
        <p className="mt-5 font-hol text-32 text-primary">주사위 결과</p>
        <div className="diceCard relative flex justify-center mt-20">
          <Dice
            throw={throwDice}
            dice1={dice.dice1}
            dice2={dice.dice2}
            dice3={dice.dice3}
          />
        </div>
        <div className="flex justify-center text-">
          <SelectButton
            width="150px"
            height="70px"
            text="확인"
            onClickEvent={() => props.onClose()}
          />
        </div>
      </div>
    </div>
  );
};

export default DiceModal;
