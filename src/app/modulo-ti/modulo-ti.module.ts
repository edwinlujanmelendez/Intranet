import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { AuditoriaBoletosComponent } from './auditoria-boletos/auditoria-boletos.component';
import { VersionesComponent } from './versiones/versiones.component';

const routes: Routes = [
  { path: 'auditoria-boletos', component: AuditoriaBoletosComponent },
  { path: 'versiones', component: VersionesComponent }
];

@NgModule({
  declarations: [
    AuditoriaBoletosComponent,
    VersionesComponent
  ],
  imports: [CommonModule, FormsModule, RouterModule.forChild(routes)]
})
export class ModuloTiModule {}