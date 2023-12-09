import { IPropmpt } from '@/types/components/Prompt.types';
import LoadingSpinner1 from './LoadingSpinner1';
import { useEffect, useRef, useState } from 'react';
import { initCharacterStatusAtom } from '@/jotai/CharacterStatAtom';
import { useAtomValue } from 'jotai';
const Prompt = (props: IPropmpt) => {
  const lastPromptRef = useRef<HTMLDivElement | null>(null);
  const [word, setWord] = useState('');
  const targetRef = useRef<HTMLParagraphElement>(null);
  const [currentIndex, setCurrentIndex] = useState(
    props.now.length === 0 ? 0 : 0
  );
  const lastTimestamp = useRef<number | null>(null);
  const ms_delay = 25;
  const api = import.meta.env.VITE_SERVER_URL.split('api')[0];
  const characterStatus = useAtomValue(initCharacterStatusAtom);
  useEffect(() => {
    const sentence = props.now.split('');
    let animationFrameId: number;
    const animateTyping = (timestamp: number) => {
      if (lastTimestamp.current === null) lastTimestamp.current = timestamp;
      const elapsed = timestamp - lastTimestamp.current;
      if (elapsed > ms_delay) {
        lastTimestamp.current = timestamp;
        if (sentence.length > currentIndex) {
          setWord((state) => {
            const newState = (state += sentence[currentIndex]);
            setCurrentIndex((prevIndex) => prevIndex + 1);
            return newState;
          });
        }
      }
      animationFrameId = requestAnimationFrame(animateTyping);
    };
    animationFrameId = requestAnimationFrame(animateTyping);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [currentIndex, ms_delay, props.now]);

  useEffect(() => {
    if (lastPromptRef.current) {
      lastPromptRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    if (!props.isFetching && props.now.length === 0) {
      setCurrentIndex(0);
    }
  }, [props.isFetching, props.data, props.now]);

  useEffect(() => {
    if (!props.isFetching && props.now.length === currentIndex) {
      setWord('');
      if (props.setNowPrompt) props.setNowPrompt('');
    }
  }, [props.isFetching, currentIndex, props.now]);

  if (props.type === undefined) return <LoadingSpinner1 />;
  const promptHeight =
    props.type === 'in-game' ? 'h-[330px]' : 'min-h-[330px] h-[60%]';
  return (
    <div
      className={`max-w-[1100px] min-w-[500px] mx-auto relative bg-transparent w-full + ${promptHeight}`}
    >
      {props.data && (
        <div className={props.type}>
          <p className="w-full h-8 bg-transparent"></p>
          {currentIndex === props.now.length ||
          props.isFetching ||
          props.now.length === 0
            ? props.data.map((e, i) => (
                <div
                  key={`prompt_${i}`}
                  className={`my-4 ${e[0].role === props.playerCode && `flex`}`}
                  ref={
                    props.data &&
                    props.data.length - 1 === i &&
                    !props.isFetching
                      ? lastPromptRef
                      : null
                  }
                >
                  {e[0].role === props.playerCode && (
                    <img
                      src={`${api}profile/${characterStatus.imgCode}`}
                      alt={`Player_Profile_img`}
                      className="w-6 h-6 mt-2 mr-2 rounded-full"
                    />
                  )}
                  {e.map((v, j) => (
                    <p
                      className={
                        v.role === props.playerCode
                          ? `text-secondaryContainer`
                          : ``
                      }
                      key={`promptMsg_${i}_${j}`}
                    >
                      {v.msg}
                    </p>
                  ))}
                </div>
              ))
            : props.data.map((e, i) => {
                return (
                  i + 1 !== props.data?.length && (
                    <div
                      id={'hi'}
                      key={`prompt_${i}`}
                      className={`my-4 ${
                        e[0].role === props.playerCode && `flex`
                      }`}
                      ref={
                        props.data &&
                        props.data.length - 2 === i &&
                        !props.isFetching
                          ? lastPromptRef
                          : null
                      }
                    >
                      {e[0].role === props.playerCode && (
                        <img
                          src="./src/assets/player_profile.png"
                          className="w-6 h-6 mt-2 mr-2"
                        />
                      )}
                      {e.map((v, j) => (
                        <p
                          className={
                            v.role === props.playerCode
                              ? `text-secondaryContainer`
                              : ``
                          }
                          key={`promptMsg_${i}_${j}`}
                        >
                          {v.msg}
                        </p>
                      ))}
                    </div>
                  )
                );
              })}
          {(props.isFetching ||
            (props.now.length !== currentIndex && props.now.length !== 0)) && (
            <div key={`prompt_now`} className={`my-4`} ref={lastPromptRef}>
              <p ref={targetRef}>{word}</p>
            </div>
          )}
          {props.isFetching && (
            <div className="flex justify-center my-4" ref={lastPromptRef}>
              <LoadingSpinner1 />
            </div>
          )}
        </div>
      )}
      {!props.data && props.isFetching && (
        <div className="flex justify-center my-4" ref={lastPromptRef}>
          <LoadingSpinner1 />
        </div>
      )}
      <div className="w-full h-1/6 absolute bg-gradient-to-t from-transparent from-30% to-backgroud"></div>
      <div className="w-full h-4 absolute -bottom-0 bg-gradient-to-b from-transparent from-30% to-backgroud"></div>
    </div>
  );
};

export default Prompt;
