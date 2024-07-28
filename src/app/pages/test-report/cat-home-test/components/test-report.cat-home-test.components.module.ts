import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from '@components/common/common-components.module';
import { DirectivesModule } from '@directives/directives.module';
import { IonicModule } from '@ionic/angular';
import { TestReportComponentsModule } from '../../components/test-report-components.module';
import { VehicleChecksComponent } from './vehicle-checks/vehicle-checks';

@NgModule({
	declarations: [VehicleChecksComponent],
	imports: [
		CommonModule,
		ComponentsModule,
		TestReportComponentsModule,
		IonicModule,
		DirectivesModule,
		ComponentsModule,
	],
	exports: [VehicleChecksComponent],
})
export class TestReportCatHomeTestComponentsModule {}
