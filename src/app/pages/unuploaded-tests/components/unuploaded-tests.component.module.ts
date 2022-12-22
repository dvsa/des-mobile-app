import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { DirectivesModule } from '@directives/directives.module';

import { PipesModule } from '@shared/pipes/pipes.module';
import { ComponentsModule } from '@components/common/common-components.module';
import { UnuploadedSlot } from '@pages/unuploaded-tests/components/unuploaded-slot/unuploaded-slot';

@NgModule({
  declarations: [
    UnuploadedSlot,
  ],
  imports: [
    ComponentsModule,
    CommonModule,
    IonicModule,
    DirectivesModule,
    IonicModule,
    FormsModule,
    PipesModule,
  ],
  exports: [
    UnuploadedSlot,
  ],
})
export class UnuploadedTestsComponentModule {}
