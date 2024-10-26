type Listener = (data: any) => void;

class EventHandler {
  private listeners: Map<string, Listener[]>;

  constructor() {
    this.listeners = new Map();
  }

  subscribe(event: string, listener: Listener): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)?.push(listener);
  }

  unsubscribe(event: string, listener: Listener): void {
    if (this.listeners.has(event)) {
      const eventListeners = this.listeners.get(event)!;
      const index = eventListeners.indexOf(listener);
      if (index !== -1) {
        eventListeners.splice(index, 1);
      }
    }
  }

  dispatchEvent(event: string, data: any): void {
    if (this.listeners.has(event)) {
      const eventListeners = this.listeners.get(event)!.slice();
      for (const listener of eventListeners) {
        listener(data);
      }
    }
  }
}

export { EventHandler, Listener as EventListener };
