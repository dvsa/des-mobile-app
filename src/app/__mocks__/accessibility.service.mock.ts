export class AccessibilityServiceMock {
  textZoom: number = 100;

  configureAccessibility = (): void => {};

  afterAppResume = (): void => {};

  getTextZoomCallback = (): void => {};

  public getTextZoom(): string {
    return 'regular';
  }

  public getTextZoomClass(): string {
    return 'text-zoom-regular';
  }
}
