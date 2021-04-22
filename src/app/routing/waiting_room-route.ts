import { CAT_B, CAT_BE } from '@pages/page-names.constants';
import { Routes } from '@angular/router';

export const Waiting_Room_Route: Routes = [
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
];
