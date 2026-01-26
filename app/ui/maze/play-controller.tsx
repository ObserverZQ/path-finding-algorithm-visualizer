'use client';
import { Animator } from '@/app/lib/animation/animator';
import { useState, useEffect } from 'react';
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
  }

  return (
    <div className='absolute opacity-30 bottom-10 w-150 h-25 rounded-3xl bg-neutral-300'></div>
  );
}
