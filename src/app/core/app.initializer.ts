// import { AuthService } from 'src/app/modules/auth/services/auth.service';

// export function appInitializer(authService: AuthService) {

//     const url: any = window.location.href;

//     const refresh_token: any = localStorage.getItem('refreshToken');

//     return () => new Promise((resolve:any) => {
//         // resolve(true);
//         if (
//             refresh_token &&
//             refresh_token != '' &&
//             refresh_token != 'undefined'
//           ) {
//             authService
//               .getTokens(refresh_token)
//               .subscribe((response:any) => {
//                 authService.setTokens(response);
//                 if (url) {
//                   resolve(true);
//                 }
//               })
//               .add(resolve);

//           } else {
//             setTimeout(() => {
//               resolve('foo');
//             }, 300);
//           }
//     })

// }
import { Router } from '@angular/router';
import { AuthService } from 'src/app/modules/auth/services/auth.service';

export function appInitializer(authService: AuthService, router: Router,) {
  const url: any = window.location.href;

  const refresh_token: any = localStorage.getItem('refreshToken');
  const user_detail: any = localStorage.getItem('userInfo');
  return () =>
  new Promise((resolve: any) => {
    if (
      // refresh_token &&
      // refresh_token !== '' &&
      // refresh_token !== 'undefined' &&
      user_detail &&
      user_detail !== '' &&
      user_detail !== 'undefined'
    ) {
      authService.getUserDetails().subscribe((res:any)=>{
        localStorage.removeItem('userType')
        authService.userDetails=res.data;
        localStorage.setItem('userDetails', JSON.stringify(res.data[0].personalDetails))
        localStorage.setItem('kycDetails', JSON.stringify(res.data[0].kycDetails))
        localStorage.setItem('userType', JSON.stringify(res.data[0].userType));
        localStorage.setItem('bankType', res.data[0].bankType);
        localStorage.setItem(
          'onBoardingStatus',
          res.data[0].onboardingStepsStatus
        );
        console.log('im here')
        if(url){
          resolve(true);
        }


      }).add(resolve);
      // authService
      //   .getUserDetails(user_detail)
      //   .subscribe((response: any) => {
      //     authService.setUserDetails(response);
      //     if (url) {
      //       resolve(true);
      //     }
      //   })
      //   .add(resolve);
      resolve(true);
    } else {
      setTimeout(() => {
        resolve('foo');
      }, 300);
    }
  });

}
