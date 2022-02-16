import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { Component, OnInit } from '@angular/core';

export interface VehicleData {
  vLength: number; // VehicleLength
  vWidth: number; // VehicleWidth
  expStartDist: number; // Expected distanceFromStart
  expMidDist: number; // Expected distanceFromMiddle
  expWidthDist: number; // Expected distanceOfBayWidth
  expMidDistMultiplier: string; // Expected multiplierText
}

@Component({
  template: '',
})
export class ReverseDiagramModalMock implements OnInit {
  vehicleDetails: Map<TestCategory, VehicleData>;
  cappedStartDistance: TestCategory[];

  public getCappedStartDistanceCategories() {
    return this.cappedStartDistance;
  }

  public getVehicleDetails(): Map<TestCategory, VehicleData> {
    return this.vehicleDetails;
  }

  ngOnInit(): void {
    this.cappedStartDistance = [TestCategory.C1EM, TestCategory.CEM, TestCategory.DEM, TestCategory.D1EM];
    this.vehicleDetails = new Map([
      [TestCategory.BE, {
        vLength: 10,
        vWidth: 2.75,
        expStartDist: 40,
        expMidDist: 20,
        expWidthDist: 4.13,
        expMidDistMultiplier: '2',
      }],
      [TestCategory.CM, {
        vLength: 10,
        vWidth: 2.75,
        expStartDist: 35,
        expMidDist: 15,
        expWidthDist: 4.13,
        expMidDistMultiplier: '1 1/2',
      }],
      [TestCategory.CEM, {
        vLength: 10,
        vWidth: 2.75,
        expStartDist: 40,
        expMidDist: 20,
        expWidthDist: 4.13,
        expMidDistMultiplier: '2',
      }],
      [TestCategory.C1M, {
        vLength: 10,
        vWidth: 2.75,
        expStartDist: 35,
        expMidDist: 15,
        expWidthDist: 4.13,
        expMidDistMultiplier: '1 1/2',
      }],
      [TestCategory.C1EM, {
        vLength: 10,
        vWidth: 2.75,
        expStartDist: 40,
        expMidDist: 20,
        expWidthDist: 4.13,
        expMidDistMultiplier: '2',
      }],
      [TestCategory.DM, {
        vLength: 10,
        vWidth: 2.75,
        expStartDist: 35,
        expMidDist: 15,
        expWidthDist: 4.13,
        expMidDistMultiplier: '1 1/2',
      }],
      [TestCategory.DEM, {
        vLength: 10,
        vWidth: 2.75,
        expStartDist: 40,
        expMidDist: 20,
        expWidthDist: 4.13,
        expMidDistMultiplier: '2',
      }],
      [TestCategory.D1M, {
        vLength: 10,
        vWidth: 2.75,
        expStartDist: 35,
        expMidDist: 15,
        expWidthDist: 4.13,
        expMidDistMultiplier: '1 1/2',
      }],
      [TestCategory.D1EM, {
        vLength: 10,
        vWidth: 2.75,
        expStartDist: 40,
        expMidDist: 20,
        expWidthDist: 4.13,
        expMidDistMultiplier: '2',
      }],
    ]);
  }
}
