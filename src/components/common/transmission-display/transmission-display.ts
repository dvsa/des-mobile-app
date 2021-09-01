import { Component, Input } from '@angular/core';
import { GearboxCategory } from '@dvsa/mes-test-schema/categories/common';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';

enum GearBox {
  AUTOMATIC_NOT_SUBMITTED = 'Automatic - An automatic licence issued',
  AUTOMATIC_SUBMITTED = 'Automatic',
  MANUAL = 'Manual',
  CODE78 = 'Automatic - No code 78 - A manual licence issued',
}

@Component({
  selector: 'transmission-display',
  templateUrl: 'transmission-display.html',
})
export class TransmissionDisplayComponent {

  @Input()
  transmission: GearboxCategory;

  @Input()
  code78: boolean;

  @Input()
  category: TestCategory;

  @Input()
  isTestSubmitted: boolean = false;

  getTransmissionText(): GearBox {
    const code78Categories: TestCategory[] = [TestCategory.C, TestCategory.CE, TestCategory.D, TestCategory.DE];
    if (this.transmission === GearBox.MANUAL) {
      return GearBox.MANUAL;
    }
    if (
      code78Categories.includes(this.category)
      && this.transmission as GearBox !== GearBox.MANUAL
      // tslint:disable-next-line
      && this.code78 === false
    ) {
      return GearBox.CODE78;
    }
    return this.transmission === 'Automatic' && this.isTestSubmitted
      ? GearBox.AUTOMATIC_SUBMITTED
      : GearBox.AUTOMATIC_NOT_SUBMITTED;
  }
}
