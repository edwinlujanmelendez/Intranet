import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaBoletosComponent } from './consulta-boletos.component';

describe('ConsultaBoletosComponent', () => {
  let component: ConsultaBoletosComponent;
  let fixture: ComponentFixture<ConsultaBoletosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultaBoletosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultaBoletosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
