export const StatusBar = {
  async setStyle(opts: StyleOptions): Promise<void> {
    return Promise.resolve();
  },
};
export enum Style {
  Dark = 'Dark',
}

interface StyleOptions {
  style: Style;
}

