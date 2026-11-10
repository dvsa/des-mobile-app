import { Component, Input } from '@angular/core';
import { CombinationCodes } from '@dvsa/mes-test-schema/categories/CPC';
import { IonCol, IonRow } from '@ionic/angular';

@Component({
  selector: 'combination-office',
  templateUrl: 'combination.html',
  imports: [IonRow, IonCol],
})
export class CombinationComponent {
  @Input()
  combination: CombinationCodes;

  @Input()
  combinationAdditionalText: string;

  getCombinationText(combinationText: CombinationCodes | null): string {
    return combinationText || 'N/A';
  }
}
