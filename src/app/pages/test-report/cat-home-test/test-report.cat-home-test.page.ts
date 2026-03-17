import { Component, OnInit } from '@angular/core';
import { CatFUniqueTypes } from '@dvsa/mes-test-schema/categories/F';
import { CatGUniqueTypes } from '@dvsa/mes-test-schema/categories/G';
import { CatHUniqueTypes } from '@dvsa/mes-test-schema/categories/H';
import { CatKUniqueTypes } from '@dvsa/mes-test-schema/categories/K';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { TestReportBasePageComponent } from '@shared/classes/test-flow-base-pages/test-report/test-report-base-page';

type HomeCatTestDataUnion =
  | CatFUniqueTypes.TestData
  | CatGUniqueTypes.TestData
  | CatHUniqueTypes.TestData
  | CatKUniqueTypes.TestData;

@Component({
  selector: '.test-report-cat-home-test-page',
  templateUrl: './test-report.cat-home-test.page.html',
  styleUrls: ['./test-report.cat-home-test.page.scss'],
  standalone: false,
})
export class TestReportCatHomeTestPage extends TestReportBasePageComponent implements OnInit {
  constructor() {
    super();
    this.displayOverlay = false;
  }

  ngOnInit(): void {
    super.onInitialisation();
  }

  showManoeuvreButton = (): boolean => {
    return this.testCategory !== TestCategory.K;
  };
}
