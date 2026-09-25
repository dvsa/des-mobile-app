import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreModule } from '@ngrx/store';
import { AppConfigProviderMock } from '@providers/app-config/__mocks__/app-config.mock';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { DateTimeProviderMock } from '@providers/date-time/__mocks__/date-time.mock';
import { DateTimeProvider } from '@providers/date-time/date-time';
import { SlotProvider } from '@providers/slot/slot';
import { journalReducer } from '@store/journal/journal.reducer';
import { testsReducer } from '@store/tests/tests.reducer';
import { IncompleteTestsBanner } from '../incomplete-tests-banner';

describe('IncompleteTestsBanner', () => {
  let fixture: ComponentFixture<IncompleteTestsBanner>;
  let component: IncompleteTestsBanner;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IncompleteTestsBanner],
      imports: [
        StoreModule.forRoot({
          tests: testsReducer,
          journal: journalReducer,
        }),
      ],
      providers: [
        { provide: DateTimeProvider, useClass: DateTimeProviderMock },
        { provide: SlotProvider, useClass: SlotProvider },
        { provide: AppConfigProvider, useClass: AppConfigProviderMock },
      ],
    });

    fixture = TestBed.createComponent(IncompleteTestsBanner);
    component = fixture.componentInstance;
  });

  describe('getIncompleteText', () => {
    it('should return a message for multiple tests', () => {
      expect(component.getIncompleteText(2)).toEqual('You have incomplete tests');
    });

    it('should return a message for a single test', () => {
      expect(component.getIncompleteText(1)).toEqual('You have an incomplete test');
    });
  });
});
