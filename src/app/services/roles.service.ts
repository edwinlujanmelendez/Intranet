import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RolesService {
  
  private permisos: Record<string, number[]> = {
    VentaReservaPasajes: [1, 2],
    ReporteVentasPasajes: [1, 3],
    Promociones: [1]
  };

  constructor(){ }

  manejarVistas(menu: keyof RolesService['permisos'], rolId: number): boolean {
    return this.permisos[menu].includes(rolId);
  }
}