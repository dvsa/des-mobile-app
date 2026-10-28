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

export const Test_Report_Route: Routes = [
  {
    path: CAT_ADI_PART2.TEST_REPORT_PAGE,
    loadComponent: () =>
      import('@pages/test-report/cat-adi-part2/test-report.cat-adi-part2.page').then((m) => m.TestReportCatADI2Page),
  },
  {
    path: CAT_ADI_PART3.TEST_REPORT_PAGE,
    loadComponent: () =>
      import('@pages/test-report/cat-adi-part3/test-report.cat-adi-part3.page').then((m) => m.TestReportCatADI3Page),
  },
  {
    path: CAT_A_MOD1.TEST_REPORT_PAGE,
    loadComponent: () =>
      import('@pages/test-report/cat-a-mod1/test-report.cat-a-mod1.page').then((m) => m.TestReportCatAMod1Page),
  },
  {
    path: CAT_A_MOD2.TEST_REPORT_PAGE,
    loadComponent: () =>
      import('@pages/test-report/cat-a-mod2/test-report.cat-a-mod2.page').then((m) => m.TestReportCatAMod2Page),
  },
  {
    path: CAT_B.TEST_REPORT_PAGE,
    loadComponent: () => import('@pages/test-report/cat-b/test-report.cat-b.page').then((m) => m.TestReportCatBPage),
  },
  {
    path: CAT_C.TEST_REPORT_PAGE,
    loadComponent: () => import('@pages/test-report/cat-c/test-report.cat-c.page').then((m) => m.TestReportCatCPage),
  },
  {
    path: CAT_CPC.TEST_REPORT_PAGE,
    loadComponent: () =>
      import('@pages/test-report/cat-cpc/test-report.cat-cpc.page').then((m) => m.TestReportCatCPCPage),
  },
  {
    path: CAT_D.TEST_REPORT_PAGE,
    loadComponent: () => import('@pages/test-report/cat-d/test-report.cat-d.page').then((m) => m.TestReportCatDPage),
  },
  {
    path: CAT_HOME_TEST.TEST_REPORT_PAGE,
    loadComponent: () =>
      import('@pages/test-report/cat-home-test/test-report.cat-home-test.page').then(
        (m) => m.TestReportCatHomeTestPage
      ),
  },
  {
    path: CAT_MANOEUVRES.TEST_REPORT_PAGE,
    loadComponent: () =>
      import('@pages/test-report/cat-manoeuvre/test-report.cat-manoeuvre.page').then(
        (m) => m.TestReportCatManoeuvrePage
      ),
  },
];
