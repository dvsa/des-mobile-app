export interface AppInfo {
  name: string;
  id: string;
  build: string;
  version: string;
}

export const App = {
  getInfo: async (): Promise<AppInfo> => ({ version: '1.2.3', id: 'id', name: 'name', build: 'build' }),
};
