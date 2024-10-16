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

export const Office_Route: Routes = [
  {
    path: CAT_ADI_PART2.OFFICE_PAGE,
    loadChildren: () =>
      import('@pages/office/cat-adi-part2/office.cat-adi-part2.module').then((m) => m.OfficeCatADIPart2PageModule),
  },
  {
    path: CAT_ADI_PART3.OFFICE_PAGE,
    loadChildren: () =>
      import('@pages/office/cat-adi-part3/office.cat-adi-part3.module').then((m) => m.OfficeCatADIPart3PageModule),
  },
  {
    path: CAT_A_MOD1.OFFICE_PAGE,
    loadChildren: () =>
      import('@pages/office/cat-a-mod1/office.cat-a-mod1.module').then((m) => m.OfficeCatAMod1PageModule),
  },
  {
    path: CAT_A_MOD2.OFFICE_PAGE,
    loadChildren: () =>
      import('@pages/office/cat-a-mod2/office.cat-a-mod2.module').then((m) => m.OfficeCatAMod2PageModule),
  },
  {
    path: CAT_B.OFFICE_PAGE,
    loadChildren: () => import('@pages/office/cat-b/office.cat-b.module').then((m) => m.OfficeCatBPageModule),
  },
  {
    path: CAT_C.OFFICE_PAGE,
    loadChildren: () => import('@pages/office/cat-c/office.cat-c.module').then((m) => m.OfficeCatCPageModule),
  },
  {
    path: CAT_CPC.OFFICE_PAGE,
    loadChildren: () => import('@pages/office/cat-cpc/office.cat-cpc.module').then((m) => m.OfficeCatCPCPageModule),
  },
  {
    path: CAT_D.OFFICE_PAGE,
    loadChildren: () => import('@pages/office/cat-d/office.cat-d.module').then((m) => m.OfficeCatDPageModule),
  },
  {
    path: CAT_HOME_TEST.OFFICE_PAGE,
    loadChildren: () =>
      import('@pages/office/cat-home-test/office.cat-home-test.module').then((m) => m.OfficeCatHomeTestPageModule),
  },
  {
    path: CAT_MANOEUVRES.OFFICE_PAGE,
    loadChildren: () =>
      import('@pages/office/cat-manoeuvre/office.cat-manoeuvre.module').then((m) => m.OfficeCatManoeuvrePageModule),
  },
];
