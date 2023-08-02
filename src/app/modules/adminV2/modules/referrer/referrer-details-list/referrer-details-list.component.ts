import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ReferrerService } from '../services/referrer.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-referrer-details-list',
  templateUrl: './referrer-details-list.component.html',
  styleUrls: ['./referrer-details-list.component.scss']
})
export class ReferrerDetailsListComponent {

  constructor(private referrerService: ReferrerService,private route: ActivatedRoute,private location:Location) { 
    this.routelocation = this.location
    this.referrerService.setSelectedUserForRefererView.subscribe((res: any) => {
      console.log(res);
      this.status = res.status;
      this.userId = res.id;
    });
  }
  @ViewChild('customTable') customTable: any
  data = [];
  status:any;
  userId:any;
  tableStructure: any = {
    displayColumns: [
      'more',
      'First Name',
      'Last Name',
      'Mobile No',
      'Email ID',
      'Business Country',
      'Company Name',
      'Account Status',
      'Actions',
    ],
    dataSource: new MatTableDataSource([]),
    compareDate: false,

    page: {
      previousPageIndex: 1,
      pageIndex: 0,
      pageSize: 10,
      length: 0,
    },
    selectedUserType: 'REFERRER'
  };
  routelocation:any;

  ngOnInit(): void {
    let payload = {
      page: 0, size: 10, status: this.status, userId: this.userId
    }
    this.fetchData(payload);

  }


  fetchData(payload: any) {
    this.referrerService.refererById(payload).subscribe({
      next: (response: any) => {
        this.tableStructure.page = {
          previousPageIndex: (response.page - 1),
          pageIndex: response.page,
          pageSize: response.size,
          length: response.totalElements,
        }
        let data = response.content.map((item: any) => {
          return {
            'First Name': item?.personalDetails?.firstName,
            'Last Name': item?.personalDetails?.lastName,
            'Mobile No': item?.personalDetails?.mobileNumber,
            'Email ID': item?.personalDetails?.email,
            'Business Country': item?.personalDetails?.country,
            'Company Name': item?.businessDetails?.companyName,
            'Account Status':(item.kycDetails?.[0]?.documentList[0]?.kycStatus == 'ACTIVE' && item.kycDetails?.[1]?.documentList[0]?.kycStatus == 'ACTIVE') ? 'Active' : (item.kycDetails?.[0]?.documentList[0]?.kycStatus == 'REJECTED' || item.kycDetails?.[1]?.documentList[0]?.kycStatus == 'REJECTED') ? 'Rejected' : 'Pending',
            'Actions':{
              from: 'referrerDetailsList',
              userId:item?.personalDetails?.username
            },

          }
        })
        this.tableStructure.dataSource = new MatTableDataSource(data);
        console.log(this.tableStructure.dataSource);
        this.customTable.refreshTable()
      }
    })
  }
  tableEventEmitter(event) {
    console.log(event)
    switch (event.eventName) {
      case 'paginationButton':
        this.goNextPrevious(event.event)
        break;
      case 'entrySize':
        this.changeEntrySize(event.event)
        break;
    }
  }
  goNextPrevious(data) {
    let payload = {
      page: data.pageIndex,
      size: data.pageSize,
      status: this.status,
      userId: this.userId
    }
    this.fetchData(payload);
  }
  changeEntrySize(data) {
    let payload = {
      page: data.pageIndex,
      size: data.pageSize,
      status: this.status,
      userId: this.userId
    }
    this.fetchData(payload);
  }

}
