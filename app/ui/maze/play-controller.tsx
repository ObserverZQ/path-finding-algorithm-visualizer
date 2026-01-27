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
  const [isPlaying, setIsPlaying] = useState(false);
  const totalSteps = animator.result.steps.length;

  const stop = () => {
    animator.stop();
    setIsPlaying(false);
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      stop();
    } else {
      animator.play();
      setIsPlaying(true);
    }
  };

  const handlePrevStep = () => {
    stop();
    animator.prevStep();
  };

  const handleNextStep = () => {
    stop();
    animator.nextStep();
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
        className='text-2xl text-neutral-400'
        onClick={handlePrevStep}
      />
      {isPlaying ? (
        <VscDebugPause
          className='text-2xl text-neutral-400'
          onClick={handlePlayPause}
        />
      ) : (
        <VscDebugStart
          className='text-2xl text-neutral-400'
          onClick={handlePlayPause}
        />
      )}
      <VscDebugContinue
        className='text-2xl text-neutral-400'
        onClick={handleNextStep}
      />
    </div>
  );
}
