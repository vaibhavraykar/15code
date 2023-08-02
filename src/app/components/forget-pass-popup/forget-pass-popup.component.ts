import { DialogRef } from '@angular/cdk/dialog';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forget-pass-popup',
  templateUrl: './forget-pass-popup.component.html',
  styleUrls: ['./forget-pass-popup.component.scss'],
})
export class ForgetPassPopupComponent {
  constructor(private dialog: DialogRef<ForgetPassPopupComponent>,
    private router: Router) {}
  close() {
    this.dialog.close();
  }
  backtoLogin() {
    this.dialog.close();
    this.router.navigateByUrl('auth/login');
  }
}
