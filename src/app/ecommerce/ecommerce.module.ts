import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { SimularPagosComponent } from './simular-pagos/simular-pagos.component';

const routes: Routes = [
  { path: 'simular-pagos', component: SimularPagosComponent }
];

@NgModule({
  declarations: [
    SimularPagosComponent
  ],
  imports: [CommonModule, FormsModule, RouterModule.forChild(routes)]
})
export class EcommerceModule {}