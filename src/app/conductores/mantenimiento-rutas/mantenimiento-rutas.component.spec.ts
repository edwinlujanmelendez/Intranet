import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MantenimientoRutasComponent } from './mantenimiento-rutas.component';

describe('MantenimientoRutasComponent', () => {
  let component: MantenimientoRutasComponent;
  let fixture: ComponentFixture<MantenimientoRutasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MantenimientoRutasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MantenimientoRutasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
