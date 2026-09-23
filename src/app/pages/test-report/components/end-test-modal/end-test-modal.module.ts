import { NgModule } from '@angular/core';

import { EndTestModal } from './end-test-modal';

import { IonicComponentsModule } from '@shared/modules/ionic-components.module';
@NgModule({
  declarations: [EndTestModal],

  exports: [EndTestModal],
  imports: [IonicComponentsModule],
})
export class EndTestModalModule {}
