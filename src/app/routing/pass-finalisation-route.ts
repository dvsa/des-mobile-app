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

export const Pass_Finalisation_Route: Routes = [
  {
    path: CAT_ADI_PART2.PASS_FINALISATION_PAGE,
    loadComponent: () =>
      import('@pages/pass-finalisation/cat-adi-part2/pass-finalisation.cat-adi-part2.page').then(
        (m) => m.PassFinalisationCatADI2Page
      ),
  },
  {
    path: CAT_ADI_PART3.PASS_FINALISATION_PAGE,
    loadComponent: () =>
      import('@pages/pass-finalisation/cat-adi-part3/pass-finalisation.cat-adi-part3.page').then(
        (m) => m.PassFinalisationCatADIPart3Page
      ),
  },
  {
    path: CAT_A_MOD1.PASS_FINALISATION_PAGE,
    loadComponent: () =>
      import('@pages/pass-finalisation/cat-a-mod1/pass-finalisation.cat-a-mod1.page').then(
        (m) => m.PassFinalisationCatAMod1Page
      ),
  },
  {
    path: CAT_A_MOD2.PASS_FINALISATION_PAGE,
    loadComponent: () =>
      import('@pages/pass-finalisation/cat-a-mod2/pass-finalisation.cat-a-mod2.page').then(
        (m) => m.PassFinalisationCatAMod2Page
      ),
  },
  {
    path: CAT_B.PASS_FINALISATION_PAGE,
    loadComponent: () =>
      import('@pages/pass-finalisation/cat-b/pass-finalisation.cat-b.page').then((m) => m.PassFinalisationCatBPage),
  },
  {
    path: CAT_C.PASS_FINALISATION_PAGE,
    loadComponent: () =>
      import('@pages/pass-finalisation/cat-c/pass-finalisation.cat-c.page').then((m) => m.PassFinalisationCatCPage),
  },
  {
    path: CAT_CPC.PASS_FINALISATION_PAGE,
    loadComponent: () =>
      import('@pages/pass-finalisation/cat-cpc/pass-finalisation.cat-cpc.page').then(
        (m) => m.PassFinalisationCatCPCPage
      ),
  },
  {
    path: CAT_D.PASS_FINALISATION_PAGE,
    loadComponent: () =>
      import('@pages/pass-finalisation/cat-d/pass-finalisation.cat-d.page').then((m) => m.PassFinalisationCatDPage),
  },
  {
    path: CAT_HOME_TEST.PASS_FINALISATION_PAGE,
    loadComponent: () =>
      import('@pages/pass-finalisation/cat-home-test/pass-finalisation.cat-home-test.page').then(
        (m) => m.PassFinalisationCatHomeTestPage
      ),
  },
  {
    path: CAT_MANOEUVRES.PASS_FINALISATION_PAGE,
    loadComponent: () =>
      import('@pages/pass-finalisation/cat-manoeuvre/pass-finalisation.cat-manoeuvre.page').then(
        (m) => m.PassFinalisationCatManoeuvrePage
      ),
  },
];
