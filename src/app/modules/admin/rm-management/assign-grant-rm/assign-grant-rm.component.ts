import { Component, Input, ViewChild } from '@angular/core';
import { CommonPopupComponent } from 'src/app/components/common-popup/common-popup.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { RMService } from '../../services/RM/RM.service';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'app-assign-grant-rm',
  templateUrl: './assign-grant-rm.component.html',
  styleUrls: ['./assign-grant-rm.component.scss']
})
export class AssignGrantRmComponent {
  @ViewChild('paginator') paginator: MatPaginator;
  @Input() pageData?: any;
  @Input() assignRm: boolean;
  @Input() grantRm: boolean;
  displayTable:boolean=false;
  assignRmPayload: any;
  grantRmPayload: any;
  selectRMList: any = [];
  selectRMListMultiple: any = [];
  selectRM: any;
  selectedRM: any;
  selectedUserIds: number[] = [];
  rmEntity = [];
  getData: any;
  tableDataSource: any;
  commonDropdown = false;
  selectedIds: string[] = [];
  selectedUserId: string[] = [];
  selectedId: string[] = [];
  selectedElements: any[] = [];
  selectdID: any = [];
  noOfElements: any;
  finalFilteredRMList: any = [];
  newvaule: any[];
  oldRMSelectedList: any = [];
  data: any[] = [];
  fullData: any[] = [];
  selected?: any[];
  approveBydata: any = [];
  personalDetails: any[] = [];
  businessDetails: any[] = [];
  loginuserName: any;
  last: any;
  element: any;
  optionList: any;
  totalItems: number;
  totalPages: number;
  size: number = 10;
  pagesize: any = 5;
  page = {
    index: 0,
    page: 0,
    size: 5,
    totalElements: 0,
    totalPages: 0,
  };
  dataLength: any = 0;
  pageIndex: any = 0;

  assignRmColumns: string[] = [
    'Select',
    'User Id',
    'User Type',
    'Company/Bank',
    'First Name',
    'Last Name',
    'Country',
    'Select RM',
    'Action'

  ];
  grantRmColumns: string[] = [
    'User Id',
    'User Type',
    'Company/Bank',
    'First Name',
    'Last Name',
    'Country',
    'RM Id',
    'RM User',
    'Action'

  ];
  dataSource: any = new MatTableDataSource<Element[]>();
  status :any;
  payload:any;
  subscriberType = 'CUSTOMER';
  myRights:any;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private rmService: RMService) {

  }
  ngOnInit() {
    this.loginuserName = localStorage.getItem('userName');
    console.log(this.loginuserName);
    this.myRights = JSON.parse(localStorage.getItem('rightsList'));
  }
  onSubscriberTypeChange(target) {
    this.subscriberType = target.value;
    this.commonDropdown = false;
    let payload = { status: this.status, page: 0, size: this.pagesize, subscriberType: this.subscriberType };
    this.page.index = 0;
    this.fetchData(payload);
  }

  fetchData(payload: any) {
    //for testing
    this.rmService.rmSelected(payload).subscribe((res: any) => {
      console.log('RES', res.content)
      this.data = res.content;
      this.rmEntity = this.data.map(x => x.personalDetails);
      console.log('rm', this.rmEntity);
      this.page.page = res.page;
      this.page.size = res.size;
      this.page.totalElements = res.totalElements;
      this.page.totalPages = res.totalPages;
      this.totalItems = res.totalElements;
      this.totalPages = res.totalPages;
      this.dataSource = new MatTableDataSource(this.data);
      console.log(this.dataSource);
      this.noOfElements = Math.ceil(
        Number(this.page.totalElements) / Number(this.page.size)
      );
      const startIndex = Number(this.page.page) * Number(this.page.size);
      const endIndex = startIndex + Number(this.page.size);

      this.dataLength = res.totalElements;
      this.pageIndex = res.pageIndex;
    })
  }

  ngAfterViewInit() {
    this.dataSource = new MatTableDataSource(this.data);
    // this.tableDataSource.paginator = this.paginator;
  }
  commentSelected(event: any) {
    console.log(event);
    let choosenData = this.data.find(item => item.transactionId == event);
    let id = choosenData.id;
    console.log(id);
    const popup = this.dialog.open(CommonPopupComponent, {
      width: '500px',
      height: '350px',
      data: {
        title: 'isInfo',
        full_data: choosenData,
      },
    });
  }

  pagePrevious() {
    this.page.index = this.page.index - 1;
    this.payload = { status:this.status, page: this.page.index, size: this.pagesize, subscriberType: this.subscriberType };
    this.fetchData(this.payload);
  }
  pageNext() {
    this.page.index = this.page.index + 1;
    this.payload = { status:this.status, page: this.page.index, size: this.pagesize, subscriberType: this.subscriberType };
    this.fetchData(this.payload);
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
  onPageChange(event) {
    this.pagesize = event.pageSize;
    this.page.index =0;
    this.payload = { status:this.status, page: this.page.index, size: this.pagesize, subscriberType: this.subscriberType };
    if (this.assignRm) {
      // this.assignRmPayload.size = this.pagesize;
      // this.assignRmPayload.page = 0;
      this.fetchData(this.payload);
    } else if (this.grantRm) {
      // this.grantRmPayload.size = this.pagesize;
      // this.grantRmPayload.page = 0;
      this.fetchData(this.payload);
    }
  }
  onChangeRadio(e) {

    if (e.value == 'assign') {
      this.assignRm = true;
      this.grantRm = false;
      this.status='COMPLETED';
      this.subscriberType='CUSTOMER';
      this.assignRmPayload = { status:this.status, page: 0, size: this.pagesize, subscriberType: this.subscriberType };
      this.page.index = 0;
      this.fetchData(this.assignRmPayload);
      this.displayTable = true;
      // this.getSelectedRM();
    } else {
      this.grantRm = true;
      this.assignRm = false;
      this.status='MAKER_APPROVED';
      this.subscriberType='CUSTOMER';
      this.grantRmPayload = { status:this.status, page: 0, size: this.pagesize, subscriberType: this.subscriberType };
      this.page.index = 0;
      this.fetchData(this.grantRmPayload);
      this.displayTable = true;
    }
  }
  select(personalDetails: { country: string, subscriberType: string }) {
    this.selectedId = personalDetails["id"];
    // this.getSelectedRM(personalDetails.country, personalDetails.subscriberType);
    let data = {
      countryName: personalDetails.country.charAt(0).toUpperCase() + personalDetails.country.slice(1).toLowerCase(),
      subscriberType: personalDetails.subscriberType
    }
    this.rmService.getRMList(data).subscribe((res: any) => {
      this.selectRMList = res.data[0];
    })
  }
  getSelectedRM(country: string, subscriberType: string) {
    let data = {
      countryName: country.charAt(0).toUpperCase() + country.slice(1).toLowerCase(),
      subscriberType: subscriberType
    }
    this.rmService.getRMList(data).subscribe((res: any) => {
      this.selectRMList = res.data[0];
    })
  }
  selectMultiple(personalDetails: { country: string, subscriberType: string }) {
    this.getSelectedRM(personalDetails.country, personalDetails.subscriberType);
  }

  onCheckboxChange(event: MatCheckboxChange, element: any) {
    element.checked = event.checked;
    const selectedElements = this.dataSource.data.filter((el: any) => el.checked);
    if (selectedElements.length > 1) {
      this.commonDropdown = true;
      this.selectedIds = selectedElements.map((el: any) => el.personalDetails.id);
      const selectedData = selectedElements.map((el: any) => {
        return {
          country: el.personalDetails.country,
          subscriberType: el.personalDetails.subscriberType
        };
      })
      console.log('Selected Details at 0', selectedData[0]); //here what i have done is taken fields of first id so agar vo india ki jagah algeria bhi hoga to bhi vo india vale bata dega and what it should be is ki it should check if countriyName are different then give an error that choose the same countryName
      this.selectMultiple(selectedData[0]);
    } else {
      this.commonDropdown = false;
    }
  }
  onUserSelectionChange(selectedUserName: string) {
    const selectedUser = this.selectRMList.find((user) => user.firstName === selectedUserName);
    this.selectedUserId = selectedUser.id;
  }

  grantRmUpdate(id: any, rmStatusType: any) {
    console.log(id);
    let data = {
      id: id,
      status: rmStatusType
    }
    console.log('data line 218', data);

    const popup = this.dialog.open(CommonPopupComponent, {
      width: '500px',
      height: '310px',
      data: {
        title: 'isConfirm',
        full_data: data,
      },
    });
    popup.afterClosed().subscribe(dialogResult => {
      let result = dialogResult;
      if (dialogResult) {
        this.rmService.grantRmStatus(data).subscribe((res: any) => {
          console.log('status rm', res);
          const popup = this.dialog.open(CommonPopupComponent, {
            width: '500px',
            height: '350px',
            data: {
              title: 'isAllGood',
              message: res['message'],
              status: res['success']
            },
          });
          if (res['success'] == true) {
            this.payload = { status: 'MAKER_APPROVED', page: 0, size: this.pagesize, subscriberType: this.subscriberType };
            this.fetchData(this.payload);
          }
        })
      }
    });
  }
  onSubmit() {
    const payload = {
      id: this.selectedId,
      rmId: this.selectedUserId
    };
    this.rmService.submitAssignRM(payload).subscribe(res => {
      const popup = this.dialog.open(CommonPopupComponent, {
        width: '500px',
        height: '350px',
        data: {
          title: 'isAllGood',
          message: res['message'],
          status: res['success']
        },
      });
      if (res['success'] == true) {
        this.router.navigateByUrl('admin/dsb/assign-grant-rm');
        let assignpayload = {status:this.status, page: 0, size: this.pagesize, subscriberType: this.subscriberType};
        this.fetchData(assignpayload);
      }

    })
  }
  onSubmitMultiple() {
    const multipayload = {
      userId: this.selectedIds,
      rmId: this.selectedUserId
    };
    this.rmService.submitMultiAssignRM(multipayload).subscribe(res => {
      const popup = this.dialog.open(CommonPopupComponent, {
        width: '500px',
        height: '350px',
        data: {
          title: 'isAllGood',
          message: res['message'],
          status: res['success']
        },
      });
      if (res['success'] == true) {
        this.router.navigateByUrl('admin/dsb/assign-grant-rm');
        this.commonDropdown = false;
        let assignpayload = {status:this.status, page: 0, size: this.pagesize, subscriberType: this.subscriberType};
        this.fetchData(assignpayload);
      }

    })
  }

}
