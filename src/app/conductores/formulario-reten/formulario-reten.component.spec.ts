import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioRetenComponent } from './formulario-reten.component';

describe('FormularioRetenComponent', () => {
  let component: FormularioRetenComponent;
  let fixture: ComponentFixture<FormularioRetenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormularioRetenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormularioRetenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
