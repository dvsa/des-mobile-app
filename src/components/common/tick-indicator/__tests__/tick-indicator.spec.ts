import { Config, IonicModule } from '@ionic/angular';
import { ConfigMock } from 'ionic-mocks';
import { ComponentFixture, waitForAsync, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TickIndicatorComponent } from '../tick-indicator';

describe('TickIndicatorComponent', () => {
  let fixture: ComponentFixture<TickIndicatorComponent>;
  let component: TickIndicatorComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        TickIndicatorComponent,
      ],
      providers: [
        { provide: Config, useFactory: () => ConfigMock.instance() },
      ],
      imports: [
        IonicModule,
      ],
    });

    fixture = TestBed.createComponent(TickIndicatorComponent);
    component = fixture.componentInstance;
  }));

  describe('DOM', () => {
    it('should not be ticked when tick is false', () => {
      component.ticked = false;
      fixture.detectChanges();
      const tickDe = fixture.debugElement.query(By.css('.tick-background.ticked'));
      expect(tickDe).toBeNull();
    });
    it('should be ticked when tick is true', () => {
      component.ticked = true;
      fixture.detectChanges();
      const tickDe = fixture.debugElement.query(By.css('.tick-background.ticked'));
      expect(tickDe).toBeDefined();
    });
  });
});
