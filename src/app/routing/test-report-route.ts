import {
  CAT_A_MOD1,
  CAT_A_MOD2,
  CAT_ADI_PART2,
  CAT_ADI_PART3,
  CAT_B,
  CAT_C,
  CAT_CPC,
  CAT_D,
  CAT_HOME_TEST,
  CAT_MANOEUVRES,
} from '@pages/page-names.constants';
import { Routes } from '@angular/router';

export const Test_Report_Route: Routes = [
  {
    path: CAT_ADI_PART2.TEST_REPORT_PAGE,
    loadChildren: () => import('@pages/test-report/cat-adi-part2/test-report.cat-adi-part2.module')
      .then((m) => m.TestReportCatADIPart2PageModule),
  },
  {
    path: CAT_ADI_PART3.TEST_REPORT_PAGE,
    loadChildren: () => import('@pages/test-report/cat-adi-part3/test-report.cat-adi-part3.module')
      .then((m) => m.TestReportCatADIPart3PageModule),
  },
  {
    path: CAT_A_MOD1.TEST_REPORT_PAGE,
    loadChildren: () => import('@pages/test-report/cat-a-mod1/test-report.cat-a-mod1.module')
      .then((m) => m.TestReportCatAMod1PageModule),
  },
  {
    path: CAT_A_MOD2.TEST_REPORT_PAGE,
    loadChildren: () => import('@pages/test-report/cat-a-mod2/test-report.cat-a-mod2.module')
      .then((m) => m.TestReportCatAMod2PageModule),
  },
  {
    path: CAT_B.TEST_REPORT_PAGE,
    loadChildren: () => import('@pages/test-report/cat-b/test-report.cat-b.module')
      .then((m) => m.TestReportCatBPageModule),
  },
  {
    path: CAT_C.TEST_REPORT_PAGE,
    loadChildren: () => import('@pages/test-report/cat-c/test-report.cat-c.module')
      .then((m) => m.TestReportCatCPageModule),
  },
  {
    path: CAT_CPC.TEST_REPORT_PAGE,
    loadChildren: () => import('@pages/test-report/cat-cpc/test-report.cat-cpc.module')
      .then((m) => m.TestReportCatCPCPageModule),
  },
  {
    path: CAT_D.TEST_REPORT_PAGE,
    loadChildren: () => import('@pages/test-report/cat-d/test-report.cat-d.module')
      .then((m) => m.TestReportCatDPageModule),
  },
  {
    path: CAT_HOME_TEST.TEST_REPORT_PAGE,
    loadChildren: () => import('@pages/test-report/cat-home-test/test-report.cat-home-test.module')
      .then((m) => m.TestReportCatHomeTestPageModule),
  },
  {
    path: CAT_MANOEUVRES.TEST_REPORT_PAGE,
    loadChildren: () => import('@pages/test-report/cat-manoeuvre/test-report.cat-manoeuvre.module')
      .then((m) => m.TestReportCatManoeuvrePageModule),
  },
];
