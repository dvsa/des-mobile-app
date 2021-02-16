export class MenuControllerMock {

  isOpen = () => Promise.resolve(true);

  isClose = () => Promise.resolve(true);

  swipeGesture = (shouldEnable: boolean, menuId?: string) => Promise.resolve({} as HTMLIonMenuElement);

}
