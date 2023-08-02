import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { hide } from '@popperjs/core';
import { CommonPopupComponent } from '../common-popup/common-popup.component';
import { MatPaginator } from '@angular/material/paginator';
import { AdminService } from 'src/app/modules/admin/services/admin.service';
import { UserManagementService } from 'src/app/modules/admin/services/userManagement/userManagement.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit {
  @ViewChild('paginator') paginator: MatPaginator;
  @Output() editSelected: EventEmitter<any> = new EventEmitter();
  @Output() deleteSelected: EventEmitter<any> = new EventEmitter();
  @Output() viewSelectedForAdminUser: EventEmitter<any> = new EventEmitter();
  @Output() updateAdminStatus: EventEmitter<any> = new EventEmitter();
  @Output() updateImage: EventEmitter<any> = new EventEmitter();
  @Output() selectedTransactions: EventEmitter<any> = new EventEmitter();
  @Output() pagePreviousHandler: EventEmitter<any> = new EventEmitter();
  @Output() pageNextHandler: EventEmitter<any> = new EventEmitter();
  @Output() commentSelected: EventEmitter<any> = new EventEmitter();
  @Output() downloadSelected:EventEmitter<any>=new EventEmitter();
  @Input() displayedColumns: string[];
  @Input() dataSource: any[] = [];
  @Input() imageShow?: boolean = false;
  @Input() viewComment?: boolean = false;
  @Input() selectOption?: boolean = false;
  @Input() viewDelete?: boolean = false;
  @Input() totalItems?: number;
  @Input() totalPages?: number;
  @Input() page?: number;
  @Input() pageData?: any;
  @Input() showComments: boolean;
  @Input() showDownload: boolean;
  @Input() viewEdit: boolean;
  @Input() view: boolean;
  @Input() onlyview: boolean;
  @Input() acceptReject: boolean;
  getData: any;
  tableDataSource: any;
  selectdID: any = [];
  noOfElements: any;
  last: any;
  approveBydata:any=[];
  loginuserName: any;
  @Output() viewPrice: EventEmitter<any> = new EventEmitter();

  constructor(private dialog: MatDialog,
    private adminService:AdminService,private userService:UserManagementService,private router: Router) {
      this.dataSource=[];
    }

  ngOnInit(): void {
    this.getData = this.displayedColumns;
    console.log(this.getData[9], 'col');
    if (this.getData[9] == 'Time') {
      this.imageShow = true;
    }
    if (this.viewComment == true) {
      this.displayedColumns?.push('Actions');
      for (let i = 0; i < this.dataSource?.length; i++) {
        this.dataSource[i]['Actions'] = 'View';
        this.dataSource[i]['Select'] = '';
      }
      console.log(this.dataSource);
    }
    if (this.selectOption == true) {
      this.displayedColumns.unshift('Select');
      for (let i = 0; i < this.dataSource?.length; i++) {
        this.dataSource[i]['Select'] = '';
      }
    }

    this.tableDataSource = new MatTableDataSource(this.dataSource);
    this.tableDataSource.paginator = this.paginator;
    console.log(this.paginator);
    this.noOfElements = Math.ceil(
      Number(this.pageData.totalElements) / Number(this.pageData.size)
    );
    const startIndex = Number(this.pageData.page) * Number(this.pageData.size);
    const endIndex = startIndex + Number(this.pageData.size);
    this.userService.approveByData.subscribe((res:any)=>{
      if(res){ 
        this.approveBydata=res;
       }
       })
       this.loginuserName = localStorage.getItem('userName');
       console.log(this.loginuserName);
  }

  ngAfterViewInit() {
    this.tableDataSource.paginator = this.paginator;
  }

  ngOnChanges(e: SimpleChanges) {
    if (this.viewComment == true) {
      let d = e['dataSource'].currentValue;
      if(d){
      for (let i = 0; i < d?.length; i++) {
        d[i]['Actions'] = 'View';
        d[i]['Select'] = '';
      }
      this.tableDataSource = new MatTableDataSource(d);
      }
    }
    if (this.selectOption == true) {
      let d = e['dataSource'].currentValue;
      if(d){
      for (let i = 0; i < d?.length; i++) {
        d[i]['Select'] = '';
      }
      this.tableDataSource = new MatTableDataSource(d);
      }
    }
  }
  edit(id: any) {
    console.log(id);
    this.editSelected.emit(id);
  }

  delete(id:any){
    console.log(id);
    this.deleteSelected.emit(id);
  }

  selectionChange(event: any, element: any) {
    console.log(element);
    if (this.selectdID.includes(element['Transaction ID'])) {
      let index = this.selectdID.findIndex(
        (ele: any) => ele === element['Transaction ID']
      );
      this.selectdID.splice(index, 1);
    } else {
      this.selectdID.push(element['Transaction ID']);
    }

    this.selectedTransactions.emit(this.selectdID);
  }

  handlePageEvent(event: any) {
    console.log(event);
  }
  comment(e:any) {
    let selectedID = e['Transaction ID'];
    console.log(e['Transaction ID']);
    console.log(e);
    this.commentSelected.emit(selectedID);
    
    
  }

  download(e:any){
    let transactionId=e['Transaction ID'];
    console.log(transactionId);
    this.downloadSelected.emit(transactionId);
  }

  selectionAllChange(event: any) {
    console.log(event);
    if (event.checked) {
      for (let ele of this.dataSource) {
        this.selectdID.push(ele['Transaction ID']);
      }
      this.selectedTransactions.emit(this.selectdID);
    } else {
      this.selectdID = [];
      this.selectedTransactions.emit(this.selectdID);
    }
  }
  pagePrevious() {
    this.pagePreviousHandler.emit();
  }
  pageNext() {
    this.pageNextHandler.emit();
  }
  getPage() {
    this.last =
      this.pageData.size * (this.pageData.index + 1) <
      this.pageData?.totalElements
        ? this.pageData.size * (this.pageData.index + 1)
        : this.pageData?.totalElements;
    if (this.pageData.index == 0) {
      if (this.pageData.size >= this.pageData.totalElements) {
        return `1 - ${this.pageData.totalElements}`;
      } else {
        return `1 - ${this.pageData.size}`;
      }
    } else {
      // this.last =
      //   this.pageData.size * (this.pageData.index + 1) <
      //   this.pageData?.totalElements
      //     ? this.pageData.size * (this.pageData.index + 1)
      //     : this.pageData?.totalElements;

      return `${this.pageData.index * this.pageData.size + 1} - ${this.last} `;
    }
  }
  getConvertedDate(date: any) {
    console.log(date);
    return '';
  }
  onlyviewforAdmin(id: any) {
    console.log(id);
    this.viewSelectedForAdminUser.emit(id);
  }
  updateStatusForAdmin(id:any, status: any){
    console.log(id);
    this.updateAdminStatus.emit({id,status});
  }
  viewPricing(id){
    this.viewPrice.emit({id});
  }
}
