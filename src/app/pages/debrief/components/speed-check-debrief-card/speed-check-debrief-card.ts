import { Component, Input } from '@angular/core';
import { Avoidance, EmergencyStop } from '@dvsa/mes-test-schema/categories/AM1';
import { TranslateService } from '@ngx-translate/core';
import { configureI18N } from '@shared/helpers/translation.helpers';
import { Language } from '@store/tests/communication-preferences/communication-preferences.model';

@Component({
  selector: 'speed-check-debrief-card',
  templateUrl: 'speed-check-debrief-card.html',
  styleUrls: ['speed-check-debrief-card.scss'],
})
export class SpeedCheckDebriefCardComponent {

  constructor(
    private translate: TranslateService,
  ) {}

  @Input()
  public emergencyStop: EmergencyStop;

  @Input()
  public avoidance: Avoidance;

  @Input()
  public avoidanceAttempted: boolean;

  @Input()
  public isTranslatable: boolean = true;

  ngOnInit(): void {
    if (!this.isTranslatable) {
      configureI18N(Language.ENGLISH, this.translate);
    }
  }

}
