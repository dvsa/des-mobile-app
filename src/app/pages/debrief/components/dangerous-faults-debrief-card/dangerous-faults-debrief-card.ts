import { Component, Input } from '@angular/core';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';

@Component({
  selector: 'dangerous-faults-debrief-card',
  templateUrl: 'dangerous-faults-debrief-card.html',
  styleUrls: ['dangerous-faults-debrief-card.scss'],
})
export class DangerousFaultsDebriefCardComponent {

  @Input()
  public dangerousFaults: string[];

  @Input()
  public testCategory?: TestCategory;

}
