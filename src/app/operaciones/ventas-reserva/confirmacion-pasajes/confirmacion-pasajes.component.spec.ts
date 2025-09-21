import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmacionPasajesComponent } from './confirmacion-pasajes.component';

describe('ConfirmacionPasajesComponent', () => {
  let component: ConfirmacionPasajesComponent;
  let fixture: ComponentFixture<ConfirmacionPasajesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmacionPasajesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmacionPasajesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
