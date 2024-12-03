class EventHandler {
    constructor() {
        this.listeners = new Map();
    }
    subscribe(event, listener) {
        var _a;
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        (_a = this.listeners.get(event)) === null || _a === void 0 ? void 0 : _a.push(listener);
    }
    unsubscribe(event, listener) {
        if (this.listeners.has(event)) {
            const eventListeners = this.listeners.get(event);
            const index = eventListeners.indexOf(listener);
            if (index !== -1) {
                eventListeners.splice(index, 1);
            }
        }
    }
    dispatchEvent(event, data) {
        if (this.listeners.has(event)) {
            const eventListeners = this.listeners.get(event).slice();
            for (const listener of eventListeners) {
                listener(data);
            }
        }
    }
}
