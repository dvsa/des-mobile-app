import { Component, Input } from '@angular/core';
import { CombinationCodes } from '@dvsa/mes-test-schema/categories/CPC';
import { IonCol, IonRow, IonText } from '@ionic/angular';

@Component({
  selector: 'module-assessment',
  templateUrl: 'module-assessment.html',
  styleUrls: ['module-assessment.scss'],
  imports: [IonRow, IonCol, IonText],
})
export class ModuleAssessmentComponent {
  @Input()
  combinationCode: CombinationCodes;
}
