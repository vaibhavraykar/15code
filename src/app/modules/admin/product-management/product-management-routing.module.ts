import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { ProductListComponent } from './product-list/product-list.component';
import { AddProductComponent } from './add-product/add-product.component';
import { ViewProductComponent } from './view-product/view-product.component';
import { EditProductComponent } from './edit-product/edit-product.component';
import { AcceptRejectProductComponent} from './accept-reject-product/accept-reject-product.component';

const routes: Routes = [
  {
    path:'dsb',
    component: SidebarComponent,
    children: [
      { path: "", redirectTo: "/dsb/product-list", pathMatch: "full" },
      {
        path: 'product-list',
        component:ProductListComponent
      },{
        path:'add-product',
        component:AddProductComponent
      },{
        path:'view-product/:id',
        component:ViewProductComponent
      },
      {
        path:'edit-product/:id',
        component:EditProductComponent
      },{
        path:'accept-reject-product',
        component:AcceptRejectProductComponent
      }
    ]
  }

];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes),
    CommonModule
  ]
})
export class ProductManagementRoutingModule { }