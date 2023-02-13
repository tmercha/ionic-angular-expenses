import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appCurrencyDecimals]'
})
export class CurrencyDecimalsDirective {
  //this regex describes a number with 1 decimal point and only 2 decimal places after the decimal point 
  private regex: RegExp = new RegExp(/^\d*\.?\d{0,2}$/g);
  private specialKeys: Array<string> = [ 'Backspace', 'Tab', 'End', 'Home', '-' ];

  constructor(private el: ElementRef) { }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    //allow backspace, tab, end, home keys
    if (this.specialKeys.indexOf(event.key) !== -1) {
      return;
    }
    //compare a concatenation of current entry plus new key to regex above
    //block if does not match regex
    let current: string = this.el.nativeElement.value;
    let next: string = current.concat(event.key);
    if (next && !String(next).match(this.regex)) {
      event.preventDefault();
    }
  }
}
