import {
  CAT_A_MOD1,
  CAT_A_MOD2,
  CAT_ADI_PART2,
  CAT_ADI_PART3,
  CAT_B,
  CAT_BE,
  CAT_C,
  CAT_CPC,
  CAT_D,
  CAT_HOME_TEST,
  CAT_MANOEUVRES,
} from '@pages/page-names.constants';
import { Routes } from '@angular/router';

export const Pass_Finalisation_Route: Routes = [
  {
    path: CAT_ADI_PART2.PASS_FINALISATION_PAGE,
    loadChildren: () => import('@pages/pass-finalisation/cat-adi-part2/pass-finalisation.cat-adi-part2.module')
      .then((m) => m.PassFinalisationCatADIPart2PageModule),
  },
  {
    path: CAT_ADI_PART3.PASS_FINALISATION_PAGE,
    loadChildren: () => import('@pages/pass-finalisation/cat-adi-part3/pass-finalisation.cat-adi-part3.module')
      .then((m) => m.PassFinalisationCatADIPart3PageModule),
  },
  {
    path: CAT_A_MOD1.PASS_FINALISATION_PAGE,
    loadChildren: () => import('@pages/pass-finalisation/cat-a-mod1/pass-finalisation.cat-a-mod1.module')
      .then((m) => m.PassFinalisationCatAMod1PageModule),
  },
  {
    path: CAT_A_MOD2.PASS_FINALISATION_PAGE,
    loadChildren: () => import('@pages/pass-finalisation/cat-a-mod2/pass-finalisation.cat-a-mod2.module')
      .then((m) => m.PassFinalisationCatAMod2PageModule),
  },
  {
    path: CAT_B.PASS_FINALISATION_PAGE,
    loadChildren: () => import('@pages/pass-finalisation/cat-b/pass-finalisation.cat-b.module')
      .then((m) => m.PassFinalisationCatBPageModule),
  },
  {
    path: CAT_BE.PASS_FINALISATION_PAGE,
    loadChildren: () => import('@pages/pass-finalisation/cat-be/pass-finalisation.cat-be.module')
      .then((m) => m.PassFinalisationCatBEPageModule),
  },
  {
    path: CAT_C.PASS_FINALISATION_PAGE,
    loadChildren: () => import('@pages/pass-finalisation/cat-c/pass-finalisation.cat-c.module')
      .then((m) => m.PassFinalisationCatCPageModule),
  },
  {
    path: CAT_CPC.PASS_FINALISATION_PAGE,
    loadChildren: () => import('@pages/pass-finalisation/cat-cpc/pass-finalisation.cat-cpc.module')
      .then((m) => m.PassFinalisationCatCPCPageModule),
  },
  {
    path: CAT_D.PASS_FINALISATION_PAGE,
    loadChildren: () => import('@pages/pass-finalisation/cat-d/pass-finalisation.cat-d.module')
      .then((m) => m.PassFinalisationCatDPageModule),
  },
  {
    path: CAT_HOME_TEST.PASS_FINALISATION_PAGE,
    loadChildren: () => import('@pages/pass-finalisation/cat-home-test/pass-finalisation.cat-home-test.module')
      .then((m) => m.PassFinalisationCatHomeTestPageModule),
  },
  {
    path: CAT_MANOEUVRES.PASS_FINALISATION_PAGE,
    loadChildren: () => import('@pages/pass-finalisation/cat-manoeuvre/pass-finalisation.cat-manoeuvre.module')
      .then((m) => m.PassFinalisationCatManoeuvrePageModule),
  },
];
