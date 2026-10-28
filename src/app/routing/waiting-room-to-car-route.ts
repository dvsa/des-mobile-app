import { Routes } from '@angular/router';
import {
  CAT_ADI_PART2,
  CAT_ADI_PART3,
  CAT_A_MOD1,
  CAT_A_MOD2,
  CAT_B,
  CAT_C,
  CAT_CPC,
  CAT_D,
  CAT_HOME_TEST,
  CAT_MANOEUVRES,
} from '@pages/page-names.constants';

export const Waiting_Room_To_Car_Route: Routes = [
  {
    path: CAT_ADI_PART2.WAITING_ROOM_TO_CAR_PAGE,
    loadComponent: () =>
      import('@pages/waiting-room-to-car/cat-adi-part2/waiting-room-to-car.cat-adi-part2.page').then(
        (m) => m.WaitingRoomToCarCatADIPart2Page
      ),
  },
  {
    path: CAT_ADI_PART3.WAITING_ROOM_TO_CAR_PAGE,
    loadComponent: () =>
      import('@pages/waiting-room-to-car/cat-adi-part3/waiting-room-to-car.cat-adi-part3.page').then(
        (m) => m.WaitingRoomToCarCatADIPart3Page
      ),
  },
  {
    path: CAT_A_MOD1.WAITING_ROOM_TO_CAR_PAGE,
    loadComponent: () =>
      import('@pages/waiting-room-to-car/cat-a-mod1/waiting-room-to-car.cat-a-mod1.page').then(
        (m) => m.WaitingRoomToCarCatAMod1Page
      ),
  },
  {
    path: CAT_A_MOD2.WAITING_ROOM_TO_CAR_PAGE,
    loadComponent: () =>
      import('@pages/waiting-room-to-car/cat-a-mod2/waiting-room-to-car.cat-a-mod2.page').then(
        (m) => m.WaitingRoomToCarCatAMod2Page
      ),
  },
  {
    path: CAT_B.WAITING_ROOM_TO_CAR_PAGE,
    loadComponent: () =>
      import('@pages/waiting-room-to-car/cat-b/waiting-room-to-car.cat-b.page').then((m) => m.WaitingRoomToCarCatBPage),
  },
  {
    path: CAT_C.WAITING_ROOM_TO_CAR_PAGE,
    loadComponent: () =>
      import('@pages/waiting-room-to-car/cat-c/waiting-room-to-car.cat-c.page').then((m) => m.WaitingRoomToCarCatCPage),
  },
  {
    path: CAT_CPC.WAITING_ROOM_TO_CAR_PAGE,
    loadComponent: () =>
      import('@pages/waiting-room-to-car/cat-cpc/waiting-room-to-car.cat-cpc.page').then(
        (m) => m.WaitingRoomToCarCatCPCPage
      ),
  },
  {
    path: CAT_D.WAITING_ROOM_TO_CAR_PAGE,
    loadComponent: () =>
      import('@pages/waiting-room-to-car/cat-d/waiting-room-to-car.cat-d.page').then((m) => m.WaitingRoomToCarCatDPage),
  },
  {
    path: CAT_HOME_TEST.WAITING_ROOM_TO_CAR_PAGE,
    loadComponent: () =>
      import('@pages/waiting-room-to-car/cat-home-test/waiting-room-to-car.cat-home-test.page').then(
        (m) => m.WaitingRoomToCarCatHomeTestPage
      ),
  },
  {
    path: CAT_MANOEUVRES.WAITING_ROOM_TO_CAR_PAGE,
    loadComponent: () =>
      import('@pages/waiting-room-to-car/cat-manoeuvre/waiting-room-to-car.cat-manoeuvre.page').then(
        (m) => m.WaitingRoomToCarCatManoeuvrePage
      ),
  },
];
