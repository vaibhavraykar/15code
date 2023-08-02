import { Component } from '@angular/core';
import { ReportServices } from './services/report-services.service';
import { GeneralPopupComponent } from '../../../components/general-popup/general-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-report-download',
  templateUrl: './report-download.component.html',
  styleUrls: ['./report-download.component.scss']
})
export class ReportDownloadComponent {
  reportType: any;
  userId: any = '';
  dateFrom: string;
  dateTo: string;

  constructor(private dialog: MatDialog, private reportServices: ReportServices,
    private router: Router) {

  }
  myRights: any;
  myRole: any;

  ngOnInit() {
    this.myRights = JSON.parse(localStorage.getItem('rightsList'));
    const selectedRoleDetails = JSON.parse(localStorage.getItem('selectedRole'));
    this.myRole = selectedRoleDetails.name;
  }

  submitDownload() {
    const formattedDateFrom = new Date(this.dateFrom).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
    const formattedDateTo = new Date(this.dateTo).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });

    const [monthFrom, dayFrom, yearFrom] = formattedDateFrom.split('/').map(Number);
    const finalDateFrom = `${yearFrom}-${monthFrom.toString().padStart(2, '0')}-${dayFrom.toString().padStart(2, '0')}`;

    const [monthTo, dayTo, yearTo] = formattedDateTo.split('/').map(Number);
    const finalDateTo = `${yearTo}-${monthTo.toString().padStart(2, '0')}-${dayTo.toString().padStart(2, '0')}`;
    const payload = {
      reportType: this.reportType,
      userId: this.userId,
      dateFrom: finalDateFrom,
      dateTo: finalDateTo
    };

    console.log(payload);
    this.reportServices.downloadReport(payload).subscribe((res: any) => {
      console.log(res);
      const popup = this.dialog.open(GeneralPopupComponent, {
        width: '500px',
        height: '350px',
        data: {
          title: 'isAllGood',
          message: res['message'],
          status: res['success']
        },
        disableClose: true
      });
      if (res['success'] == true) {
        this.router.navigateByUrl('adminv2/report');
      }
    });

  }
}
