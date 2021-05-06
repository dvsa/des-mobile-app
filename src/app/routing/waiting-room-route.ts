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
    path: CAT_B.WAITING_ROOM_PAGE,
    loadChildren: () => import('@pages/waiting-room/waiting-room.module')
      .then((m) => m.WaitingRoomCatBPageModule),
  },
];
