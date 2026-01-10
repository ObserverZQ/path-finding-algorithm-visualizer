type MazeEventListener = () => void;
type MazeEvent = 'clearPath' | 'clearAll' | 'manualStep' | 'run';
class MazeEventEmitter {
  private listeners = new Map<string, Set<MazeEventListener>>();

  on(event: MazeEvent, callback: MazeEventListener) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
    return () => this.listeners.get(event)!.delete(callback);
  }

  emit(event: MazeEvent) {
    this.listeners.get(event)?.forEach((callback) => callback());
  }
}

export const mazeEvents = new MazeEventEmitter();
