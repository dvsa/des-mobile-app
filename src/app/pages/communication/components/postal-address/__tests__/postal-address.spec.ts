import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTestTranslations } from '@mocks/test-providers';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { TranslateService } from '@ngx-translate/core';
import { PostalAddressComponent } from '../postal-address';

describe('PostalAddressComponent', () => {
  let fixture: ComponentFixture<PostalAddressComponent>;
  let component: PostalAddressComponent;
  let translate: TranslateService;

  const mockAddress = {
    addressLine1: '1 Somewhere',
    addressLine2: '2 Someplace',
    addressLine3: '3 Sometown',
    addressLine4: '4 Somecity',
    addressLine5: '5 Somecountry',
    postcode: 'AB12 3CD',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PostalAddressComponent],
      providers: [provideTestTranslations()],
    });

    fixture = TestBed.createComponent(PostalAddressComponent);
    component = fixture.componentInstance;
    translate = TestBed.inject(TranslateService);
    translate.setFallbackLang('en');
  });

  describe('Class', () => {
    describe('ngOnInit', () => {
      it('should call formatAddress', () => {
        vi.spyOn(component, 'formatAddress').mockReturnValue(mockAddress);
        component.ngOnInit();
        expect(component.postalAddress).toEqual(mockAddress);
      });
    });

    describe('formatAddress', () => {
      it('should replace all numbers with x`s', () => {
        const formatted = component.formatAddress(mockAddress);
        expect(formatted.addressLine1).toEqual('x Somewhere');
        expect(formatted.addressLine2).toEqual('x Someplace');
        expect(formatted.addressLine3).toEqual('x Sometown');
        expect(formatted.addressLine4).toEqual('x Somecity');
        expect(formatted.addressLine5).toEqual('x Somecountry');
        expect(formatted.postcode).toEqual('ABxx xCD');
      });
    });
  });
});
