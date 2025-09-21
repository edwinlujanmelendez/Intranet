import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteVentasPasajesComponent } from './reporte-ventas-pasajes.component';

describe('ReporteVentasPasajesComponent', () => {
  let component: ReporteVentasPasajesComponent;
  let fixture: ComponentFixture<ReporteVentasPasajesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReporteVentasPasajesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteVentasPasajesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
