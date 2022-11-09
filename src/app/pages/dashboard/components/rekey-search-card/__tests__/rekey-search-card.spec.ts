import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterMock } from '@mocks/angular-mocks/router-mock';
import { REKEY_SEARCH_PAGE } from '@pages/page-names.constants';
import { IonicModule } from '@ionic/angular';
import { RekeySearchCardComponent } from '../rekey-search-card';

fdescribe('RekeySearchCardComponent', () => {
  let component: RekeySearchCardComponent;
  let fixture: ComponentFixture<RekeySearchCardComponent>;
  let router: Router;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [RekeySearchCardComponent],
      imports: [IonicModule],
      providers: [
        { provide: Router, useClass: RouterMock },
      ],
    });

    fixture = TestBed.createComponent(RekeySearchCardComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
  }));

  describe('Class', () => {
    describe('navigateToRekey', () => {
      it('should trigger navigation to rekey', async () => {
        await component.navigateToRekeySearch();
        expect(router.navigate).toHaveBeenCalledWith([REKEY_SEARCH_PAGE]);
      });
    });
  });
});
