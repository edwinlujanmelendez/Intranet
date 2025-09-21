import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosPasajerosComponent } from './datos-pasajeros.component';

describe('DatosPasajerosComponent', () => {
  let component: DatosPasajerosComponent;
  let fixture: ComponentFixture<DatosPasajerosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatosPasajerosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatosPasajerosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
