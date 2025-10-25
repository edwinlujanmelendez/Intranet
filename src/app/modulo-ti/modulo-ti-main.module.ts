import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { AsistenteSqlInteligenteComponent } from './asistente-sql-inteligente/asistente-sql-inteligente.component';

const routes: Routes = [
  { path: 'asistente-sql-inteligente', component: AsistenteSqlInteligenteComponent }
];

@NgModule({
  declarations: [AsistenteSqlInteligenteComponent],
  imports: [CommonModule, FormsModule, RouterModule.forChild(routes)]
})
export class ModuloTiMainModule {}