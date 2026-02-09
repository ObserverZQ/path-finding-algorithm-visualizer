'use client';
import { Animator } from '@/app/lib/animation/animator';
import { useState, useEffect } from 'react';
import {
  VscDebugContinue,
  VscDebugPause,
  VscDebugReverseContinue,
  VscDebugStart,
} from 'react-icons/vsc';
interface PlayControllerProps {
  animator: Animator;
  currentStepIndex: number;
  setCurrentStepIndex: (index: number) => void;
  onClose: () => void;
}

export default function PlayController({
  animator,
  currentStepIndex,
  setCurrentStepIndex,
  onClose,
}: PlayControllerProps) {
  const [isPlaying, setIsPlaying] = useState(animator.isPlaying);
  const totalSteps = animator.result.steps.length;

  const stop = () => {
    animator.stop();
    setIsPlaying(false);
  };

  const handlePlayPause = () => {
    if (animator.isPlaying) {
      animator.pause();
      setIsPlaying(false);
    } else {
      animator.play();
      setIsPlaying(true);
    }
    // if (isPlaying) {
    //   stop();
    // } else {
    //   animator.play();
    //   setIsPlaying(true);
    // }
  };

  const handlePrevStep = () => {
    // stop();
    animator.prevStep();
    setIsPlaying(false);
    // setCurrentStepIndex(currentStepIndex - 1);
  };

  const handleNextStep = () => {
    // stop();
    // console.log('Next Step clicked', animator);
    animator.nextStep();
    setIsPlaying(false);
    // setCurrentStepIndex(currentStepIndex + 1);
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    stop();
    const index = parseInt(e.target.value, 10);
    animator.jumpToStep(index);
  };

  return (
    <div
      className='absolute left-1/2 transform -translate-x-1/2 bottom-10 w-150 h-25 rounded-3xl bg-neutral-300/30 opacity-50 hover:opacity-100
      flex items-center justify-center gap-8 shadow-xs'
    >
      <VscDebugReverseContinue
        className='text-2xl text-neutral-400 hover:text-neutral-600 cursor-pointer'
        onClick={handlePrevStep}
      />
      {isPlaying ? (
        <VscDebugPause
          className='text-2xl text-neutral-400 hover:text-neutral-600 cursor-pointer'
          onClick={handlePlayPause}
        />
      ) : (
        <VscDebugStart
          className='text-2xl text-neutral-400 hover:text-neutral-600 cursor-pointer'
          onClick={handlePlayPause}
        />
      )}
      <VscDebugContinue
        className='text-2xl text-neutral-400 hover:text-neutral-600 cursor-pointer'
        onClick={handleNextStep}
      />
    </div>
  );
}
