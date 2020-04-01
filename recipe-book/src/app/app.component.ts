import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  userContentSelection: string = 'recipes';

  onUserSelectedContent(userSelection: string) {
    this.userContentSelection = userSelection;
  }
}
