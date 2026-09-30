import { Component, Input } from '@angular/core';
import { ComponentsModule } from '@components/common/common-components.module';
import { ETAPhysicalType } from '@dvsa/mes-test-schema/categories/common';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { IonCol, IonRow, IonText } from '@ionic/angular';
import { flattenArray } from '@pages/view-test-result/view-test-result-helpers';
import { TestDataUnion } from '@shared/unions/test-schema-unions';
import { get } from 'lodash-es';

@Component({
  selector: 'test-result-eta-card',
  templateUrl: './eta-card.component.html',
  styleUrls: ['./eta-card.component.scss'],
  imports: [ComponentsModule, IonRow, IonText, IonCol],
})
export class EtaCardComponent {
  @Input() shouldHaveSeparator = false;
  @Input() category: TestCategory;
  @Input() data: TestDataUnion;

  get eTA(): string {
    const eta: string[] = [];

    if (get(this.data, 'ETA.physical')) {
      eta.push('Physical');
    }
    if (get(this.data, 'ETA.verbal')) {
      if (get(this.data, 'ETA.physical')) {
        eta.push('verbal');
      } else {
        eta.push('Verbal');
      }
    }
    if (eta.length === 0) {
      eta.push('None');
    }
    return flattenArray(eta);
  }

  showExtendedETA(): boolean {
    return Object.keys(get(this.data, 'ETA.physicalType', {})).length > 0;
  }

  getExtendedETA(): ETAPhysicalType {
    return get(this.data, 'ETA.physicalType', {});
  }
}
