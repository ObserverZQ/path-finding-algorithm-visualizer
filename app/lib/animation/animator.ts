import type { Position } from '../algorithms/types';
import { AnimationResult, AnimationStep, StepType } from './types';
export class Animator {
  result: AnimationResult;
  currentIndex: number = 0;
  speed: number = 16; // interval in ms
  private playInterval: NodeJS.Timeout | null = null;

  constructor(result: AnimationResult) {
    this.result = result;
  }

  play(): void {
    if (this.playInterval) clearInterval(this.playInterval);

    this.playInterval = setInterval(() => {
      if (this.currentIndex < this.result.steps.length - 1) {
        this.currentIndex += 1;
      } else {
        this.stop();
      }
    }, this.speed);
  }

  stop(): void {
    if (this.playInterval) {
      clearInterval(this.playInterval);
      this.playInterval = null;
    }
  }

  destroy(): void {
    this.stop();
  }

  moveNext(): void {
    if (this.currentIndex < this.result.steps.length - 1) {
      this.currentIndex += 1;
    }
  }

  getCurrentStep(): AnimationStep | null {
    return this.result.steps[this.currentIndex] || null;
  }

  nextStep(): AnimationStep | null {
    this.moveNext();
    return this.getCurrentStep();
  }

  prevStep(): AnimationStep | null {
    if (this.currentIndex > 0) {
      this.currentIndex -= 1;
    }
    return this.getCurrentStep();
  }

  jumpToStep(index: number): void {
    this.currentIndex = Math.max(
      0,
      Math.min(index, this.result.steps.length - 1)
    );
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
