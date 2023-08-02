import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin.component';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { FactoringModule } from './factoring/factoring.module';
import { UserManagementModule } from '../admin/user-mangement/user-Mangement.module';
import { SidebarModule } from '../admin/sidebar/sidebar.module';
import { SliderComponent } from '../auth/slider/slider.component';
import {DiscountManagementModule} from '../admin/discount-management/discount-management.module';
import { FactorModule } from './factor/factor.module';
import { SelectRoleModule } from './select-role/select-role.module';
import { ProductManagementModule } from './product-management/product-management.module';
import { RmModule } from '../admin/rm-management/rm-management.module';
import { CustomerKycModule } from './customer/customer.module';
import { GrantModule } from '../admin/grant-transaction/grant-transaction.module';
import { bankUnderwriterModule } from './bankUnderwriter/bankUnderwriter.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { RefererModule } from './referer/referer.module';



const routes: Routes = [
  {
    path: '',
    component:AdminComponent
  },
  {
    path:'login',
    component:LoginComponent
  },
  {
    path:'factoring',
    loadChildren: () => import('./factoring/factoring.module').then(m => m.FactoringModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  {
    path: 'auth',
    loadChildren: () => import('../auth/auth.module').then(m => m.AuthModule)
  },
  {
    path:'user',
    loadChildren: () => import('./user-mangement/user-Mangement.module').then(m => m.UserManagementModule)
  },
  {
    path:'discount',
    loadChildren: () => import('./discount-management/discount-management.module').then(m => m.DiscountManagementModule)
  },
  { path: 'sidebar', loadChildren: () => import('./sidebar/sidebar.module').then(m => m.SidebarModule) },
  {
    path:'factor',
    loadChildren: () => import('./factor/factor.module').then(m=>m.FactorModule)
  },
  {
    path:'product',
    loadChildren: () => import('./product-management/product-management.module').then(m => m.ProductManagementModule)
  },
  { path: 'rm', loadChildren: () => import('./rm-management/rm-management.module').then(m => m.RmModule) },
  {
    path:'customer',
    loadChildren:() => import('./customer/customer.module').then(m => m.CustomerKycModule)
  },
  { path: 'grant', loadChildren: () => import('./grant-transaction/grant-transaction.module').then(m => m.GrantModule) },
  {
    path:'baau',
    loadChildren:() => import('./bankUnderwriter/bankUnderwriter.module').then(m=>m.bankUnderwriterModule)
  },
  { path: 'referer', loadChildren: () => import('./referer/referer.module').then(m => m.RefererModule) },

];

@NgModule({
  declarations: [

    LoginComponent,
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    ComponentsModule,
    FactoringModule,
    UserManagementModule,
    SidebarModule,
    SliderComponent,
    FactorModule,
    DiscountManagementModule,
    SelectRoleModule,
    ProductManagementModule,
    RmModule,
    CustomerKycModule,
    GrantModule,
    bankUnderwriterModule,
    DashboardModule,
    RefererModule


  ]
})
export class AdminModule { }
