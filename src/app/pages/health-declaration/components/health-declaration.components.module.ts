import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from '@components/common/common-components.module';
import { DirectivesModule } from '@directives/directives.module';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { HealthDeclarationModal } from '@pages/health-declaration/components/health-declaration-modal/health-declaration-modal';
import { HealthDeclarationComponent } from './health-declaration/health-declaration';
import { ReceiptDeclarationComponent } from './receipt-declaration/receipt-declaration';

@NgModule({
  declarations: [HealthDeclarationComponent, ReceiptDeclarationComponent, HealthDeclarationModal],
  imports: [IonicModule, TranslateModule, ComponentsModule, ReactiveFormsModule, CommonModule, DirectivesModule],
  exports: [HealthDeclarationComponent, ReceiptDeclarationComponent],
})
export class HealthDeclarationComponentsModule {}
