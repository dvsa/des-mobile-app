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
    loadComponent: () =>
      import('@pages/office/cat-adi-part2/office.cat-adi-part2.page').then((m) => m.OfficeCatADI2Page),
  },
  {
    path: CAT_ADI_PART3.OFFICE_PAGE,
    loadComponent: () =>
      import('@pages/office/cat-adi-part3/office.cat-adi-part3.page').then((m) => m.OfficeCatADI3Page),
  },
  {
    path: CAT_A_MOD1.OFFICE_PAGE,
    loadComponent: () => import('@pages/office/cat-a-mod1/office.cat-a-mod1.page').then((m) => m.OfficeCatAMod1Page),
  },
  {
    path: CAT_A_MOD2.OFFICE_PAGE,
    loadComponent: () => import('@pages/office/cat-a-mod2/office.cat-a-mod2.page').then((m) => m.OfficeCatAMod2Page),
  },
  {
    path: CAT_B.OFFICE_PAGE,
    loadComponent: () => import('@pages/office/cat-b/office.cat-b.page').then((m) => m.OfficeCatBPage),
  },
  {
    path: CAT_C.OFFICE_PAGE,
    loadComponent: () => import('@pages/office/cat-c/office.cat-c.page').then((m) => m.OfficeCatCPage),
  },
  {
    path: CAT_CPC.OFFICE_PAGE,
    loadComponent: () => import('@pages/office/cat-cpc/office.cat-cpc.page').then((m) => m.OfficeCatCPCPage),
  },
  {
    path: CAT_D.OFFICE_PAGE,
    loadComponent: () => import('@pages/office/cat-d/office.cat-d.page').then((m) => m.OfficeCatDPage),
  },
  {
    path: CAT_HOME_TEST.OFFICE_PAGE,
    loadComponent: () =>
      import('@pages/office/cat-home-test/office.cat-home-test.page').then((m) => m.OfficeCatHomeTestPage),
  },
  {
    path: CAT_MANOEUVRES.OFFICE_PAGE,
    loadComponent: () =>
      import('@pages/office/cat-manoeuvre/office.cat-manoeuvre.page').then((m) => m.OfficeCatManoeuvrePage),
  },
];
