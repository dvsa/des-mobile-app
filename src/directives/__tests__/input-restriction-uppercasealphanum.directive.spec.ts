import { Component, DebugElement } from '@angular/core';
import { InputRestrictionUppercaseAlphanumDirective } from '../input-restriction-uppercasealphanum.directive';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

@Component({
  template: `<input type="text" uppercaseAlphanumOnly>`,
})
class TestAlphaNumComponent {
}

describe('Directive: InputRestrictionUppercaseAlphanumDirective', () => {
  let fixture: ComponentFixture<TestAlphaNumComponent>;
  let inputElement: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        TestAlphaNumComponent,
        InputRestrictionUppercaseAlphanumDirective,
      ],
    });
    fixture = TestBed.createComponent(TestAlphaNumComponent);
  });
  it('should upper case input and remove spaces and non alpha numeric chars', () => {
    fixture.detectChanges();
    inputElement = fixture.debugElement.query(By.css('input'));
    inputElement.nativeElement.value = '_aBc!@ £$%^&123)(*&^%$£@   []{}`~';
    inputElement.nativeElement.dispatchEvent(new Event('input'));
    expect(inputElement.nativeElement.value).toEqual('ABC123');
  });
});
