import { Injectable } from '@angular/core';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { VehicleDetailsUnion } from '@shared/unions/test-schema-unions';
import { ReversingLengths } from './reversing-lengths.model';

interface VehicleMultipliers {
  widthMultiplier: number;
  lengthMultiplier: number;
  distanceMultiplier: number;
}

@Injectable()
export class ReversingDistancesProvider {

  distanceValues: Map<TestCategory, VehicleMultipliers>;

  public getDistanceValues() : Map<TestCategory, VehicleMultipliers> {
    if (!this.distanceValues) {
      this.distanceValues = new Map([
        [TestCategory.BE, { lengthMultiplier: 4, widthMultiplier: 1.5, distanceMultiplier: 2 }],
        [TestCategory.CM, { lengthMultiplier: 3.5, widthMultiplier: 1.5, distanceMultiplier: 1.5 }],
        [TestCategory.CEM, { lengthMultiplier: 4, widthMultiplier: 1.5, distanceMultiplier: 2 }],
        [TestCategory.C1M, { lengthMultiplier: 3.5, widthMultiplier: 1.5, distanceMultiplier: 1.5 }],
        [TestCategory.C1EM, { lengthMultiplier: 4, widthMultiplier: 1.5, distanceMultiplier: 2 }],
        [TestCategory.DM, { lengthMultiplier: 3.5, widthMultiplier: 1.5, distanceMultiplier: 1.5 }],
        [TestCategory.DEM, { lengthMultiplier: 4, widthMultiplier: 1.5, distanceMultiplier: 2 }],
        [TestCategory.D1M, { lengthMultiplier: 3.5, widthMultiplier: 1.5, distanceMultiplier: 1.5 }],
        [TestCategory.D1EM, { lengthMultiplier: 4, widthMultiplier: 1.5, distanceMultiplier: 2 }],
      ]);
    }
    return this.distanceValues;
  }

  public getDistanceLength(data: VehicleDetailsUnion, category: TestCategory): ReversingLengths {
    if (!this.getDistanceValues().has(category)) {
      return { startDistance: 52.5, middleDistance: 30 };
    }
    const distanceFromStart = data.vehicleLength * this.distanceValues.get(category).lengthMultiplier;
    const distanceFromMiddle = data.vehicleLength * this.distanceValues.get(category).distanceMultiplier;

    switch (category) {
      case TestCategory.CEM:
      case TestCategory.C1EM:
      case TestCategory.DEM:
      case TestCategory.D1EM:
        return ({
          startDistance: data.vehicleLength > 16.5 ? 66 : Number(distanceFromStart.toFixed(2)),
          middleDistance: data.vehicleLength > 16.5
            ? Number((66 - (data.vehicleLength * 2)).toFixed(2))
            : Number(distanceFromMiddle.toFixed(2)),
        });
      default:
        return ({
          startDistance: Number(distanceFromStart.toFixed(2)),
          middleDistance: Number(distanceFromMiddle.toFixed(2)),
        });
    }
  }

  public getDistanceWidth(data: VehicleDetailsUnion, category: TestCategory): number {
    if (!this.getDistanceValues().has(category)) {
      return 3;
    }
    const distanceOfBayWidth = data.vehicleWidth * this.distanceValues.get(category).widthMultiplier;
    return Number(distanceOfBayWidth.toFixed(2));
  }

}
