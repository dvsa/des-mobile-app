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

export const Office_Route: Routes = [
  {
    path: CAT_A_MOD1.OFFICE_PAGE,
    loadChildren: () => import('@pages/office/cat-a-mod1/office.cat-a-mod1.module')
      .then((m) => m.OfficeCatAMod1PageModule),
  },
  {
    path: CAT_A_MOD2.OFFICE_PAGE,
    loadChildren: () => import('@pages/office/cat-a-mod2/office.cat-a-mod2.module')
      .then((m) => m.OfficeCatAMod2PageModule),
  },
  {
    path: CAT_B.OFFICE_PAGE,
    loadChildren: () => import('@pages/office/cat-b/office.cat-b.module')
      .then((m) => m.OfficeCatBPageModule),
  },
  {
    path: CAT_BE.OFFICE_PAGE,
    loadChildren: () => import('@pages/office/cat-be/office.cat-be.module')
      .then((m) => m.OfficeCatBEPageModule),
  },
  {
    path: CAT_C.OFFICE_PAGE,
    loadChildren: () => import('@pages/office/cat-c/office.cat-c.module')
      .then((m) => m.OfficeCatCPageModule),
  },
  {
    path: CAT_CPC.OFFICE_PAGE,
    loadChildren: () => import('@pages/office/cat-cpc/office.cat-cpc.module')
      .then((m) => m.OfficeCatCPCPageModule),
  },
  {
    path: CAT_D.OFFICE_PAGE,
    loadChildren: () => import('@pages/office/cat-d/office.cat-d.module')
      .then((m) => m.OfficeCatDPageModule),
  },
  {
    path: CAT_HOME_TEST.OFFICE_PAGE,
    loadChildren: () => import('@pages/office/cat-home-test/office.cat-home-test.module')
      .then((m) => m.OfficeCatHomeTestPageModule),
  },
];
