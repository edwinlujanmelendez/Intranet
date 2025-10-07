import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Ng2TelInputModule } from 'ng2-tel-input';

import { ConsultaBoletosComponent } from './consulta-boletos/consulta-boletos.component';
import { PromocionesComponent } from './promociones/promociones.component';
import { ReporteVentasPasajesComponent } from './reporte-ventas-pasajes/reporte-ventas-pasajes.component';

const routes: Routes = [
  { path: 'consulta-boletos', component: ConsultaBoletosComponent },
  { path: 'promociones', component: PromocionesComponent },
  { path: 'reporte-ventas-pasajes', component: ReporteVentasPasajesComponent },
  {
    path: 'ventas-reserva',
    loadChildren: () => import('./ventas-reserva/ventas-reserva.module').then(m => m.VentasReservaModule)
  }
];

@NgModule({
  declarations: [
    ConsultaBoletosComponent,
    PromocionesComponent,
    ReporteVentasPasajesComponent
  ],
  imports: [CommonModule, FormsModule, Ng2TelInputModule, RouterModule.forChild(routes)]
})
export class OperacionesModule {}