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

export const Debrief_Route: Routes = [
  {
    path: CAT_A_MOD1.DEBRIEF_PAGE,
    loadChildren: () => import('@pages/debrief/cat-a-mod1/debrief.cat-a-mod1.module')
      .then((m) => m.DebriefCatAMod1PageModule),
  },
  {
    path: CAT_A_MOD2.DEBRIEF_PAGE,
    loadChildren: () => import('@pages/debrief/cat-a-mod2/debrief.cat-a-mod2.module')
      .then((m) => m.DebriefCatAMod2PageModule),
  },
  {
    path: CAT_B.DEBRIEF_PAGE,
    loadChildren: () => import('@pages/debrief/cat-b/debrief.cat-b.module')
      .then((m) => m.DebriefCatBPageModule),
  },
  {
    path: CAT_BE.DEBRIEF_PAGE,
    loadChildren: () => import('@pages/debrief/cat-be/debrief.cat-be.module')
      .then((m) => m.DebriefCatBEPageModule),
  },
  {
    path: CAT_C.DEBRIEF_PAGE,
    loadChildren: () => import('@pages/debrief/cat-c/debrief.cat-c.module')
      .then((m) => m.DebriefCatCPageModule),
  },
  {
    path: CAT_CPC.DEBRIEF_PAGE,
    loadChildren: () => import('@pages/debrief/cat-cpc/debrief.cat-cpc.module')
      .then((m) => m.DebriefCatCPCPageModule),
  },
  {
    path: CAT_D.DEBRIEF_PAGE,
    loadChildren: () => import('@pages/debrief/cat-d/debrief.cat-d.module')
      .then((m) => m.DebriefCatDPageModule),
  },
  {
    path: CAT_HOME_TEST.DEBRIEF_PAGE,
    loadChildren: () => import('@pages/debrief/cat-home-test/debrief.cat-home-test.module')
      .then((m) => m.DebriefCatHomeTestPageModule),
  },
];
