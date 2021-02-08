export class PlatformMock {
  is = () => false;
  ready = async() => Promise.resolve();
}
