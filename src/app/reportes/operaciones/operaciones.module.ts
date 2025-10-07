import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { ReporteFrotcomComponent } from './reporte-frotcom/reporte-frotcom.component';

const routes: Routes = [
  { path: 'reporte-frotcom', component: ReporteFrotcomComponent }
];

@NgModule({
  declarations: [
    ReporteFrotcomComponent
  ],
  imports: [CommonModule, FormsModule, RouterModule.forChild(routes)]
})
export class OperacionesModule {}