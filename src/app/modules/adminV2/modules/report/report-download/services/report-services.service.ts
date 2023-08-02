import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ReportServices {
    DOWNLOAD_REPORT = '/v2/reports/download';

  constructor(private http: HttpClient) {}

  downloadReport(data: any) {
    return this.http.post(`${environment.admin_url}${this.DOWNLOAD_REPORT}`,data);
  }
}
