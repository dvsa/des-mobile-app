import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ComponentsModule } from '@components/common/common-components.module';

import { CandidateDetailsPage } from './candidate-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
  ],
  declarations: [
    CandidateDetailsPage,
  ],
})
export class CandidateDetailsPageModule {}
