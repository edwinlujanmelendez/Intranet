import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  /*
    1:  SUPERUSUARIO
    29: CALL CENTER - BACKOFFICE
    18: CALL CENTER - OPERADOR
    37: CALL CENTER - ESTRUCTURA
    47: OPERACIONES
  */
  
  private permisos: Record<string, number[]> = {
    VentaReservaPasajes: [1, 29, 18, 37],
    ReporteVentasPasajes: [1, 29, 18, 37],
    Promociones: [1],
    ReporteFrotcom: [1, 47]
  };

  constructor(){ }

  manejarVistas(menu: keyof RolesService['permisos'], rolId: number): boolean {
    return this.permisos[menu].includes(rolId);
  }
}