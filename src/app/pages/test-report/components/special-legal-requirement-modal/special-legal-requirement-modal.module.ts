import { NgModule } from '@angular/core';
import { ComponentsModule } from '@components/common/common-components.module';
import { IonicModule } from '@ionic/angular';
import { SpecialLegalRequirementModal } from './special-legal-requirement-modal';

@NgModule({
	declarations: [SpecialLegalRequirementModal],
	imports: [ComponentsModule, IonicModule],
	exports: [SpecialLegalRequirementModal],
})
export class SpecialLegalRequirementModalModule {}
