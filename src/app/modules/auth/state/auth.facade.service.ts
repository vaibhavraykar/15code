import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as AuthSelectors from './auth.selectors';
import * as AuthActions from './auth.actions';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AdminService } from 'src/app/modules/admin/services/admin.service';
import { MatDialog } from '@angular/material/dialog';
import { SelectRoleComponent } from '../../admin/select-role/select-role.component';


@Injectable()
export class AuthFacadeService {
    getAuthResult$ = this.store.select(AuthSelectors.getAuthResult);
    getOTPResult$ = this.store.select(AuthSelectors.getSendOTPResult);
    getPasscodeResult$ = this.store.select(AuthSelectors.getPasscodeResult);
    myRights:any;
    constructor(private store : Store,
        private router:Router,
        private authService:AuthService,
        private adminService : AdminService,
        public dialog: MatDialog,
        ) {
    }

    loginUser(userId: string,
        password : string){
          if(userId?.toLowerCase().indexOf('ad') !== -1|| userId?.toLowerCase().indexOf('tf') !== -1)
           {
                this.adminService.getAdminToken(userId,password).subscribe((res:any)=>{
                    console.log(res);
                    this.adminService.setAdminToken(res.data[0]);
                    let manageDialogCount = document.querySelectorAll('#managerole_dialog').length
                    // this.router.navigateByUrl('/admin/dashboard');
                 if(manageDialogCount == 0){
                    if(res?.data?.[0].data?.[0].user_info.role.length > 1){
                        this.dialog.open(SelectRoleComponent,{
                            width: '500px',
                            height: '320px',
                            data:res.data[0]
                        }
                        )
                    }else{
                        localStorage.setItem('selectedRole',JSON.stringify(res?.data?.[0].data?.[0].user_info.role[0]));
                        this.adminService.getRightByRoleName(res?.data?.[0].data?.[0].user_info.role[0].name).subscribe((res:any)=>{
                          this.myRights = res.data[0].rights.map(x=>x.name);
                          localStorage.setItem('rightsList', JSON.stringify(this.myRights));
                          let loginElement = document.querySelector('.login-container')
                          loginElement.setAttribute('hidden','true')
                          this.router.navigateByUrl('/adminv2/dashboard');
                        })
                    }

                 }
                    // this.router.navigateByUrl('/admin/factoring/transaction-details')
                  })
            }
            else
            {
                this.store.dispatch(
                    AuthActions.LOGIN({userId, password})
                )
            }
    }

    sendOTP(
        userEmail:string,
        userName:string
    ){
        this.store.dispatch(
            AuthActions.OTPGENERATELOGIN({
                userEmail,userName
            })
        )
    }

    passcodeLogin(
        userName:string,
        empId:string,
        otp:string,
        email:string
    ){
        this.store.dispatch(
            AuthActions.PASSCODELOGIN({
                userName,empId,otp,email
            })
        )
    }


}
