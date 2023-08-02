import { Component, DoCheck } from '@angular/core';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent implements DoCheck {
  isLoading =false
  constructor(public loader: LoaderService) { }
  ngDoCheck(): void {
  this.isLoading=this.loader.getLoading()
  }

}
