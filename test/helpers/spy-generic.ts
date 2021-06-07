export type Spied<T> = {
  [Method in keyof T]: jasmine.Spy;
};
