import { Directive, HostListener, HostBinding, ElementRef } from '@angular/core';

@Directive({
  selector: '[appDropdown]'
})
export class DropdownDirective {
  @HostBinding('class.open') openDropdownMenu = false;

  constructor(private elementRef: ElementRef) { }
  
  @HostListener('document:click', ['$event']) click() {
    this.openDropdownMenu = this.elementRef.nativeElement.contains(event.target) ?
      !this.openDropdownMenu : false;
  }
}
