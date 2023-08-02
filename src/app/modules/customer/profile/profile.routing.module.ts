import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { MyProfileComponent } from 'src/app/modules/customer/profile/my-profile/my-profile.component';
import { ChangePasswordComponent } from 'src/app/modules/customer/profile/change-password/change-password.component';
import { CreditTransactionsComponent } from 'src/app/modules/customer/profile/credit-transactions/credit-transactions.component';
import { ManageGroupsComponent } from 'src/app/modules/customer/profile/manage-groups/manage-groups.component';
import { SupportComponent } from 'src/app/modules/customer/profile/support/support.component';
import { VASPlanComponent } from 'src/app/modules/customer/profile/vas-plan/vas-plan.component';
import { SubscriptionComponent } from 'src/app/modules/customer/profile/subscription/subscription.component';
import { PersonalDetailsComponent } from './personal-details/personal-details.component';
import { KycSuccessPageComponent } from './kyc-success-page/kyc-success-page.component';

const routes: Routes = [
    { 
      path: '',
      component:MyProfileComponent
    },
    { 
      path: 'change-password',
      component:ChangePasswordComponent
    },{ 
      path: 'credit-transaction',
      component:CreditTransactionsComponent
    },{ 
      path: 'manage',
      component:ManageGroupsComponent
    },{ 
      path: 'support',
      component:SupportComponent
    }
    ,{ 
      path: 'vas-plan',
      component:VASPlanComponent
    }
    ,{ 
      path: 'subscription',
      component:SubscriptionComponent
    },
   {
    path: 'perosnal-details',
    component: PersonalDetailsComponent
   },{
    path:'kyc-success',
    component:KycSuccessPageComponent
   }
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
