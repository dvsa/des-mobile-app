import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { PracticeModeOptionsBar } from '@components/common/practice-mode-options-bar/practice-mode-options-bar';

import { provideBasePageMocks } from '@mocks/test-providers';
import { StoreModule } from '@ngrx/store';
import { TestFlowPageNames } from '@pages/page-names.constants';
import { MockComponent } from 'ng-mocks';
import { PostDebriefHoldingPage } from '../post-debrief-holding.page';

describe('PostDebriefHoldingPage', () => {
  let fixture: ComponentFixture<PostDebriefHoldingPage>;
  let component: PostDebriefHoldingPage;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        RouterModule.forRoot([]),
        StoreModule.forRoot({}),

        StoreModule.forFeature('tests', () => ({})),
        PostDebriefHoldingPage,
        MockComponent(PracticeModeOptionsBar),
      ],
      providers: [provideBasePageMocks()],
    });

    fixture = TestBed.createComponent(PostDebriefHoldingPage);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate');
  });

  describe('Class', () => {
    it('should create component', () => {
      expect(component).toBeTruthy();
    });

    describe('continueButton', () => {
      it('should call navigateToPage function', async () => {
        vi.useFakeTimers();
        try {
          await component.continueButton();
          await vi.advanceTimersByTimeAsync(0);
          expect(router.navigate).toHaveBeenCalledWith([TestFlowPageNames.NON_PASS_FINALISATION_PAGE]);
        } finally {
          vi.useRealTimers();
        }
      });
    });
  });
});
