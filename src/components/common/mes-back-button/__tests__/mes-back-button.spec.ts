import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { configureTestSuite } from 'ng-bullet';
import { MesBackButtonComponent } from '../mes-back-button';

describe('MesBackButtonComponent', () => {
  const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl', 'navigate']);
  let fixture: ComponentFixture<MesBackButtonComponent>;
  let component: MesBackButtonComponent;
  const mockEvent = {
    preventDefault() {
    },
  } as Event;
  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [MesBackButtonComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
      ],
      imports: [
        IonicModule,
      ],
    });
  });
  beforeEach(async(() => {
    fixture = TestBed.createComponent(MesBackButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));
  describe('onClick', () => {
    it('should flip disableButton to true', async () => {
      component.routerLink = '';
      await component.onClick(mockEvent);
      expect(component.buttonDisabled).toEqual(true);
    });
    it('should call router.navigate with the correct parameters', async () => {
      const routerLinkValue = 'DashboardPage';
      component.routerLink = 'DashboardPage';
      await component.onClick(mockEvent);
      expect(routerSpy.navigate).toHaveBeenCalledWith([routerLinkValue]);
    });
  });
});
