import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ComponentsModule } from '@components/common/common-components.module';
import { DirectivesModule } from '@directives/directives.module';
import { AccompanimentCardADI3Component } from '@pages/waiting-room-to-car/cat-adi-part3/components/accompaniment-card/accompaniment-card';
import { DualControlsComponent } from '@pages/waiting-room-to-car/cat-adi-part3/components/dual-controls/dual-controls';
import { PDILogbookComponent } from '@pages/waiting-room-to-car/cat-adi-part3/components/pdi-logbook/pdi-logbook';
import { TraineeLicenceComponent } from '@pages/waiting-room-to-car/cat-adi-part3/components/trainee-licence/trainee-licence';
import { WaitingRoomToCarComponentsModule } from '../../components/waiting-room-to-car.components.module';

@NgModule({
	declarations: [TraineeLicenceComponent, AccompanimentCardADI3Component, DualControlsComponent, PDILogbookComponent],
	imports: [
		CommonModule,
		ComponentsModule,
		IonicModule,
		DirectivesModule,
		WaitingRoomToCarComponentsModule,
		ReactiveFormsModule,
	],
	exports: [DualControlsComponent, PDILogbookComponent, TraineeLicenceComponent, AccompanimentCardADI3Component],
})
export class WaitingRoomToCarCatADIPart3ComponentsModule {}
