import {
  CAT_A_MOD1,
  CAT_A_MOD2,
  CAT_B,
  CAT_BE,
  CAT_C,
  CAT_CPC,
  CAT_D,
  CAT_HOME_TEST,
} from '@pages/page-names.constants';
import { Routes } from '@angular/router';

export const Waiting_Room_Route: Routes = [
  {
    path: CAT_A_MOD1.WAITING_ROOM_PAGE,
    loadChildren: () => import('@pages/waiting-room/cat-a-mod1/waiting-room.cat-a-mod1.module')
      .then((m) => m.WaitingRoomCatAMod1PageModule),
  },
  {
    path: CAT_A_MOD2.WAITING_ROOM_PAGE,
    loadChildren: () => import('@pages/waiting-room/cat-a-mod2/waiting-room.cat-a-mod2.module')
      .then((m) => m.WaitingRoomCatAMod2PageModule),
  },
  {
    path: CAT_B.WAITING_ROOM_PAGE,
    loadChildren: () => import('@pages/waiting-room/cat-b/waiting-room.cat-b.module')
      .then((m) => m.WaitingRoomCatBPageModule),
  },
  {
    path: CAT_BE.WAITING_ROOM_PAGE,
    loadChildren: () => import('@pages/waiting-room/cat-be/waiting-room.cat-be.module')
      .then((m) => m.WaitingRoomCatBEPageModule),
  },
  {
    path: CAT_C.WAITING_ROOM_PAGE,
    loadChildren: () => import('@pages/waiting-room/cat-c/waiting-room.cat-c.module')
      .then((m) => m.WaitingRoomCatCPageModule),
  },
  {
    path: CAT_CPC.WAITING_ROOM_PAGE,
    loadChildren: () => import('@pages/waiting-room/cat-cpc/waiting-room.cat-cpc.module')
      .then((m) => m.WaitingRoomCatCPCPageModule),
  },
  {
    path: CAT_D.WAITING_ROOM_PAGE,
    loadChildren: () => import('@pages/waiting-room/cat-d/waiting-room.cat-d.module')
      .then((m) => m.WaitingRoomCatDPageModule),
  },
  {
    path: CAT_HOME_TEST.WAITING_ROOM_PAGE,
    loadChildren: () => import('@pages/waiting-room/cat-home-test/waiting-room.cat-home-test.module')
      .then((m) => m.WaitingRoomCatHomeTestPageModule),
  },
];
