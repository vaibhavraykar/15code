import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ComponentsModule } from 'src/app/components/components.module';
import { AllMaterialModule } from 'src/app/material-module';
import { ProductManagementRoutingModule } from './product-management-routing.module';
import { ProductListComponent } from './product-list/product-list.component';
import { EditProductComponent } from './edit-product/edit-product.component';
import { ViewProductComponent } from './view-product/view-product.component';
import { AddProductComponent } from './add-product/add-product.component';
import { AcceptRejectProductComponent } from './accept-reject-product/accept-reject-product.component';
import { CustomerFactoringModule } from "../../customer-factoring/customer-factoring.module";


@NgModule({
    declarations: [
        ProductListComponent,
        ViewProductComponent,
        EditProductComponent,
        AddProductComponent,
        AcceptRejectProductComponent
    ],
    exports: [
        ProductListComponent,
        ViewProductComponent,
        EditProductComponent,
        AddProductComponent,
        AcceptRejectProductComponent
    ],
    imports: [
        CommonModule,
        ProductManagementRoutingModule,
        ComponentsModule,
        AllMaterialModule,
        CustomerFactoringModule
    ]
})
export class ProductManagementModule { }