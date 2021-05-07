import {
  TestFlowPageNames,
} from '@pages/page-names.constants';
import { Routes } from '@angular/router';

export const Waiting_Room_Route: Routes = [
  {
    path: TestFlowPageNames.WAITING_ROOM_PAGE,
    loadChildren: () => import('@pages/waiting-room/waiting-room.module')
      .then((m) => m.WaitingRoomPageModule),
  },

];
