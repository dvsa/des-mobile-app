import {
  CAT_A_MOD1,
  CAT_A_MOD2,
  CAT_ADI_PART2,
  CAT_B,
  CAT_BE,
  CAT_C,
  CAT_CPC,
  CAT_D,
  CAT_HOME_TEST,
  CAT_MANOEUVRES,
} from '@pages/page-names.constants';
import { Routes } from '@angular/router';

export const Waiting_Room_To_Car_Route: Routes = [
  {
    path: CAT_A_MOD1.WAITING_ROOM_TO_CAR_PAGE,
    loadChildren: () => import('@pages/waiting-room-to-car/cat-a-mod1/waiting-room-to-car.cat-a-mod1.module')
      .then((m) => m.WaitingRoomToCarCatAMod1PageModule),
  },
  {
    path: CAT_A_MOD2.WAITING_ROOM_TO_CAR_PAGE,
    loadChildren: () => import('@pages/waiting-room-to-car/cat-a-mod2/waiting-room-to-car.cat-a-mod2.module')
      .then((m) => m.WaitingRoomToCarCatAMod2PageModule),
  },
  {
    path: CAT_B.WAITING_ROOM_TO_CAR_PAGE,
    loadChildren: () => import('@pages/waiting-room-to-car/cat-b/waiting-room-to-car.cat-b.module')
      .then((m) => m.WaitingRoomToCarCatBPageModule),
  },
  {
    path: CAT_BE.WAITING_ROOM_TO_CAR_PAGE,
    loadChildren: () => import('@pages/waiting-room-to-car/cat-be/waiting-room-to-car.cat-be.module')
      .then((m) => m.WaitingRoomToCarCatBEPageModule),
  },
  {
    path: CAT_C.WAITING_ROOM_TO_CAR_PAGE,
    loadChildren: () => import('@pages/waiting-room-to-car/cat-c/waiting-room-to-car.cat-c.module')
      .then((m) => m.WaitingRoomToCarCatCPageModule),
  },
  {
    path: CAT_CPC.WAITING_ROOM_TO_CAR_PAGE,
    loadChildren: () => import('@pages/waiting-room-to-car/cat-cpc/waiting-room-to-car.cat-cpc.module')
      .then((m) => m.WaitingRoomToCarCatCPCPageModule),
  },
  {
    path: CAT_D.WAITING_ROOM_TO_CAR_PAGE,
    loadChildren: () => import('@pages/waiting-room-to-car/cat-d/waiting-room-to-car.cat-d.module')
      .then((m) => m.WaitingRoomToCarCatDPageModule),
  },
  {
    path: CAT_HOME_TEST.WAITING_ROOM_TO_CAR_PAGE,
    loadChildren: () => import('@pages/waiting-room-to-car/cat-home-test/waiting-room-to-car.cat-home-test.module')
      .then((m) => m.WaitingRoomToCarCatHomeTestPageModule),
  },
  {
    path: CAT_MANOEUVRES.WAITING_ROOM_TO_CAR_PAGE,
    loadChildren: () => import('@pages/waiting-room-to-car/cat-manoeuvre/waiting-room-to-car.cat-manoeuvre.module')
      .then((m) => m.WaitingRoomToCarCatManoeuvrePageModule),
  },
  {
    path: CAT_ADI_PART2.WAITING_ROOM_TO_CAR_PAGE,
    loadChildren: () => import('@pages/waiting-room-to-car/cat-adi-part2/waiting-room-to-car.cat-adi-part2.page.module')
        .then((m) => m.WaitingRoomToCarCatADIPart2PageModule),
  },
];
