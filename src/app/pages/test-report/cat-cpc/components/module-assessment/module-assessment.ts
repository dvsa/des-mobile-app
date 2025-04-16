import { Component, Input } from '@angular/core';
import { CombinationCodes } from '@dvsa/mes-test-schema/categories/CPC';

@Component({
  selector: 'module-assessment',
  templateUrl: 'module-assessment.html',
  styleUrls: ['module-assessment.scss'],
  standalone: false,
})
export class ModuleAssessmentComponent {
  @Input()
  combinationCode: CombinationCodes;
}
