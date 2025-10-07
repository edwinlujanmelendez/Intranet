import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Ng2TelInputModule } from 'ng2-tel-input';

import { ItinerarioComponent } from './itinerario/itinerario.component';
import { AsientosComponent } from './asientos/asientos.component';
import { ItinerarioRetornoComponent } from './itinerario-retorno/itinerario-retorno.component';
import { AsientosRetornoComponent } from './asientos-retorno/asientos-retorno.component';
import { DatosPasajerosComponent } from './datos-pasajeros/datos-pasajeros.component';
import { ConfirmacionPasajesComponent } from './confirmacion-pasajes/confirmacion-pasajes.component';

const routes: Routes = [
  { path: 'itinerario', component: ItinerarioComponent },
  { path: 'asientos', component: AsientosComponent },
  { path: 'itinerario-retorno', component: ItinerarioRetornoComponent },
  { path: 'asientos-retorno', component: AsientosRetornoComponent },
  { path: 'datos-pasajeros', component: DatosPasajerosComponent },
  { path: 'confirmacion-pasajes', component: ConfirmacionPasajesComponent }
];

@NgModule({
  declarations: [
    ItinerarioComponent,
    AsientosComponent,
    ItinerarioRetornoComponent,
    AsientosRetornoComponent,
    DatosPasajerosComponent,
    ConfirmacionPasajesComponent
  ],
  imports: [CommonModule, FormsModule, Ng2TelInputModule, RouterModule.forChild(routes)]
})
export class VentasReservaModule {}