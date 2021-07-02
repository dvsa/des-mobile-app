import { Component, Input } from '@angular/core';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';

@Component({
  selector: 'serious-faults-debrief-card',
  templateUrl: 'serious-faults-debrief-card.html',
  styleUrls: ['serious-faults-debrief-card.scss'],
})
export class SeriousFaultsDebriefCardComponent {

  @Input()
  public seriousFaults: string[];

  @Input()
  public testCategory?: TestCategory;

}
