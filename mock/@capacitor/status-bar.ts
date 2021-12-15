export const StatusBar = {
  async setStyle(opts: StyleOptions): Promise<void> {
    return Promise.resolve();
  },

  async hide(opts?: AnimationOptions): Promise<void> {
    return Promise.resolve();
  },

  async show(opts?: AnimationOptions): Promise<void> {
    return Promise.resolve();
  },
};
export enum Style {
  Dark = 'Dark',
}

export enum Animation {
  None = 'NONE',
}

interface StyleOptions {
  style: Style;
}

interface AnimationOptions {
  animation: Animation;
}

