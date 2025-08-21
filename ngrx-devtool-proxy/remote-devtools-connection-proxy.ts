interface ReduxDevtoolsExtensionConnection {
  subscribe(listener: (change: any) => void): void;
  unsubscribe(): void;
  send(action: any, state: any): void;
  init(state?: any): void;
  error(anyErr: any): void;
}

export class RemoteDevToolsConnectionProxy implements ReduxDevtoolsExtensionConnection {
  constructor(public remotedev: any) {}
  init() {}
  error() {}
  subscribe(listener: (change: any) => void): () => void {
    const listenerWrapper = (change: any) => {
      listener(change);
    };

    this.remotedev.subscribe(listenerWrapper);
    setTimeout(() => listenerWrapper({ type: 'START' }));

    return () => this.remotedev.unsubscribe();
  }

  unsubscribe() {}

  send(action: any, state: any): void {
    this.remotedev.send(action, state);
  }
}
