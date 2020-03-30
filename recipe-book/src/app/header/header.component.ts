import { Component, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html'
})
export class HeaderComponent {
    collapsed = true;
    @Output() userSelectedContent = new EventEmitter<string>(); 

    onSelect(selection: string) {
        this.userSelectedContent.emit(selection);
    }
}