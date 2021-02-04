import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

import { JournalNavigationComponent } from './journal-navigation/journal-navigation';

@NgModule({
  declarations: [
    JournalNavigationComponent,
  ],
  imports: [
    CommonModule,
    IonicModule,
  ],
  entryComponents: [
  ],
  exports: [
    JournalNavigationComponent,
  ],
})
export class JournalComponentsModule { }
