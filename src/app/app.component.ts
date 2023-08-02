import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = '360TF_WebApplication';

  constructor() {
    console.log('Version 1.2.24');
  }

}
