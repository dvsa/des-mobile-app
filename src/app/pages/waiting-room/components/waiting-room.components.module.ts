import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from '@components/common/common-components.module';
import { DirectivesModule } from '@directives/directives.module';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { CBTNumberComponent } from './cbt-number/cbt-number';
import { ConductedLanguageComponent } from './conducted-language/conducted-language';
import { InsuranceDeclarationComponent } from './insurance-declaration/insurance-declaration';
import { ManoeuvresPassCertificateComponent } from './manoeuvres-pass-cert/manoeuvres-pass-cert';
import { ResidencyDeclarationComponent } from './residency-declaration/residency-declaration';

@NgModule({
	declarations: [
		ConductedLanguageComponent,
		InsuranceDeclarationComponent,
		ResidencyDeclarationComponent,
		CBTNumberComponent,
		ManoeuvresPassCertificateComponent,
	],
	imports: [IonicModule, TranslateModule, ComponentsModule, ReactiveFormsModule, CommonModule, DirectivesModule],
	exports: [
		ConductedLanguageComponent,
		InsuranceDeclarationComponent,
		ResidencyDeclarationComponent,
		CBTNumberComponent,
		ManoeuvresPassCertificateComponent,
	],
})
export class WaitingRoomComponentsModule {}
