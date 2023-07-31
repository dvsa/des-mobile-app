export class AccessibilityServiceMock {
  textZoom: number = 100;

  configureAccessibility = (): Promise<void> => {
    return Promise.resolve();
  };

  afterAppResume = (): Promise<void> => {
    return Promise.resolve();
  };

  getTextZoomCallback = (): void => {
  };

  public getTextZoom(): string {
    return 'regular';
  }

  public getTextZoomClass(): string {
    return 'text-zoom-regular';
  }
}
