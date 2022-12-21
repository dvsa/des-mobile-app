import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ComponentsModule } from '@components/common/common-components.module';
import { UnuploadedTestsPage } from '@pages/unuploaded-tests/unuploaded-tests.page';
import { UnuploadedTestsRoutingModule } from '@pages/unuploaded-tests/unuploaded-tests-routing.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    ComponentsModule,
    UnuploadedTestsRoutingModule,
  ],
  declarations: [UnuploadedTestsPage],
})
export class UnuploadedTestsModule {}
