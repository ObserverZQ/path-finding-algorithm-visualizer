'use client';
import { Animator } from '@/app/lib/animation/animator';
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
  return (
    <div className='absolute opacity-30 bottom-10 w-150 h-25 rounded-3xl bg-neutral-300'></div>
  );
}
