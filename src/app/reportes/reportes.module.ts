import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: 'operaciones',
    loadChildren: () => import('./operaciones/operaciones.module').then(m => m.OperacionesModule)
  }
];

@NgModule({
  declarations: [],
  imports: [CommonModule, FormsModule, RouterModule.forChild(routes)]
})
export class ReportesModule {}