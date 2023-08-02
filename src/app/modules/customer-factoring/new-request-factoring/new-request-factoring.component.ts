import { Component, ViewChild, TemplateRef } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { subscribeOn } from 'rxjs';
import { CommonPopupComponent } from 'src/app/components/common-popup/common-popup.component';
import { CustomerFactoringService } from '../customer-factoring.service';
export interface PeriodicElement {
  Assignor_Seller: String;
  Debotr_Buyer: string;
  Amount: Number;
  Due_Date: String;
  Invoice_Date: String
}
const ELEMENT_DATA: PeriodicElement[] = [
  { Assignor_Seller: 'Beyond India Exports', Debotr_Buyer: 'Global Foods Trading GmbH', Amount: 140000, Invoice_Date: '25/03/2023', Due_Date: '21/09/2023' },
];
@Component({
  selector: 'app-new-request-factoring',
  templateUrl: './new-request-factoring.component.html',
  styleUrls: ['./new-request-factoring.component.scss']
})
export class NewRequestFactoringComponent {
  public pagerConfig: any;
  public pageSizeOptions = [5, 10, 20, 30];
  // ,'View','Select','Submit'
  public selectedCheckboxes = [];
  value: any = '';
  factorPricing: any;
  data: any[] = [];
  selected?: any[];
  companies?: any[] = [];
  totalItems: number;
  totalPages: number;
  advanceRateValue: any='';
  interestRateValue: any='';
  factoringCommissionValue: any='';
  clickData: any;
  size: number = 10;
  dialogRef: MatDialogRef<any, any>;
  page = {
    index: 0,
    page: 0,
    size: 5,
    totalElements: 0,
    totalPages: 0,
  };
  dataLength: any = 0;
  pageIndex: any = 0;
  dataSource = new MatTableDataSource<Element[]>();
  @ViewChild('callAPIDialog') callAPIDialog: TemplateRef<any>;
  displayColumns: string[];
  noOfElements: any;
  last: any;
  selectStatus: any;
  showPrice: boolean = false;

  constructor(private custFactService: CustomerFactoringService, private router: Router, private dialog: MatDialog) {
    this.displayColumns = ['Assignor_Seller', 'Debotr_Buyer', 'Amount', 'Invoice_Date', 'Due_Date', 'Status', 'Comment', 'Pricing', 'Submit', 'View'];
    let payload = { status: 'PENDING', page: 0, size: 5 };
    this.fetchData(payload);

    this.selectStatus = {
      selected: '',
      ind: 0
    }

  }
  onSelect(e, index) {
    this.showPrice = true;
    console.log(this.selectStatus);
    this.selectStatus = []
    console.log(index, 'index');
    let selecteddata = [];
    let newobj = {
      selected: e.value,
      ind: index
    }
    selecteddata.push(newobj);
    this.selectStatus = selecteddata;
    console.log(this.selectStatus, 'this.selectStatus')
    this.value = e.value;
  }
  viewDetails(id) {
    this.router.navigate(['cust/view-tran/', id]);
  }
  fetchData(payload) {
    this.custFactService.getAllTransactionList(payload).subscribe((res: any) => {
      this.data = res.content;

      console.log(this.data);
      this.page.page = res.page;
      this.page.size = res.size;
      this.page.totalElements = res.totalElements;
      this.page.totalPages = res.totalPages;
      this.totalItems = res.totalElements;
      this.totalPages = res.totalPages;
      this.dataSource = new MatTableDataSource(this.data);
      this.dataLength = res.totalElements;
      this.pageIndex = res.pageIndex;
      this.noOfElements = Math.ceil(
        Number(this.page.totalElements) / Number(this.page.size)
      );
      const startIndex = Number(this.page.page) * Number(this.page.size);
      const endIndex = startIndex + Number(this.page.size);
    })
  }
  // pricing(e) {
  //   this.factorPricing = e;
  // }
  onPricingClick(status: string) {
    if (status === 'Interested') {
      // Open the dialog box
      this.dialogRef = this.dialog.open(this.callAPIDialog, {
        width: '500px',
        height: '400px',
      });
    }
  }
  okbutton(){
    this.dialogRef.close();
  }

  onSubmit(id, sta, comment) {
    let status;
    if (sta === 'Interested') {
      // Get the pricing values
      const advanceRate = this.advanceRateValue;
      const interestRate = this.interestRateValue;
      const factoringCommission = this.factoringCommissionValue;
      status = 'ACTIVE';
      // Create the payload
      const data = {
        id: id,
        status: status,
        comment: comment,
        factorPricing: {
          advanceRate: advanceRate,
          interestRate: interestRate,
          factoringCommission: factoringCommission
        }
      };
      console.log('data interested', data);
      this.updateTran(data);
  } else {
    status = 'INACTIVE';
    comment = '';
    const data = {
      id: id,
      status: status,
      comment: comment
    }
    console.log('data not interested',data);
    this.updateTran(data);
  }
}

// clearValues(): number {
//   this.advanceRateValue = '';
//   this.interestRateValue = '';
//   this.factoringCommissionValue = '';
//   return '';
// }



  updateTran(data) {
    this.custFactService.updateTranStatus(data).subscribe(res => {
      const popup = this.dialog.open(CommonPopupComponent, {
        width: '500px',
        height: '400px',
        data: {
          title: 'isAllGood',
          message: res['message'],
          status: res['success']
        },
      });
      let payload = { page: this.page.index, size: 5, status: 'PENDING' };
      this.fetchData(payload);
    })
  }
  pagePrevious() {
    this.page.index = this.page.index - 1;
    let payload = { page: this.page.index, size: 5, status: 'PENDING' };
    console.log(payload);
    this.fetchData(payload);
  }
  pageNext() {
    this.page.index = this.page.index + 1;
    let payload = { page: this.page.index, size: 5, status: 'PENDING' };
    console.log(payload);
    this.fetchData(payload);
  }
  getPage() {
    this.last =
      this.page.size * (this.page.index + 1) <
        this.page?.totalElements
        ? this.page.size * (this.page.index + 1)
        : this.page?.totalElements;
    if (this.page.index == 0) {
      if (this.page.size >= this.page.totalElements) {
        return `1 - ${this.page.totalElements}`;
      } else {
        return `1 - ${this.page.size}`;
      }
    } else {
      return `${this.page.index * this.page.size + 1} - ${this.last} `;
    }
  }
  isNumberKey(evt) {
    const charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode != 43 && charCode > 31 && (charCode < 48 || charCode > 57) && charCode == 45)
      return false;
    return true;
  }
  closeComment() {
    this.dialogRef.close();
  }
}
