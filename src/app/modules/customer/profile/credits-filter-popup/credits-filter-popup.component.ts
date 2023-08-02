import { Component, Inject, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TransactionService } from '../../transaction/services/transaction.service';
import { CustomerServicesService } from '../../services/customer-services.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSidenav } from '@angular/material/sidenav';
import { AuthService } from 'src/app/modules/auth/services/auth.service';

@Component({
  selector: 'app-credits-filter-popup',
  templateUrl: './credits-filter-popup.component.html',
  styleUrls: ['./credits-filter-popup.component.scss'],
})
export class CreditsFilterPopupComponent {
  @ViewChild('sideNav') sidenav!: MatSidenav;
  selectedMenu: any = 'Subsidiaries';
  companies: any;
  passcodeUsers: any;
  selectedSubsidiary: any;
  userDetails: any;
  selectedUser: any;
  selectedStatus = '';
  range!: FormGroup;
  additionalUsers: any = [];
  transactionStatus = [
    'ACTIVE',
    'ACCEPTED',
    'REJECTED',
    'EXPIRED',
    'CANCELLED',
    'CLOSED',
  ];
  subscriberType: any;
  fromTableType: any;
  loading:boolean = true;
  userType: any;
  constructor(
    private router: Router,
    private transactionService: TransactionService,
    private customerService: CustomerServicesService,
    private authService: AuthService,
    public dialogRef: MatDialogRef<CreditsFilterPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.userDetails = JSON.parse(localStorage.getItem('userInfo'));
    // this.subscriberType = this.userDetails?.subscriberType;
    // this.userType = JSON.parse(localStorage.getItem('userType'));
    let { additionalEmails } = JSON.parse(
      localStorage.getItem('userDetails') || '{}'
    );
    this.additionalUsers = additionalEmails;
    this.authService.getUserDetails().subscribe({
      next: (res: any) => {
        this.userType = res.data[0]?.userType;
        this.subscriberType = res.data[0]?.subscriberType;

        console.log(this.userType);
        this.selectedMenu =
          this.subscriberType === 'BANK' ? 'Passcode users' : 'Subsidiaries';
        if (this.subscriberType !== 'BANK_AS_UNDERWRITER') {
          if (this.userType === 'PASSCODE_USER') {
            console.log(this.userType);
            this.selectedMenu = 'date';
          } else {
            this.transactionService.getPasscodeUser().subscribe((res: any) => {
              console.log(res.data);
              this.passcodeUsers = res.data;
            });
            this.customerService
              .getGroupCompanySubsidiary()
              .subscribe((res: any) => {
                console.log(res.data[0].businessDetails);
                this.companies = res.data[0].businessDetails;
              });
          }
        } else {
          this.selectedMenu = 'additionalUser';
        }
      },
      complete:()=>{
        this.loading=false;
      }
    });

    this.fromTableType = this.data?.from;
    if (this.data?.from === 'PREVIOUS_TRANSACTION') {
      this.transactionStatus = this.transactionStatus.filter(
        (ele) => ele !== 'ACTIVE'
      );
    }
    this.createForm();
  }

  getToday() {
    return new Date();
  }

  checkedTheUser(item: any) {
    if (this.selectedUser === item.id) {
      this.selectedUser = '';
    } else {
      this.selectedUser = item.id;
    }
  }

  createForm() {
    this.range = new FormGroup({
      start: new FormControl(''),
      end: new FormControl(''),
    });
  }
  dateChange(e: any) {
    let data = {
      start: this.range.value.start,
      end: this.range.value.end,
    };
    console.log(data);
  }

  comapanyNameChange(e: any) {
    console.log(e);
    let data = this.companies.filter((item) => item.companyName == e);
    console.log(data);
    this.selectedSubsidiary = data[0].id;
    console.log(this.selectedSubsidiary);
  }

  passcodeUserSelected(e: any) {
    console.log(e);
    let data = this.passcodeUsers.filter((item) => item.name == e);
    console.log(data);
    this.selectedUser = data[0].id;
    console.log(this.selectedUser);
  }

  apply() {
    this.dialogRef.close({
      data: {
        subsidaryId: this.selectedSubsidiary,
        passcodeUserId: this.selectedUser,
        status: this.selectedStatus,
        date: {
          start: this.range.value.start,
          end: this.range.value.end,
        },
      },
    });
  }

  close() {
    this.dialogRef.close();
  }

  goTo(paramText: string) {
    this.selectedMenu = paramText;

    if (paramText == 'Subsidiaries') {
      // this.router.navigateByUrl('/dashboard/borrower-dashboard/my-dashboard');
    } else if (paramText == 'Passcode users') {
      // this.router.navigateByUrl('/dashboard/borrower-dashboard/repayment');
    }
  }

  transStatusSelected(item: any) {
    this.selectedStatus = item;
  }
}
