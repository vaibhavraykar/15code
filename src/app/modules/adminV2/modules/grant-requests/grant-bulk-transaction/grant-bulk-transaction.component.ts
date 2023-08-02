import { Component, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { GrantRequestsServices } from "../services/grant-requests-services.services";
import { MatTableDataSource } from "@angular/material/table";

@Component({
	selector: "app-bulk-transaction",
	templateUrl: "./grant-bulk-transaction.component.html",
	styleUrls: ["./grant-bulk-transaction.component.scss"],
})
export class GrantBulkTransaction {
	loginuserName: string;
	constructor(private router: Router, private grantRequestServices: GrantRequestsServices) { }
	@ViewChild('customTable') customTable: any
	data = []
	tableStructure: any = {
	  displayColumns: [
		'more',
		'User Id',
		'Mobile',
		'Email',
		'Beneficiary',
		'B. Country',
		'Applicant',
		'A. Country',
		'Trxn Id',
		'Date',
		'Trxn Validity',
		'IB',
		'Amount',
		'Currency',
		'Requirement',
		'Trxn Status',
		'Action'
	  ],
	  dataSource: new MatTableDataSource([]),
	  // compareDate: true,
	  columnKeys: [],
	  filters: [],
  
	  page: {
		previousPageIndex: 1,
		pageIndex: 0,
		pageSize: 10,
		length: 0,
	  },
  
	  transaction: {
		showTransType: false,
		selectedTransactionType: 'DRAFT',
  
	  }
  
	};
  
  
  
	ngOnInit(): void {
		// this.loginuserName = localStorage.getItem('userName');
	  this.grantRequestServices.getSelectedTabIndex().subscribe((index: number) => {
		if (index === 8) { 
		  let payload = {
			page: 0,
			size: 10,
			searchBy : "RM",
			status: 'DRAFT',
			
		  }
		  this.fetchData(payload);
		}
	  });
  
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
		case 'approveTransaction':
		  this.onUpdateTransaction(event.event)
		  break;
		case 'filter':
		  this.applyFilter(event.event);
		  break;
	  }
	}
  
	changeTransType(status: any) {
	  let payload = {
		page: 0,
		size: 10,
		searchBy : "RM",
		status: 'DRAFT'
	  }
	  this.fetchData(payload);
	}
  
	fetchData(payload: any) {
	  this.grantRequestServices.getBulkTransactionList(payload).subscribe({
		next: (response: any) => {
			console.log(response,'res')
		  this.tableStructure.page = {
			previousPageIndex: (response.page - 1),
			pageIndex: response.page,
			pageSize: response.size,
			length: response.totalElements,
		  }
		  let data = response.content.map((item: any) => {
			return {
			  'User Id': item?.userId,
			  'Mobile': item?.mobileNo,
			  'Email': item?.email,
			  'Beneficiary': item?.beneName,
			  'B. Country': item?.beneBankCountry,
			  'Applicant': item?.applicantName,
			  'A. Country': item?.applicantCountry,
			  'Trxn Id': item?.mtransactionId,
			  'Date': item?.date,
			  'Trxn Validity': item?.validity,
			  'IB': item?.lcissuanceBank,
			  'Amount': item?.lcvalue.toLocaleString('en'),
			  'Currency': item?.lccurrency,
			  'Requirement': item?.requirementType,
			  'Trxn Status': item?.transactionStatus,
			  'Action': {
				from: 'grant_bulk_transaction',
				trxnId: item?.mtransactionId,
				// makerApprovedBy: item?.transactionAdminManagement.makerRejectApproveBy,
				status: item?.transactionStatus
			  }
			}
		  })
		  this.tableStructure.columnKeys = this.getColumnKeys();
		  this.tableStructure.dataSource = new MatTableDataSource(data);
		  this.customTable.refreshTable();
		}
	  })
	}
  
  
	goNextPrevious(data) {
	  let payload = {
		page: data.pageIndex,
		size: data.pageSize,
		searchBy : "RM",
		status: 'DRAFT'
	  }
	  this.fetchData(payload);
	}
  
	changeEntrySize(data) {
	  let payload = {
		page: data.pageIndex,
		size: data.pageSize,
		status: 'DRAFT',
		searchBy : "RM"
	  }
	  this.fetchData(payload);
	}
	onUpdateTransaction(approveTransaction) {
	  let payload = {
		page: 0,
		size: 10,
		status: 'DRAFT',
		searchBy : "RM",
	  }
	  this.fetchData(payload);
	}
  
	getColumnKeys() {
	  this.grantRequestServices.metaFilter().subscribe((res: any) => {
		const newData = res.data;
		console.log('Data', newData);
		const fieldInfo = newData[0].fieldInfo;
		this.tableStructure.columnKeys = fieldInfo.map((field) => ({
		  value: field.key,
		  viewValue: field.key.toUpperCase(),
		  fieldType: this.getType(field.value),
		}));
  
		console.log(this.tableStructure.columnKeys);
	  })
	}
  
	getType(value) {
	  switch (value) {
		case 'long':
		  return 'LONG';
		case 'String':
		  return 'STRING';
		case 'double':
		  return 'DOUBLE';
		case 'Boolean':
		  return 'BOOLEAN';
		case 'Integer':
		  return 'INTEGER';
		default:
		  return 'UNKNOWN';
	  }
	}
  
	applyFilter(e) {
	  console.log(e)
	  if (e.filters[0].key && e.filters[0].fieldType && e.filters[0].operator && e.filters[0].value) {
		this.fetchFilteredSearch(e);
	  } else {
		let payload = {
		  page: 0,
		  size: 10,
		  status: 'DRAFT',
		  searchBy : "RM",
		};
		this.fetchData(payload);
	  }
  
	}
  
	fetchFilteredSearch(e) {
	  if(Array.isArray(e)){
		var updatedFilters = e.map((filter) => {
		  return {
			...filter,
			status: 'DRAFT'
		  };
		});
		console.log(updatedFilters);
	  }else{
		e.status= 'DRAFT'
  
		updatedFilters = e;
	  }
	  this.grantRequestServices.getFilterd(e).subscribe({
		next: (res: any) => {
		  let response = res.content;
		  this.tableStructure.page = {
			previousPageIndex: res.page - 1,
			pageIndex: res.page,
			pageSize: res.size,
			length: res.totalElements,
		  };
		  let data = response.map((item: any) => {
			return {
			  'User ID': item?.userId,
			  Mobile: item?.mobileNo,
			  'Email ID': item?.email,
			  Beneficary: item?.beneName,
			  B_Country: item?.beneBankCountry,
			  Applicant: item?.applicantName,
			  A_Country: item.applicantCountry,
			  'Transaction ID': item?.mtransactionId,
			  'Date & Time': item?.date,
			  'Trans Validity': item?.validity,
			  'Issuing Bank': item?.lcissuanceBank,
			  Amount: item?.lcvalue,
			  CCY: item?.lccurrency,
			  Requirement: item?.requirementType,
			  'Trxn Status': item?.transactionStatus,
			  'Min. Commision Amt': item?.minimumCommisionAmount,
			  'Min. Commision %': item?.minimumCommisionPercentage,
			  'Plan Type': item?.planType,
			  Quotes: item?.noOfQuotation,
			  Action: {
				from: 'primary_transaction',
				status: item?.transactionStatus,
				trxnId: item?.mtransactionId,
			  },
			};
		  });
		  this.tableStructure.dataSource = new MatTableDataSource(data);
		  this.customTable.refreshTable();
		},
	  });
	}
}