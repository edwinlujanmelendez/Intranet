import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FormularioRetenComponent } from './formulario-reten/formulario-reten.component';
import { MantenimientoRutasComponent } from './mantenimiento-rutas/mantenimiento-rutas.component';
import { ReporteTareoConductorComponent } from './reporte-tareo-conductor/reporte-tareo-conductor.component';

const routes: Routes = [
  { path: 'formulario-reten', component: FormularioRetenComponent },
  { path: 'mantenimiento-rutas', component: MantenimientoRutasComponent },
  { path: 'reporte-tareo-conductor', component: ReporteTareoConductorComponent }
];

@NgModule({
  declarations: [
    FormularioRetenComponent,
    MantenimientoRutasComponent,
    ReporteTareoConductorComponent
  ],
  imports: [CommonModule, FormsModule, RouterModule.forChild(routes)]
})
export class ConductoresModule {}