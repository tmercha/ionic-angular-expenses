import { CurrencyDecimalsDirective } from './currency-decimals.directive';
import { ElementRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';

describe('CurrencyDecimalsDirective', () => {
  let directive: CurrencyDecimalsDirective;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CurrencyDecimalsDirective,
        { provide: ElementRef, useValue: { nativeElement: { } } }
      ]
    });

    directive = TestBed.inject(CurrencyDecimalsDirective);
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });
});
