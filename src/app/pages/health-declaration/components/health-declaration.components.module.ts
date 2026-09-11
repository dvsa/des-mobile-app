import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from '@components/common/common-components.module';
import { DirectivesModule } from '@directives/directives.module';

import {TranslatePipe} from '@ngx-translate/core';
import { HealthDeclarationModal } from '@pages/health-declaration/components/health-declaration-modal/health-declaration-modal';
import { HealthDeclarationComponent } from './health-declaration/health-declaration';
import { ReceiptDeclarationComponent } from './receipt-declaration/receipt-declaration';
import {IonButton, IonCard, IonCol, IonRow} from "@ionic/angular";

@NgModule({
  declarations: [HealthDeclarationComponent, ReceiptDeclarationComponent, HealthDeclarationModal],
  imports: [ComponentsModule, ReactiveFormsModule, CommonModule, DirectivesModule, IonCol, IonRow, TranslatePipe, IonCard, IonButton],
  exports: [HealthDeclarationComponent, ReceiptDeclarationComponent],
})
export class HealthDeclarationComponentsModule {}
