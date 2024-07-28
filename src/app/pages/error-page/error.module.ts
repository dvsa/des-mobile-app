import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from '@components/common/common-components.module';
import { IonicModule } from '@ionic/angular';
import { ErrorPage } from './error';

@NgModule({
	declarations: [ErrorPage],
	imports: [CommonModule, IonicModule, ComponentsModule],
	exports: [ErrorPage],
})
export class ErrorPageModule {}
