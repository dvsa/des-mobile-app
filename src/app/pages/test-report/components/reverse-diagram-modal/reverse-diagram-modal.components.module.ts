import { NgModule } from '@angular/core';
import { ReverseLeftComponent } from '../reverse-left/reverse-left';
import { CommonModule } from '@angular/common';
import { ReverseDiagramLinkComponent } from '../reverse-diagram-link/reverse-diagram-link';
import { ReverseLeftPopoverComponent } from '../reverse-left-popover/reverse-left-popover';
import { TestReportComponentsModule } from '../test-report-components.module';
import { ComponentsModule } from '@components/common/common-components.module';
import { IonicModule } from '@ionic/angular';

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
