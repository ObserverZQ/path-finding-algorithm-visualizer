import { on } from 'events';
import type { Position } from '../algorithms/types';
import { AnimationResult, AnimationStep, StepType } from './types';
export class Animator {
  result: AnimationResult;
  currentIndex: number = 0;
  speed: number = 16; // interval in ms
  private playInterval: NodeJS.Timeout | null = null;
  isPlaying: boolean = false;

  constructor(result: AnimationResult) {
    this.result = result;
  }

  // Callback for external listeners to react to step changes
  onStepChange: (index: number) => void = () => { };
  onPlayStatusChange: (isPlaying: boolean) => void = () => { };

  play(): void {
    if (this.playInterval) clearInterval(this.playInterval);
    this.isPlaying = true;
    this.onPlayStatusChange(this.isPlaying);
    this.playInterval = setInterval(() => {
      if (this.currentIndex < this.result.steps.length - 1) {
        this.currentIndex += 1;
        this.onStepChange(this.currentIndex);
      } else {
        this.stop();
      }
    }, this.speed);
  }

  pause(): void {
    if (this.playInterval) {
      clearInterval(this.playInterval);
      this.playInterval = null;
    }
    this.isPlaying = false;
  }

  stop(): void {
    this.pause();
    this.onPlayStatusChange(this.isPlaying);
  }

  destroy(): void {
    this.stop();
  }

  getCurrentStep(): AnimationStep | null {
    return this.result.steps[this.currentIndex] || null;
  }

  nextStep(): AnimationStep | null {
    if (this.currentIndex < this.result.steps.length - 1) {
      this.currentIndex += 1;
      this.onStepChange(this.currentIndex);
    }
    this.pause();
    return this.getCurrentStep();
  }

  prevStep(): AnimationStep | null {
    if (this.currentIndex > 0) {
      this.currentIndex -= 1;
      this.onStepChange(this.currentIndex);
    }
    this.pause();
    return this.getCurrentStep();
  }

  jumpToStep(index: number): void {
    this.currentIndex = Math.max(
      0,
      Math.min(index, this.result.steps.length - 1),
    );
    // this.pause();
    this.onStepChange(this.currentIndex);
  }

  reset(): void {
    this.currentIndex = 0;
  }

  isFinished(): boolean {
    return this.currentIndex >= this.result.steps.length - 1;
  }

  setSpeed(speed: number): void {
    this.speed = Math.max(0.1, speed);
  }

  getSpecificPositions(stepType: StepType): Position[] {
    return this.result.steps
      .slice(0, this.currentIndex + 1)
      .filter((step) => step.type === stepType)
      .map((step) => step.position);
  }
}
