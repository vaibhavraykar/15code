import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-customers',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomersComponent {
  
  constructor() { }
  @ViewChild('customTable') customTable: any
  data = []




  ngOnInit(): void {

  }


}
