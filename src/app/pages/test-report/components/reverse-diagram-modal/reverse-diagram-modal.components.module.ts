import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from '@components/common/common-components.module';
import { IonicModule } from '@ionic/angular';
import { ReverseLeftComponent } from '../reverse-left/reverse-left';
import { ReverseDiagramLinkComponent } from '../reverse-diagram-link/reverse-diagram-link';
import { ReverseLeftPopoverComponent } from '../reverse-left-popover/reverse-left-popover';
import { TestReportComponentsModule } from '../test-report-components.module';

@NgModule({
  declarations: [
    ReverseLeftComponent,
    ReverseDiagramLinkComponent,
    ReverseLeftPopoverComponent,
  ],
  imports: [
    CommonModule,
    TestReportComponentsModule,
    ComponentsModule,
    IonicModule,
  ],
  exports: [
    ReverseLeftComponent,
    ReverseDiagramLinkComponent,
    ReverseLeftPopoverComponent,
  ],
})
export class ReverseDiagramModalComponentsModule { }
